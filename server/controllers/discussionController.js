const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @desc    Get all questions for a specific course
// @route   GET /api/discussions/:courseId
const getQuestionsForCourse = async (req, res) => {
  try {
    const questions = await Question.find({ courseId: req.params.courseId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Ask a new question
// @route   POST /api/discussions
const askQuestion = async (req, res) => {
  const { courseId, title, text } = req.body;
  try {
    const question = new Question({
      courseId,
      title,
      text,
      user: req.user._id,
    });
    const createdQuestion = await question.save();
    const populatedQuestion = await Question.findById(createdQuestion._id).populate('user', 'username');
    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Post an answer to a question
// @route   POST /api/discussions/:questionId/answer
const postAnswer = async (req, res) => {
  const { text } = req.body;
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const answer = new Answer({
      text,
      user: req.user._id,
      question: questionId,
    });
    const createdAnswer = await answer.save();
    question.answers.push(createdAnswer._id);
    await question.save();
    const populatedAnswer = await Answer.findById(createdAnswer._id).populate('user', 'username');
    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single question with all its answers
// @route   GET /api/discussions/question/:questionId
const getQuestionWithAnswers = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId)
      .populate('user', 'username')
      .populate({
        path: 'answers',
        populate: {
          path: 'user',
          select: 'username',
        },
      });
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW FUNCTION ADDED HERE ---
// @desc    Get the latest questions from the whole site
// @route   GET /api/discussions/latest
const getLatestQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- EXPORTS UPDATED HERE ---
module.exports = { 
  getQuestionsForCourse, 
  askQuestion, 
  postAnswer, 
  getQuestionWithAnswers, 
  getLatestQuestions 
};