import {Router} from "express";

import { createSkillOffering, getSkillOfferings } from "../controllers/serviceOffering.controller";
import { protect } from "../middleware/auth.middlewere";

const router = Router();
router.post("/createSkills",protect,createSkillOffering);
router.get("/getSkills",getSkillOfferings);
export default router;