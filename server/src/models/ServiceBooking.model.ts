import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  offeringId: mongoose.Types.ObjectId;
  requesterId: mongoose.Types.ObjectId;
  sessionDate: string[];
  timeSlot: string;
  totalSessionsBooked: number;
  creditsUsed: number;

  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

const BookingSchema = new Schema<IBooking>(
  {
    offeringId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceOffering",
      required: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionDate: {
      type: [String],
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    totalSessionsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    creditsUsed: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>(
  "Booking",
  BookingSchema
);
