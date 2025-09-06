const express = require('express');
const router = express.Router();

// Import both middleware functions
const { protect, mentor } = require('../middleware/authMiddleware');

// Import both controller functions
const { joinMeeting, scheduleClass } = require('../controllers/liveClassController');

// This route can be accessed by any logged-in user (students and mentors)
router.post('/join', protect, joinMeeting);

// This route can ONLY be accessed by logged-in users who ALSO have the 'mentor' role
router.post('/schedule', protect, mentor, scheduleClass);

module.exports = router;