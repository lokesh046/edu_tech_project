import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Discussion.css';

function Discussion({ courseId }) {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/discussions/${courseId}`, config);
        setQuestions(data);
      } catch (err) {
        setError('Could not load discussions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!title || !text) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/discussions`,
        { courseId, title, text },
        config
      );
      setQuestions([data, ...questions]);
      setTitle('');
      setText('');
    } catch (err) {
      setError('Could not post your question.');
    }
  };

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="discussion-container">
      <div className="ask-question-form">
        <h3>Ask a New Question</h3>
        <form onSubmit={handleAskQuestion}>
          <input
            type="text"
            placeholder="Question Title (e.g., 'Error with Module 2 topic?')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Describe your question in detail..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button type="submit">Post Question</button>
        </form>
      </div>

      <div className="question-list">
        <h3>All Questions</h3>
        {questions.length === 0 ? (
          <p>No questions yet. Be the first to ask!</p>
        ) : (
          questions.map(q => (
            <div key={q._id} className="question-summary-card">
              <Link to={`/question/${q._id}`}>
                <h4>{q.title}</h4>
                <p>Asked by {q.user.username} - {new Date(q.createdAt).toLocaleDateString()}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Discussion;