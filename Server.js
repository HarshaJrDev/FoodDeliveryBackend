
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server: SocketIO } = require("socket.io");

const authRoute = require("../Backend/routes/auth.js");
const restaurantRoute = require("../Backend/routes/restaurant.js");
const driverRoute = require("../Backend/routes/driver.js");
const orderRoute = require("../Backend/routes/order.js");
const restaurantfood = require("../Backend/routes/food.js");

const chatSocket = require("../Backend/socket/chatSocket.js");
const locationSocket = require("../Backend/socket/locationSocket.js");
const mongodatabase = require("../Backend/utils/MongoDatabase.js");


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
 mongodatabase()
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
