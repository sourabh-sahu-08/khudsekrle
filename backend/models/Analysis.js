const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalCode: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  findings: {
    type: mongoose.Schema.Types.Mixed,
  },
  explanation: {
    type: mongoose.Schema.Types.Mixed,
  },
  correctedCode: {
    type: String,
  },
  optimizedCode: {
    type: String,
  },
  timeComplexity: {
    type: String,
  },
  spaceComplexity: {
    type: String,
  },
  confidenceScore: {
    type: String,
  },
  securityAudit: {
    type: mongoose.Schema.Types.Mixed,
  },
  bestPractices: {
    type: mongoose.Schema.Types.Mixed,
  },
  expectedOutput: {
    type: String,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userName: String,
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
