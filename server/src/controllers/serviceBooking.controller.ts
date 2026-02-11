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
