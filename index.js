// index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIO } from "socket.io";
import connectDB from "./utils/MongoDatabase.js";

// Routes
import authRoute from "./routes/auth.js";
import restaurantRoute from "./routes/restaurant.js";
import driverRoute from "./routes/driver.js";
import orderRoute from "./routes/order.js";
import restaurantfood from "./routes/food.js"


// Sockets
import chatSocket from "./Socket.io/chatSocket.js";
import locationSocket from "./Socket.io/locationSocket.js";

dotenv.config(); // Load .env variables

const app = express();
const server = http.createServer(app); 
const io = new SocketIO(server, {
  cors: {
    origin: "*", // You can replace with frontend domain
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/drivers", driverRoute);
app.use("/api/orders", orderRoute);
app.use('/api/restaurants/:restaurantId/foods', restaurantfood);

// Sockets
chatSocket(io);
locationSocket(io);

// Test route
app.get("/", (req, res) => {
  res.status(200).send("API is working fine!");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
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
