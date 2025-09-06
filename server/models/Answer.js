const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  // The user who wrote the answer
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The question this answer belongs to
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;