const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress: [
    {
      courseId: { type: String, required: true },
      completedTopics: { type: [String], default: [] },
    }
  ],
  badges: { type: [String], default: [] },
  // --- VERIFY THIS FIELD ---
  role: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student', // This ensures every new user is a 'student'
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;