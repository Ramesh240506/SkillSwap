import { Request, Response } from "express";
import { ServiceOffering } from "../models/ServiceOffering.model";

export const createSkillOffering = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Extract data from body
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

    // 2️⃣ Get provider from auth middleware
    const providerId = req.user!._id;

    // 3️⃣ Validate
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