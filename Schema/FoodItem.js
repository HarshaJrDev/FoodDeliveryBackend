import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snack'],
      required: true,
    },
    tags: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      required: true,
    },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Spicy'],
      default: 'Medium',
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
  { timestamps: true }
);

const FoodItem = mongoose.model('FoodItem', FoodItemSchema);
export default FoodItem;
