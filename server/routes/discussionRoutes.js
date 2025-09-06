const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getQuestionsForCourse, 
  askQuestion, 
  postAnswer, 
  getQuestionWithAnswers,
  getLatestQuestions // 1. Import new function
} = require('../controllers/discussionController');

// 2. Add new route BEFORE '/:courseId'
router.route('/latest').get(protect, getLatestQuestions);

router.route('/').post(protect, askQuestion);
router.route('/:courseId').get(protect, getQuestionsForCourse);
router.route('/question/:questionId').get(protect, getQuestionWithAnswers);
router.route('/:questionId/answer').post(protect, postAnswer);

module.exports = router;