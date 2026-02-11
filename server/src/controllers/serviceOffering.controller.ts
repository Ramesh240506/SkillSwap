import { Request, Response } from "express";
import { ServiceOffering } from "../models/ServiceOffering.model";
import { User } from "../models/User.modal";
import { Booking } from "../models/ServiceBooking.model";
import mongoose from "mongoose";

export const createSkillOffering = async (req: Request, res: Response) => {
  try {
    const {
      skillName,
      category,
      description,
      experienceLevel,
      creditsPerSession,
      sessionDuration,
      totalSessions,
      availableDays,
      availableTimeSlots,
      prerequisites,
    } = req.body;

    const providerId = req.user!._id;
    const provider= await User.findById(providerId).select("name");
    const teacherName = provider?.name || "Unknown";
   
    if (
      !providerId ||
      !skillName ||
      !category ||
      creditsPerSession < 1 ||
      totalSessions < 1 ||
      !Array.isArray(availableDays) ||
      availableDays.length === 0 ||
      !Array.isArray(availableTimeSlots) ||
      availableTimeSlots.length === 0
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

   
    const totalCredits = creditsPerSession * totalSessions;
    const allowedData = {
      teacherName,
      skillName,
      category,
      description,
      experienceLevel,
      creditsPerSession,
      sessionDuration,
      totalSessions,
      availableDays,
      availableTimeSlots,
      prerequisites,
    };

    const newSkillOffering = new ServiceOffering({
      ...allowedData,
      providerId,
      totalCredits,
      isActive: true,
    });

    await newSkillOffering.save();

    return res.status(201).json(newSkillOffering);
  } catch (error) {
    console.error("Error creating skill offering:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSkillOfferings = async (req: Request, res: Response) => {
  try {
    const offerings = await ServiceOffering.find({ isActive: true });
    return res.status(200).json(offerings);
  } catch (error) {
    console.error("Error fetching skill offerings:", error);
    return res.status(500).json({ message: "Internal server error" });
    }
};


export const getOfferingAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid offering ID" });
    }

    const offering = await ServiceOffering.findById(id);

    if (!offering) {
      return res.status(404).json({ message: "Offering not found" });
    }

    const bookings = await Booking.find({
      offeringId: new mongoose.Types.ObjectId(id),
      status: "CONFIRMED" as const,
    });

    // Extract all booked date + time combinations
    const bookedSlots = bookings.flatMap((booking) =>
      booking.sessionDate.map((date: string) => ({
        date,
        timeSlot: booking.timeSlot,
      }))
    );

    return res.status(200).json({
      offering,
      bookedSlots,
    });

  } catch (error) {
    console.error("Error fetching availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
