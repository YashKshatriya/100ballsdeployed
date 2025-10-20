const mongoose = require('mongoose');

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
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  runnerUp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  manOfTheSeries: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for formatted date range
tournamentSchema.virtual('dateRange').get(function() {
  return `${this.startDate.toLocaleDateString()} - ${this.endDate.toLocaleDateString()}`;
});

// Virtual for registration status
tournamentSchema.virtual('isRegistrationOpen').get(function() {
  return new Date() < this.registrationDeadline && this.registeredTeams < this.maxTeams;
});

// Index for better query performance
tournamentSchema.index({ status: 1 });
tournamentSchema.index({ startDate: 1 });
tournamentSchema.index({ registrationDeadline: 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);
