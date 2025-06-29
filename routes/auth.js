import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { validateLogin, validateRegister } from "../Middleware/validation.js";



const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
