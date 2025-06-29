import Restaurant from "../schema/Restaurant.js";
import FoodItem from "../schema/FoodItem.js";

// ✅ Get all restaurants with foodItems, orders, and owner details
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .sort({ _id: 1 })
      .populate("foodItems")
      .populate("orders")
      .populate("userId", "name email role");

    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch restaurants", error: error.message });
  }
};

// ✅ Get a single restaurant by ID with full details
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("foodItems")
      .populate("orders")
      .populate("userId", "name email role");

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Create a new restaurant (only for users with role 'restaurant')
export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "restaurant") {
      return res.status(403).json({ success: false, message: "Only restaurant users can create a restaurant" });
    }

    const requiredFields = ["name", "phone", "address"];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
      }
    }

    const restaurant = new Restaurant({
      ...req.body,
      userId: req.user._id,
    });

    const saved = await restaurant.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update restaurant info
export const updateRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get a restaurant and its food items (manual approach)
export const getRestaurantWithFoods = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const foodItems = await FoodItem.find({ restaurantId: restaurant._id });

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        foodItems,
      },
    });
  } catch (error) {
    console.error("getRestaurantWithFoods error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ userId: req.user._id })
      .populate("foodItems")
      .populate("orders");

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "No restaurant found for this account" });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve your restaurant" });
  }
};
