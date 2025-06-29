import express from "express";

import protect from "../middleware/authMiddleware.js"; // if you're using JWT middleware
import { getMe, loginUser, registerUser } from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // Only if using auth middleware

export default router;
