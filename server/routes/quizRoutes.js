const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getQuizByModuleId } = require('../controllers/quizController');

// GET /api/quizzes/py-1 - Fetches the quiz for Python module 1
router.route('/:moduleId').get(protect, getQuizByModuleId);

module.exports = router;