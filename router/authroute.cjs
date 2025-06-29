import express from "express";
import { validationResult } from "express-validator";
import { authController } from "../controllers/authController.cjs";
import { loginController } from '../Controllers/loginController';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.post("/register", authController);
router.post("/login", handleValidationErrors, loginController);

export default router;
