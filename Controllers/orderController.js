import Order from "../Schema/Order.js";
import Restaurant from "../Schema/Restaurant.js";
import User from "../Schema/UserModel.js";

// 🔁 Simulated route generator
const getRouteData = async (from, to) => {
  return {
    distance: 4200, // meters
    duration: 600,  // seconds
    polyline: { coordinates: [from, to] }
  };
};

// 🔍 Get all orders
export const getAllOrders = async (req, res) => {
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

// 🔍 Get one order
export const getOrder = async (req, res) => {
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

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, customerName, customerPhone, deliveryAddress, deliveryAddressLocation, items } = req.body;

    // Validate required fields
    if (!restaurantId || !customerName || !customerPhone || !deliveryAddress || !deliveryAddressLocation || !items?.length) {
      console.error("❌ Missing required fields in request body", { restaurantId, customerName, customerPhone, deliveryAddress, deliveryAddressLocation, items });
      return res.status(400).json({ error: "All required fields (restaurantId, customerName, customerPhone, deliveryAddress, deliveryAddressLocation, items) must be provided" });
    }

    // Validate restaurantId
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.error(`❌ Invalid restaurant ID: ${restaurantId}`);
      return res.status(400).json({ error: `Invalid restaurant ID: ${restaurantId}` });
    }

    // Validate deliveryAddressLocation
    if (!deliveryAddressLocation?.lat || !deliveryAddressLocation?.lng) {
      console.error(`❌ Invalid delivery address: ${JSON.stringify(deliveryAddressLocation)}`);
      return res.status(400).json({ error: "Invalid delivery address location (lat and lng required)" });
    }

    // Validate items
    for (const item of items) {
      if (!item.foodId || !item.quantity || item.quantity < 1) {
        console.error(`❌ Invalid item: ${JSON.stringify(item)}`);
        return res.status(400).json({ error: "Each item must have a valid foodId and quantity >= 1" });
      }
      const foodItem = await mongoose.model("FoodItem").findById(item.foodId);
      if (!foodItem) {
        console.error(`❌ Invalid foodId: ${item.foodId}`);
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


// 📝 Update an order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("✏️ Order updated:", order._id);
    res.json(order);
  } catch (err) {
    console.error("❌ Failed to update order:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete an order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    console.log("🗑️ Order deleted:", req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("❌ Failed to delete order:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🚗 Assign driver to order
export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const orderId = req.params.id;

    // Validate input
    if (!driverId || !orderId) {
      console.error(`❌ Missing required fields: driverId=${driverId}, orderId=${orderId}`);
      return res.status(400).json({ error: "Order ID and Driver ID are required" });
    }

    // Fetch order
    let order = await Order.findById(orderId);
    if (!order) {
      console.error(`❌ Order not found with ID: ${orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    // Log raw order for debugging
    console.log(`🔍 Raw order document: ${JSON.stringify(order, null, 2)}`);

    // Check for restaurantId
    if (!order.restaurantId) {
      console.error(`❌ Order ${orderId} has no restaurantId`);
      return res.status(400).json({ error: "Order is missing restaurantId" });
    }

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant) {
      console.error(`❌ Restaurant not found for restaurantId: ${order.restaurantId}`);
      return res.status(400).json({ error: `Restaurant not found for restaurantId: ${order.restaurantId}` });
    }

    // Populate restaurantId (optional, since we already fetched it)
    order = await Order.findById(orderId).populate("restaurantId");

    // Validate driver
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "Driver") {
      console.error(`❌ Invalid driver ID: ${driverId}`);
      return res.status(400).json({ error: "Invalid driver" });
    }

    if (!driver.available) {
      console.error(`❌ Driver not available: ${driverId}`);
      return res.status(400).json({ error: "Driver not available" });
    }

    // Validate customer location
    const customerLocation = order.deliveryAddressLocation;
    if (!customerLocation?.lat || !customerLocation?.lng) {
      console.error(`❌ Invalid customer location: ${JSON.stringify(customerLocation)}`);
      return res.status(400).json({ error: "Invalid or missing customer location" });
    }

    // Validate restaurant location
    if (!restaurant.address?.location?.coordinates?.length) {
      console.error(`❌ Restaurant missing coordinates: ${JSON.stringify(restaurant)}`);
      return res.status(400).json({ error: "Restaurant location data missing or invalid" });
    }

    const [lng, lat] = restaurant.address.location.coordinates;
    const restaurantLocation = { lat, lng };

    // Calculate route using getRouteData
    const route = await getRouteData(restaurantLocation, customerLocation);

    // Assign driver to order
    order.driverId = driverId;
    order.status = "Assigned";
    order.distance = route.distance;
    order.eta = route.duration;
    order.routePolyline = JSON.stringify(route.polyline);
    await order.save();

    // Mark driver unavailable
    driver.available = false;
    await driver.save();

    console.log(`✅ Driver ${driverId} assigned to order ${orderId}`);
    res.json({ message: "Driver assigned", order });
  } catch (err) {
    console.error(`🔥 assignDriver error: ${err.message}`, err.stack);
    res.status(500).json({ error: "Failed to assign driver", details: err.message });
  }
};


// 🚦 Update order status
export const updateOrderStatus = async (req, res) => {
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
