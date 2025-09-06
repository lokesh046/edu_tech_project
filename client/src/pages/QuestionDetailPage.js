import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './QuestionDetailPage.css'; // We will create this

function QuestionDetailPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/discussions/question/${questionId}`, config);
        setQuestion(data);
        setAnswers(data.answers);
      } catch (err) {
        setError('Could not load the question.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerText) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/discussions/${questionId}/answer`,
        { text: answerText },
        config
      );
      setAnswers([...answers, data]); // Add new answer to the list
      setAnswerText('');
    } catch (err) {
      setError('Could not post your answer.');
    }
  };
  
  if (loading) return <div className="loading-container">Loading Question...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!question) return <div className="error-container">Question not found.</div>;

  return (
    <div className="question-detail-container">
      <Link to={`/courses/${question.courseId}`} className="back-link">&larr; Back to Course</Link>
      
      <div className="question-main-card">
        <h1>{question.title}</h1>
        <p className="question-author">Asked by {question.user?.username} on {new Date(question.createdAt).toLocaleDateString()}</p>
        <p className="question-text">{question.text}</p>
      </div>
      
      <div className="answers-section">
        <h2>{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h2>
        {answers.map(ans => (
          <div key={ans._id} className="answer-card">
            <p>{ans.text}</p>
            <small>Answered by {ans.user?.username} on {new Date(ans.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <div className="post-answer-form">
        <h3>Your Answer</h3>
        <form onSubmit={handlePostAnswer}>
          <textarea 
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button type="submit">Post Answer</button>
        </form>
      </div>
    </div>
  );
}

export default QuestionDetailPage;