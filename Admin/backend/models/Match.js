const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  matchNumber: {
    type: Number,
    required: true
  },
  matchType: {
    type: String,
    required: true,
    enum: ['league', 'quarter_final', 'semi_final', 'final']
  },
  teamA: {
    type: String,
    required: true,
    trim: true
  },
  teamB: {
    type: String,
    required: true,
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['upcoming', 'in_progress', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  // Score details
  teamAScore: {
    runs: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    overs: {
      type: Number,
      default: 0
    }
  },
  teamBScore: {
    runs: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    overs: {
      type: Number,
      default: 0
    }
  },
  winner: {
    type: String,
    trim: true
  },
  margin: {
    type: String,
    trim: true
  },
  manOfTheMatch: {
    type: String,
    trim: true
  },
  tossWinner: {
    type: String,
    trim: true
  },
  tossDecision: {
    type: String,
    enum: ['bat', 'bowl']
  },
  umpires: {
    umpire1: {
      type: String,
      trim: true
    },
    umpire2: {
      type: String,
      trim: true
    },
    thirdUmpire: {
      type: String,
      trim: true
    }
  },
  referee: {
    type: String,
    trim: true
  },
  matchReport: {
    type: String,
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for formatted score
matchSchema.virtual('teamAScoreFormatted').get(function() {
  return `${this.teamAScore.runs}/${this.teamAScore.wickets} (${this.teamAScore.overs} ov)`;
});

matchSchema.virtual('teamBScoreFormatted').get(function() {
  return `${this.teamBScore.runs}/${this.teamBScore.wickets} (${this.teamBScore.overs} ov)`;
});

// Virtual for match result
matchSchema.virtual('result').get(function() {
  if (this.status === 'completed' && this.winner) {
    return `${this.winner} won by ${this.margin}`;
  }
  return 'Match not completed';
});

// Index for better query performance
matchSchema.index({ tournamentId: 1, matchNumber: 1 });
matchSchema.index({ scheduledDate: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ teamA: 1, teamB: 1 });

module.exports = mongoose.model('Match', matchSchema);
