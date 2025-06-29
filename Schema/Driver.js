import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["Customer", "Driver", "Admin"],
    default: "Customer"
  },
  location: {
    lat: Number,
    lng: Number
  },
  available: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model("Driver", UserSchema);
export default User;
