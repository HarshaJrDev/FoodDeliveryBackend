const FoodItem = require("../schema/foodItem.js");
const Order = require("../schema/order.js");
const Restaurant = require("../schema/restaurant.js");
const User = require("../schema/usermodel.js");

const getRouteData = async (from, to) => {
  return {
    distance: 4200, // meters
    duration: 600,  // seconds
    polyline: { coordinates: [from, to] }
  };
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("restaurantId")
      .populate("items.foodId")
      .populate("driverId");

    console.log(`✅ Fetched ${orders.length} orders`);
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId")
      .populate("items.foodId")
      .populate("driverId");

    if (!order) {
      console.error(`❌ Order not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("✅ Order retrieved:", order._id);
    res.json(order);
  } catch (err) {
    console.error("❌ Error getting order:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryAddressLocation,
      items
    } = req.body;

    if (
      !restaurantId ||
      !customerName ||
      !customerPhone ||
      !deliveryAddress ||
      !deliveryAddressLocation ||
      !items?.length
    ) {
      console.error("❌ Missing required fields", req.body);
      return res.status(400).json({
        error: "All required fields must be provided"
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    if (
      !deliveryAddressLocation?.lat ||
      !deliveryAddressLocation?.lng
    ) {
      return res.status(400).json({
        error: "Invalid deliveryAddressLocation (lat and lng required)"
      });
    }

    for (const item of items) {
      if (!item.foodId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          error: "Each item must have valid foodId and quantity >= 1"
        });
      }

      const foodItem = await FoodItem.findById(item.foodId);
      if (!foodItem) {
        return res.status(400).json({ error: `Invalid foodId: ${item.foodId}` });
      }
    }

    const order = new Order(req.body);
    await order.save();

    console.log("✅ Order created:", order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Failed to create order:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("✏️ Order updated:", order._id);
    res.json(order);
  } catch (err) {
    console.error("❌ Failed to update order:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    console.log("🗑️ Order deleted:", req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("❌ Failed to delete order:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const orderId = req.params.id;

    if (!driverId || !orderId) {
      return res.status(400).json({ error: "Order ID and Driver ID are required" });
    }

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.restaurantId) {
      return res.status(400).json({ error: "Order is missing restaurantId" });
    }

    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant) {
      return res.status(400).json({ error: `Restaurant not found for restaurantId: ${order.restaurantId}` });
    }

    order = await Order.findById(orderId).populate("restaurantId");

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "Driver") {
      return res.status(400).json({ error: "Invalid driver" });
    }

    if (!driver.available) {
      return res.status(400).json({ error: "Driver not available" });
    }

    const customerLocation = order.deliveryAddressLocation;
    if (!customerLocation?.lat || !customerLocation?.lng) {
      return res.status(400).json({ error: "Invalid or missing customer location" });
    }

    if (!restaurant.address?.location?.coordinates?.length) {
      return res.status(400).json({ error: "Restaurant location data missing or invalid" });
    }

    const [lng, lat] = restaurant.address.location.coordinates;
    const restaurantLocation = { lat, lng };

    const route = await getRouteData(restaurantLocation, customerLocation);

    order.driverId = driverId;
    order.status = "Assigned";
    order.distance = route.distance;
    order.eta = route.duration;
    order.routePolyline = JSON.stringify(route.polyline);
    await order.save();

    driver.available = false;
    await driver.save();

    console.log(`✅ Driver ${driverId} assigned to order ${orderId}`);
    res.json({ message: "Driver assigned", order });
  } catch (err) {
    console.error(`🔥 assignDriver error: ${err.message}`, err.stack);
    res.status(500).json({ error: "Failed to assign driver", details: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Preparing', 'Assigned', 'OutForDelivery', 'Delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    console.log(`📦 Order ${order._id} status updated to ${status}`);
    res.json({ message: 'Status updated', order });
  } catch (err) {
    console.error("❌ Failed to update status:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  assignDriver,
  updateOrderStatus
};
