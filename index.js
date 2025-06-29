
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIO } from "socket.io";


import { connectDB } from './utils/mongoDatabase.js';
import authRoute from "./routes/auth.js";
import restaurantRoute from "./routes/restaurant.js";
import driverRoute from "./routes/driver.js";
import orderRoute from "./routes/order.js";
import restaurantfood from "./routes/food.js"



import chatSocket from "./socket/chatSocket.js";
import locationSocket from "./socket/locationSocket.js";

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/drivers", driverRoute);
app.use("/api/orders", orderRoute);
app.use('/api/restaurants/:restaurantId/foods', restaurantfood);


chatSocket(io);
locationSocket(io);


app.get("/", (req, res) => {
  res.status(200).send("API is working fine!");
});


const startServer = async () => {
  try {
    await connectDB()
    const PORT = process.env.PORT || 3030;
    server.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
