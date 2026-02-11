import { Router } from "express";
import { getUser, loginUser, registerUser } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middlewere";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser",protect,getUser);

export default router;