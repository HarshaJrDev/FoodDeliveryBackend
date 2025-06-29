import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async async  => {
  try {
    const conn = await mongoose.connect("mongodb+srv://Harsha123:Harsha123@cluster0.yeqh4vk.mongodb.net/FoodDelivery?retryWrites=true&w=majority&appName=Cluster0");
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    throw err;
  }
};

export default connectDB;
