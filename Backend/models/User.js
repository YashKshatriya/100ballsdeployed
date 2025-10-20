import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    uppercase: true
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  },
  type: {
    type: String,
    required: [true, 'Player type is required'],
    enum: ['Batsman', 'Bowler', 'All Rounder'],
    trim: true
  },
  batsmanHanded: {
    type: String,
    required: false,
    enum: ['Left', 'Right', 'NA'],
    default: 'NA',
    trim: true
  },
  bowlerHanded: {
    type: String,
    required: false,
    enum: ['Left Handed', 'Right Handed', 'NA'],
    default: 'NA',
    trim: true
  },
  bowlerType: {
    type: String,
    required: false,
    enum: ['Pace/Fast', 'Medium', 'Spin/Slow'],
    trim: type => type === 'Bowler' || type === 'All Rounder' ? [true, 'Bowler type is required for bowlers and all rounders'] : false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Create index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ whatsappNumber: 1 });
userSchema.index({ registrationDate: -1 });

const User = mongoose.model('User', userSchema);

export default User;
