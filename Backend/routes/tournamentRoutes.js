import express from "express";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// Get all tournaments
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tournament by ID
router.get("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tournaments by status
router.get("/status/:status", async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tournament
router.post("/", async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update tournament
router.put("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete tournament
router.delete("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
