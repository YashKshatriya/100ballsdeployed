// Validation middleware for registration data
export const validateRegistration = (req, res, next) => {
  console.log('Validating registration data:', req.body);
  
  const {
    fullName,
    whatsappNumber,
    email,
    state,
    district,
    pincode,
    type
  } = req.body;

  const errors = [];

  // Validate required fields
  if (!fullName || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  if (!whatsappNumber || !/^\d{10}$/.test(whatsappNumber)) {
    errors.push('WhatsApp number must be a 10-digit number');
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!state || state.trim().length < 2) {
    errors.push('State is required');
  }

  if (!district || district.trim().length < 2) {
    errors.push('District is required');
  }

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    errors.push('Pincode must be a 6-digit number');
  }

  if (!type || !['Batsman', 'Bowler', 'All Rounder'].includes(type)) {
    errors.push('Player type must be Batsman, Bowler, or All Rounder');
  }


  // Validate conditional fields
  if (type === 'Batsman' || type === 'All Rounder') {
    const { batsmanHanded } = req.body;
    if (!batsmanHanded || !['Left', 'Right'].includes(batsmanHanded)) {
      errors.push('Batsman handedness is required for Batsman and All Rounder');
    }
  }

  if (type === 'Bowler' || type === 'All Rounder') {
    const { bowlerHanded, bowlerType } = req.body;
    
    if (!bowlerHanded || !['Left Handed', 'Right Handed'].includes(bowlerHanded)) {
      errors.push('Bowler handedness is required for Bowler and All Rounder');
    }

    if (!bowlerType || !['Pace/Fast', 'Medium', 'Spin/Slow'].includes(bowlerType)) {
      errors.push('Bowler type is required for Bowler and All Rounder');
    }
  }

  if (errors.length > 0) {
    console.log('Validation errors:', errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  console.log('Validation passed');
  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Handle other errors
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

// 404 handler
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
