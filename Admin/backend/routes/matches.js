const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ scheduledDate: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new match
router.post('/', async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update match
router.put('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete match
router.delete('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update match status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get matches by tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.tournamentId });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get matches by status
router.get('/status/:status', async (req, res) => {
  try {
    const matches = await Match.find({ status: req.params.status });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
