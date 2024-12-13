const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Fetch all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new vehicle
router.post("/", async (req, res) => {
  try {
    const { name, status } = req.body;
    const newVehicle = new Vehicle({ name, status });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update vehicle status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: Date.now() },
      { new: true }
    );
    if (!vehicle) return res.status(404).send("Vehicle not found");
    res.json(vehicle);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a vehicle
router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).send("Vehicle not found");
    res.status(200).send("Vehicle deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
