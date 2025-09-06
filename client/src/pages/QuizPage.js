import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css'; // We will create this file

function QuizPage() {
  const { moduleId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/quizzes/${moduleId}`, config);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load the quiz. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [moduleId]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  if (loading) return <div className="loading-container">Loading Quiz...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!quiz) return <div className="error-container">Quiz not found.</div>;

  return (
    <div className="quiz-container">
      {!showResults ? (
        // --- QUIZ VIEW ---
        <>
          <h1>{quiz.title}</h1>
          <div className="quiz-questions">
            {quiz.questions.map((q, index) => (
              <div key={index} className="question-card">
                <h3>Question {index + 1}</h3>
                <p>{q.questionText}</p>
                <div className="options-container">
                  {q.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`option-btn ${selectedAnswers[index] === option ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="submit-quiz-btn" onClick={handleSubmitQuiz}>Submit Quiz</button>
        </>
      ) : (
        // --- RESULTS VIEW ---
        <div className="results-container">
          <h1>Quiz Results</h1>
          <h2>Your Score: {score} out of {quiz.questions.length}</h2>
          <div className="results-breakdown">
            {quiz.questions.map((q, index) => (
              <div key={index} className="result-question-card">
                <p><strong>Question:</strong> {q.questionText}</p>
                <p className={selectedAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}>
                  Your Answer: {selectedAnswers[index] || "No answer selected"}
                </p>
                {selectedAnswers[index] !== q.correctAnswer && (
                  <p className="correct">Correct Answer: {q.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
          <Link to="/courses" className="back-to-courses-btn">Back to Courses</Link>
        </div>
      )}
    </div>
  );
}

export default QuizPage;