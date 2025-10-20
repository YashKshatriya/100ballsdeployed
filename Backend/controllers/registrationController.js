import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const {
      fullName,
      whatsappNumber,
      email,
      state,
      district,
      pincode,
      type,
      batsmanHanded,
      bowlerHanded,
      bowlerType
    } = req.body;

    // Check if user already exists by email or WhatsApp number
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { whatsappNumber: whatsappNumber }
      ]
    });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(400).json({
        success: false,
        message: 'User with this email or WhatsApp number already exists'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      whatsappNumber,
      email: email.toLowerCase(),
      state,
      district,
      pincode,
      type,
      batsmanHanded: batsmanHanded || 'NA',
      bowlerHanded: bowlerHanded || 'NA',
      bowlerType: bowlerType || ''
    });

    console.log('Attempting to save user:', user);
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        whatsappNumber: savedUser.whatsappNumber,
        registrationDate: savedUser.registrationDate,
        status: savedUser.status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/users
// @access  Public (for admin purposes)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ registrationDate: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Public (for admin purposes)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public (for admin purposes)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};
