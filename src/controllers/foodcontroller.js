const FoodItem = require('../schema/foodItem');

// Get all food items by restaurant
const getAllFoodsByRestaurant = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId });
    res.status(200).json({ success: true, data: foodItems });
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ success: false, error: "Failed to fetch food items" });
  }
};

// Get a single food item by ID, only if it belongs to the restaurant
const getFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food item not found" });
    }

    if (food.restaurantId.toString() !== req.params.restaurantId) {
      return res.status(403).json({ success: false, error: "Unauthorized access to food item" });
    }

    res.status(200).json({ success: true, data: food });
  } catch (err) {
    console.error("Error getting food item:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve food item" });
  }
};

// Create a new food item for a restaurant
const createFoodItem = async (req, res) => {
  try {
    const requiredFields = ["name", "price", "category", "isVeg", "image"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, error: `${field} is required` });
      }
    }

    const newFood = new FoodItem({
      ...req.body,
      restaurantId: req.params.restaurantId,
    });

    const savedFood = await newFood.save();
    res.status(201).json({ success: true, data: savedFood });
  } catch (err) {
    console.error("Error creating food item:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update a food item (only if it belongs to the restaurant)
const updateFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food item not found" });
    }

    if (food.restaurantId.toString() !== req.params.restaurantId) {
      return res.status(403).json({ success: false, error: "Unauthorized update attempt" });
    }

    Object.assign(food, req.body);
    const updatedFood = await food.save();
    res.status(200).json({ success: true, data: updatedFood });
  } catch (err) {
    console.error("Error updating food item:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete a food item (only if it belongs to the restaurant)
const deleteFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food item not found" });
    }

    if (food.restaurantId.toString() !== req.params.restaurantId) {
      return res.status(403).json({ success: false, error: "Unauthorized delete attempt" });
    }

    await food.deleteOne();
    res.status(200).json({ success: true, message: "Food item deleted successfully" });
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(500).json({ success: false, error: "Failed to delete food item" });
  }
};

// Export functions
module.exports = {
  getAllFoodsByRestaurant,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
};
