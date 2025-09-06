// In a real application, this data would come from the database.
// We are adding two new quizzes to our sample data.
const sampleQuizzes = [
  // 1. Python Quiz (Existing)
  {
    moduleId: 'py-1',
    title: 'Quiz: Python Basics and Setup',
    questions: [
      {
        questionText: 'What command is used to run a Python script named "app.py" from the terminal?',
        options: ['run app.py', 'node app.py', 'python app.py', 'execute app.py'],
        correctAnswer: 'python app.py',
      },
      {
        questionText: 'Which of the following is a floating-point number in Python?',
        options: ['10', '"Hello"', '12.5', 'True'],
        correctAnswer: '12.5',
      },
      {
        questionText: 'What is the primary function of the `print()` command in Python?',
        options: ['To get user input', 'To display output to the console', 'To perform a calculation', 'To save a file'],
        correctAnswer: 'To display output to the console',
      },
    ],
  },
  
  // --- NEW QUIZ FOR REACT MODULE 1 ---
  {
    moduleId: 'react-1',
    title: 'Quiz: Advanced React Hooks',
    questions: [
      {
        questionText: 'Which hook is used to perform side effects in a function component?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 'useEffect',
      },
      {
        questionText: 'What is the purpose of the `useCallback` hook?',
        options: ['To cache a function definition between re-renders', 'To cache a computed value between re-renders', 'To create a global state', 'To fetch data'],
        correctAnswer: 'To cache a function definition between re-renders',
      },
    ],
  },

  // --- NEW QUIZ FOR NODE.JS MODULE 1 ---
  {
    moduleId: 'node-1',
    title: 'Quiz: Introduction to Node.js',
    questions: [
      {
        questionText: 'What is the primary role of the Event Loop in Node.js?',
        options: ['To execute JavaScript code directly', 'To manage and execute asynchronous operations', 'To connect to the database', 'To render HTML pages'],
        correctAnswer: 'To manage and execute asynchronous operations',
      },
      {
        questionText: 'What does NPM stand for?',
        options: ['Node Project Manager', 'New Project Manager', 'Node Package Manager', 'Node Project Module'],
        correctAnswer: 'Node Package Manager',
      },
      {
        questionText: 'Which built-in module is used for working with the file system in Node.js?',
        options: ['http', 'url', 'path', 'fs'],
        correctAnswer: 'fs',
      },
    ],
  },
];


// @desc    Get a quiz by its module ID
// @route   GET /api/quizzes/:moduleId
// @access  Private
const getQuizByModuleId = async (req, res) => {
  try {
    const quiz = sampleQuizzes.find(q => q.moduleId === req.params.moduleId);
    
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found for this module yet.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getQuizByModuleId };