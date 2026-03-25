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
  errors: {
    type: String,
  },
  explanation: {
    type: String,
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
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
