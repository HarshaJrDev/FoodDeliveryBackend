// File: controllers/orderController.js
import Order from "../Schema/Order.js";
import Driver from "../Schema/Driver.js";

// Mock route data function (replace with OpenRouteService if needed)
const getRouteData = async (from, to) => {
  return {
    distance: 4200, // in meters
    duration: 600,  // in seconds
    polyline: { coordinates: [from, to] }
  };
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("restaurantId")
      .populate("items.foodId")
      .populate("driverId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId")
      .populate("items.foodId")
      .populate("driverId");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const order = await Order.findById(req.params.id).populate("restaurantId");
    const driver = await Driver.findById(driverId);

    if (!order || !driver || !driver.available) {
      return res.status(400).json({ error: "Invalid order or driver" });
    }

    const customerLocation = order.deliveryAddressLocation;
    const restaurantLocation = order.restaurantId.location;

    if (!customerLocation || !restaurantLocation) {
      return res.status(400).json({ error: "Missing location data" });
    }

    // For now: fake route data
    const fakeRoute = {
      distance: 5000, // meters
      duration: 600,  // seconds
      polyline: { coordinates: [restaurantLocation, customerLocation] }
    };

    order.driverId = driverId;
    order.status = "Assigned";
    order.distance = fakeRoute.distance;
    order.eta = fakeRoute.duration;
    order.routePolyline = JSON.stringify(fakeRoute.polyline);

    await order.save();
    driver.available = false;
    await driver.save();

    res.json({ message: "Driver assigned", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Preparing', 'Assigned', 'OutForDelivery', 'Delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  await order.save();

  res.json({ message: 'Status updated', order });
};