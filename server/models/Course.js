const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topicId: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  moduleNumber: { type: Number, required: true },
  title: { type: String, required: true },
  topics: [topicSchema],
});

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  contents: [moduleSchema],
  fees: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentLink: { type: String, default: '#' },
  },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;