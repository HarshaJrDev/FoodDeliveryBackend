// File: Schema/DriverModel.js
import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    vehicle: String,
    location: {
      lat: Number,
      lng: Number
    },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;
