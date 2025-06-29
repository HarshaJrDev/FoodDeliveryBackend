import express from "express";
import {
  createOrder,
  updateOrderStatus,
  assignDriver,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder
} from "../controllers/ordercontroller.js";
import { validateCreateOrder, validateUpdateOrderStatus } from "../middleware/ordervalidator.js";



const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/", validateCreateOrder, createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.put("/:id/assign", assignDriver);
router.put("/:id/status", validateUpdateOrderStatus, updateOrderStatus);

export default router;
