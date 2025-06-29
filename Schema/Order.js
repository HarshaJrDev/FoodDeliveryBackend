// File: Schema/OrderModel.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,

  deliveryAddressLocation: {
  lat: Number,
  lng: Number
},

  
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      quantity: Number
    }
  ],

  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  status: {
    type: String,
    enum: ['Placed', 'Preparing', 'Assigned', 'OutForDelivery', 'Delivered'],
    default: 'Placed'
  },
  routePolyline: String,
  distance: Number,
  eta: Number,
  chat: [
    {
      senderId: mongoose.Schema.Types.ObjectId,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
