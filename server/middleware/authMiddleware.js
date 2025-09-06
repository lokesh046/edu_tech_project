const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      res.status(401);
      next(err);
      return;
    }
  }
  if (!token) {
    const err = new Error('Not authorized, no token');
    res.status(401);
    next(err);
  }
};

const mentor = (req, res, next) => {
  if (req.user && req.user.role === 'mentor') {
    next();
  } else {
    const err = new Error('Not authorized as a mentor');
    res.status(401);
    next(err);
  }
};

// This line is crucial for exporting both functions.
module.exports = { protect, mentor };