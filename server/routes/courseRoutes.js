const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// This line correctly imports the functions that hold your logic
const { getCourses, getCourseById } = require('../controllers/courseController');

// This single line correctly tells the server to use the getCourses function for the '/' route.
router.route('/').get(protect, getCourses);

// This single line correctly tells the server to use the getCourseById function for the '/:id' route.
router.route('/:id').get(protect, getCourseById);

module.exports = router;