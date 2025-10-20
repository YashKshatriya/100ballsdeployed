import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  maxTeams: {
    type: Number,
    required: true,
    min: 2
  },
  registeredTeams: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationFee: {
    type: Number,
    required: true,
    min: 0
  },
  prizePool: {
    type: Number,
    required: true,
    min: 0
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tournamentType: {
    type: String,
    required: true,
    enum: ['league', 'knockout', 'double-knockout', 'round-robin']
  },
  format: {
    type: String,
    required: true,
    enum: ['t20', 'odi', 'test', 'other']
  },
  rules: {
    type: String,
    trim: true
  },
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tournamentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Tournament', tournamentSchema);
