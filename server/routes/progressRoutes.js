const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getCourseProgress, 
  toggleTopicStatus, 
  getAllProgress // 1. Import new function
} = require('../controllers/progressController');

// 2. Add new route BEFORE '/:courseId'
router.route('/all').get(protect, getAllProgress);

router.route('/:courseId').get(protect, getCourseProgress);
router.route('/toggle').post(protect, toggleTopicStatus);

module.exports = router;