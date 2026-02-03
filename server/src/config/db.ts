import mongoose from "mongoose";

const MONGO_URI : string = process.env.DB_URL || "mongodb://localhost:27017/saloon-appointment";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
    console.log("Connected to MongoDB");
}
