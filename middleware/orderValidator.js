
import { body, validationResult } from "express-validator";

export const validateCreateOrder = [
  body("customerName").notEmpty().withMessage("Customer name is required"),
  body("customerPhone").notEmpty().withMessage("Customer phone is required"),
  body("deliveryAddress").notEmpty().withMessage("Delivery address is required"),
  
  body("deliveryAddressLocation.lat")
    .isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
  body("deliveryAddressLocation.lng")
    .isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),

  body("restaurantId").isMongoId().withMessage("Valid restaurant ID is required"),

  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.foodId").isMongoId().withMessage("Each item must have a valid foodId"),
  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("Each item must have a quantity of at least 1"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateUpdateOrderStatus = [
  body("status")
    .isIn(['Placed', 'Preparing', 'Assigned', 'OutForDelivery', 'Delivered'])
    .withMessage("Invalid order status"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
