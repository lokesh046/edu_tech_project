import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';
import { badgeData } from '../utils/badgeData';

const courseTitleMap = {
  '1': 'Introduction to Python',
  '2': 'Advanced React',
  '3': 'Node.js for Beginners',
};

function DashboardPage() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dashboardData, setDashboardData] = useState({
    progress: [],
    recentNotes: [],
    latestQuestions: [],
    badges: [],
  });

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      setLoading(false);
      setError("Please log in to view your dashboard.");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [progressRes, notesRes, questionsRes, badgesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/all`, config),
          axios.get(`${process.env.REACT_APP_API_URL}/api/notes?limit=3`, config),
          axios.get(`${process.env.REACT_APP_API_URL}/api/discussions/latest`, config),
          axios.get(`${process.env.REACT_APP_API_URL}/api/users/my-badges`, config)
        ]);
        setDashboardData({
          progress: progressRes.data,
          recentNotes: notesRes.data,
          latestQuestions: questionsRes.data,
          badges: badgesRes.data,
        });
      } catch (err) {
        setError('Could not load dashboard data. Please refresh the page.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="loading-container">Loading Dashboard...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {userInfo?.username}!</h1>
        <p>Let's continue your learning journey.</p>
      </header>

      <section className="about-section">
        <h2>About CodeCrack</h2>
        <p>
          CodeCrack is your all-in-one platform for learning and coding. Dive into our interactive courses,
          test your code snippets in real-time with our secure compiler, take notes, and engage with a
          community of fellow learners. Let's build something amazing together.
        </p>
      </section>

      <div className="dashboard-grid">
        <div className="widget progress-widget">
          <h2>My Progress</h2>
          {dashboardData.progress.length > 0 ? (
            dashboardData.progress.map(prog => (
              <Link to={`/courses/${prog.courseId}`} key={prog.courseId} className="progress-item">
                <span className="course-title">{courseTitleMap[prog.courseId] || 'A Course'}</span>
                <span className="topic-count">{prog.completedTopics.length} topics completed</span>
              </Link>
            ))
          ) : (
            <p className="widget-empty-state">Start a course to see your progress here!</p>
          )}
        </div>
        
        <div className="widget achievements-widget">
          <h2>My Achievements</h2>
          {dashboardData.badges.length > 0 ? (
            <div className="badges-grid">
              {dashboardData.badges.map(badgeId => (
                <div key={badgeId} className="badge-item" title={`${badgeData[badgeId]?.title}: ${badgeData[badgeId]?.description}`}>
                  <span className="badge-icon">{badgeData[badgeId]?.icon || '🏆'}</span>
                  <span className="badge-title">{badgeData[badgeId]?.title || 'New Badge!'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="widget-empty-state">Complete courses and participate in discussions to earn new badges!</p>
          )}
        </div>

        <div className="widget notes-widget">
          <h2>Recent Notes</h2>
          {dashboardData.recentNotes.length > 0 ? (
            dashboardData.recentNotes.map(note => (
              <Link to="/notes" key={note._id} className="note-item">
                <span className="note-title">{note.title}</span>
                <span className="note-date">{`Edited ${new Date(note.updatedAt).toLocaleDateString()}`}</span>
              </Link>
            ))
          ) : (
            <p className="widget-empty-state">Your recent notes will appear here.</p>
          )}
          <Link to="/notes" className="widget-view-all">View All Notes &rarr;</Link>
        </div>

        <div className="widget discussions-widget">
          <h2>Latest Discussions</h2>
          {dashboardData.latestQuestions.length > 0 ? (
            dashboardData.latestQuestions.map(q => (
              <Link to={`/question/${q._id}`} key={q._id} className="discussion-item">
                <span className="discussion-title">{q.title}</span>
                <span className="discussion-author">by {q.user.username}</span>
              </Link>
            ))
          ) : (
            <p className="widget-empty-state">The latest community questions will be shown here.</p>
          )}
        </div>
      </div>
      
      <footer className="contact-footer">
        <h2>Get in Touch</h2>
        <p>Have questions, feedback, or need support? We'd love to hear from you.</p>
        <p>
          <a href="mailto:support@codeCrack.com">support@codeCrack.com</a>
        </p>
      </footer>
    </div>
  );
}
console.log("DashboardPage rendered");
export default DashboardPage;
