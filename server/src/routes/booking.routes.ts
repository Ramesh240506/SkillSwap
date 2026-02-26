import express from "express";
// import { getMyBookings } from "../controllers/bookings.controller";
import { protect } from "../middleware/auth.middlewere";

const router = express.Router();

// router.get("/mybookings", protect, getMyBookings);

export default router;
