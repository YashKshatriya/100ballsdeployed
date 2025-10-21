const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ registrationDate: -1 });
    const formattedUsers = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      whatsappNumber: user.whatsappNumber,
      district: user.district,
      state: user.state,
      pincode: user.pincode,
      type: user.type,
      status: user.status,
      registrationDate: user.registrationDate,
      playerType: user.type,
      handedness: user.handedness || 'Right'
    }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const formattedUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      whatsappNumber: user.whatsappNumber,
      district: user.district,
      state: user.state,
      pincode: user.pincode,
      type: user.type,
      status: user.status,
      registrationDate: user.registrationDate,
      playerType: user.type,
      handedness: user.handedness || 'Right'
    };
    res.json(formattedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status
router.put('/:id', async (req, res) => {
  try {
    console.log('Update user request:', { id: req.params.id, body: req.body });
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const formattedUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      whatsappNumber: user.whatsappNumber,
      district: user.district,
      state: user.state,
      pincode: user.pincode,
      type: user.type,
      status: user.status,
      registrationDate: user.registrationDate,
      playerType: user.type,
      handedness: user.handedness || 'Right'
    };
    
    console.log('User updated successfully:', formattedUser);
    res.json(formattedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    console.log('Delete user request:', { id: req.params.id });
    
    if (!req.params.id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User deleted successfully:', user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get users by status
router.get('/status/:status', async (req, res) => {
  try {
    const users = await User.find({ status: req.params.status }).sort({ registrationDate: -1 });
    const formattedUsers = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      whatsappNumber: user.whatsappNumber,
      district: user.district,
      state: user.state,
      pincode: user.pincode,
      type: user.type,
      status: user.status,
      registrationDate: user.registrationDate,
      playerType: user.type,
      handedness: user.handedness || 'Right'
    }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
