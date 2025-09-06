const express = require('express');
const router = express.Router();

// 1. Make sure all necessary functions are imported
const { registerUser, authUser, getMyBadges } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', authUser);

// --- THIS IS THE NEW ROUTE THAT WAS LIKELY MISSING ---
// Private route - only a logged-in user can access this
router.get('/my-badges', protect, getMyBadges);

module.exports = router;