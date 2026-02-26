import { Router } from "express";
import { createBooking, getMyOfferedCourses, getMySessions } from "../controllers/serviceBooking.controller";
import { protect } from "../middleware/auth.middlewere";

const router=Router();

router.post("/createBooking",protect,createBooking);
router.get("/myofferedcourses",protect,getMyOfferedCourses);
router.get("/mysessions",protect,getMySessions);
export default router;