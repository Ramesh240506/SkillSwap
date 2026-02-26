import { Request, Response } from "express";

import { ServiceOffering } from "../models/ServiceOffering.model";
import { User } from "../models/User.modal";
import { Booking } from "../models/ServiceBooking.model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { offeringId, sessionDate, timeSlot } = req.body;

    const requesterId = req.user!._id;

    // Validation
    if (
      !offeringId ||
      !Array.isArray(sessionDate) ||
      sessionDate.length === 0 ||
      !timeSlot
    ) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // Fetch offering
    const offering = await ServiceOffering.findById(offeringId);

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    // Calculate sessions & credits
    const totalSessionsBooked = sessionDate.length;
    const creditsUsed = totalSessionsBooked * offering.creditsPerSession;

    // Check requester credits
    const requester = await User.findById(requesterId);

    if (!requester ) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    // Deduct credits
    // requester.credits -= creditsUsed;
    await requester.save();

    // Create booking
    const newBooking = new Booking({
      offeringId,
      requesterId,
      sessionDate,
      timeSlot,
      totalSessionsBooked,
      creditsUsed,
      status: "CONFIRMED",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOfferedCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const courses = await ServiceOffering.find({ providerId: userId });

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMySessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    
    const bookings = await Booking.find({ requesterId: userId })
      .populate({
        path: "offeringId",
        populate: {
          path: "providerId",
          select: "name"
        }
      });

    // Map backend status to frontend status
    const statusMap: Record<string, string> = {
      'CONFIRMED': 'active',
      'COMPLETED': 'completed',
      'CANCELLED': 'disputed'
    };

    // Transform bookings to session format
    const sessions = bookings.map((booking: any) => ({
      id: booking._id.toString(),
      skillName: booking.offeringId?.skillName || "Unknown Skill",
      partnerName: booking.offeringId?.providerId?.name || "Unknown",
      status: statusMap[booking.status] || booking.status.toLowerCase(),
      credits: booking.creditsUsed,
      role: "learner",
      scheduledDate: Array.isArray(booking.sessionDate) ? booking.sessionDate.join(", ") : booking.sessionDate,
      scheduledTime: booking.timeSlot
    }));

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};