import { Router } from "express";
import { createBooking } from "../controllers/serviceBooking.controller";
import { protect } from "../middleware/auth.middlewere";

const router=Router();

router.post("/createBooking",protect,createBooking);

export default router;