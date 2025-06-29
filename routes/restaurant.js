import express from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  getRestaurantWithFoods,
  updateRestaurant,
  getMyRestaurant
} from "../Controllers/restaurantController.js";
import  {authenticate}  from "../Middleware/authenticate.js";


const router = express.Router();

1
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurant);
router.get("/:id/full", getRestaurantWithFoods);
router.post("/", authenticate, createRestaurant);
router.put("/:id", authenticate, updateRestaurant);
router.delete("/:id", authenticate, deleteRestaurant);


router.get("/me/my-restaurant", authenticate, getMyRestaurant);

export default router;
