const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

async function mongodatabase() {
  try {
    const conn = await mongoose.connect("mongodb+srv://Harsha123:Harsha123@cluster0.yeqh4vk.mongodb.net/FoodDelivery?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

module.exports = mongodatabase;
