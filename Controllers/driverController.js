const Driver = require("../schema/driver");
const Order = require("../schema/order");

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(404).json({ error: "Driver not found" });
  }
};

const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getDriverOrders = async (req, res) => {
  try {
    const orders = await Order.find({ driverId: req.params.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverOrders,
};
