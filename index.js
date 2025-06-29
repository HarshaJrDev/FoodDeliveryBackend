
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server: SocketIO } = require("socket.io");

const authRoute = require("./src/routes/auth");
const restaurantRoute = require("./src/routes/restaurant");
const driverRoute = require("./src/routes/driver");
const orderRoute = require("./src/routes/order");
const restaurantfood = require("./src/routes/food");

const chatSocket = require("./src/socket/chatSocket");
const locationSocket = require("./src/socket/locationSocket");
const mongodatabase = require("./src/utils/MongoDatabase");


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
