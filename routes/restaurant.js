import express from "express";
import { createRestaurant, deleteRestaurant, getAllRestaurants, getRestaurant, getRestaurantWithFoods, updateRestaurant } from "../Controllers/restaurantController";


const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurant);
router.post("/", createRestaurant);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.get('/:id/full', getRestaurantWithFoods);

export default router;