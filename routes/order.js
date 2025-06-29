const express = require("express");
const {
  createOrder,
  updateOrderStatus,
  assignDriver,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require("../controllers/ordercontroller.js");

const {
  validateCreateOrder,
  validateUpdateOrderStatus
} = require("../middleware/ordervalidator.js");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/", validateCreateOrder, createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.put("/:id/assign", assignDriver);
router.put("/:id/status", validateUpdateOrderStatus, updateOrderStatus);

module.exports = router;
