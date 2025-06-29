import express from "express";
import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverOrders
} from "../Controllers/drivercontroller.js";

const router = express.Router();

router.get("/", getAllDrivers);
router.get("/:id", getDriver);
router.post("/", createDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);
router.get("/:id/orders", getDriverOrders);

export default router;
