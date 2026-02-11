// models/SkillOffering.ts
import { Schema, model, Types, Document } from "mongoose";

export interface IServiceOffering extends Document {
  providerId: Types.ObjectId;
  teacherName:string;       // The user offering this skill
  skillName: string;
  category: string;
  description: string;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  creditsPerSession: number;
  sessionDuration: number;          
  totalSessions: number;
  availableDays: string[];          
  availableTimeSlots: string[];     
  prerequisites?: string;
  totalCredits: number;   
  rating: number;    
  reviewCount: number;      
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;                // if the skill is live in marketplace
}

const ServiceOfferingSchema = new Schema<IServiceOffering>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    skillName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    experienceLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], required: true },
    creditsPerSession: { type: Number, required: true, min: 1 },
    sessionDuration: { type: Number, required: true },
    totalSessions: { type: Number, required: true, min: 1 },
    availableDays: { type: [String], required: true },
    availableTimeSlots: { type: [String], required: true },
    prerequisites: { type: String },
    totalCredits: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, 
    }
);

export const ServiceOffering = model<IServiceOffering>("ServiceOffering", ServiceOfferingSchema);
