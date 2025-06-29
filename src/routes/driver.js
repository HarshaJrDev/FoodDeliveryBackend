const express = require("express");
const {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverOrders
} = require("../controllers/drivercontroller");

const router = express.Router();

router.get("/", getAllDrivers);
router.get("/:id", getDriver);
router.post("/", createDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);
router.get("/:id/orders", getDriverOrders);

module.exports = router;
