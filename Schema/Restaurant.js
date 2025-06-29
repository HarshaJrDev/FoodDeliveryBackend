import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [lng, lat]
          index: "2dsphere",
          required: true,
        },
      },
    },
    cuisines: {
      type: [String],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    gallery: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
RestaurantSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "restaurantId",
});

RestaurantSchema.virtual("foodItems", {
  ref: "FoodItem",
  localField: "_id",
  foreignField: "restaurantId",
});

// Validate coordinates before saving
RestaurantSchema.pre("save", function (next) {
  if (!this.address?.location?.coordinates?.length) {
    return next(new Error("Restaurant address.location.coordinates is required"));
  }
  if (this.address.location.coordinates.length !== 2) {
    return next(new Error("Coordinates must contain exactly [lng, lat]"));
  }
  next();
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;