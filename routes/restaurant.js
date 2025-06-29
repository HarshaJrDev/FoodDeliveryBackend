const express = require("express");
const {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  getRestaurantWithFoods,
  updateRestaurant,
  getMyRestaurant
} = require("../controllers/restaurantcontroller.js");

const { authenticate } = require("../middleware/authenticate.js");

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurant);
router.get("/:id/full", getRestaurantWithFoods);
router.post("/", authenticate, createRestaurant);
router.put("/:id", authenticate, updateRestaurant);
router.delete("/:id", authenticate, deleteRestaurant);
router.get("/me/my-restaurant", authenticate, getMyRestaurant);

module.exports = router;
