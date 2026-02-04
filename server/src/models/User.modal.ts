import { model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;

    trustScore: number;
    totalSessionsCompleted: number;

    totalCreditsEarned: number;
    totalCreditsSpent: number;

    status: "active" | "inactive" | "banned";
    createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

   

    trustScore: { type: Number, default: 0 },
    totalSessionsCompleted: { type: Number, default: 0 },

    status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
    createdAt: { type: Date, default: Date.now }
});

export const User = model<IUser>("User", UserSchema);
