import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CourseDetailPage.css';
import Discussion from '../components/Discussion';

function CourseDetailPage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModule, setOpenModule] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [totalTopics, setTotalTopics] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('You must be logged in to view course details.');
          setLoading(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [courseRes, progressRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}`, config),
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/${courseId}`, config)
        ]);
        
        setCourse(courseRes.data);
        setCompletedTopics(progressRes.data);

        if (courseRes.data && courseRes.data.contents) {
          const total = courseRes.data.contents.reduce((acc, module) => acc + (module.topics ? module.topics.length : 0), 0);
          setTotalTopics(total);
        }
        
      } catch (err) {
        setError('Failed to fetch course data. Please check the URL and try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (totalTopics > 0) {
      const percentage = Math.round((completedTopics.length / totalTopics) * 100);
      setProgressPercentage(percentage);
    } else {
      setProgressPercentage(0);
    }
  }, [completedTopics, totalTopics]);

  const handleToggleTopic = async (topicId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/progress/toggle`,
        { courseId, topicId },
        config
      );
      setCompletedTopics(data);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleToggleModule = (moduleNumber) => {
    setOpenModule(openModule === moduleNumber ? null : moduleNumber);
  };

  if (loading) return <div className="loading-container">Loading Course...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="course-detail-container">
      <Link to="/courses" className="back-link"> &larr; Back to Courses</Link>
      {course ? (
        <>
          <header className="course-detail-header">
            <h1>{course.title}</h1>
            <p>{course.detailedDescription || course.description}</p>
          </header>

          <div className="course-tabs">
            <button 
              className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Course Content
            </button>
            <button 
              className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussion')}
            >
              Discussions
            </button>
          </div>

          {activeTab === 'content' ? (
            <div className="course-content-active">
              <div className="progress-section">
                <h3>Your Progress</h3>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p>{progressPercentage}% Complete ({completedTopics.length} / {totalTopics} topics)</p>
              </div>

              <div className="course-body">
                <section className="course-content-section">
                  <h2>Course Modules</h2>
                  <ul className="content-list">
                    {(course.contents || []).map((item) => (
                      <li key={item.moduleId} className="content-list-item">
                        <div className="module-title" onClick={() => handleToggleModule(item.moduleNumber)}>
                          <strong>Module {item.moduleNumber}:</strong> {item.title}
                          <span>{openModule === item.moduleNumber ? '-' : '+'}</span>
                        </div>
                        {openModule === item.moduleNumber && (
                          <>
                            <ul className="topic-list">
                              {(item.topics || []).map((topic) => (
                                <li key={topic.topicId} className="topic-item">
                                  <input
                                    type="checkbox"
                                    id={topic.topicId}
                                    checked={completedTopics.includes(topic.topicId)}
                                    onChange={() => handleToggleTopic(topic.topicId)}
                                  />
                                  <label htmlFor={topic.topicId}>{topic.text}</label>
                                </li>
                              ))}
                            </ul>
                            <div className="quiz-link-container">
                              <Link to={`/quiz/${item.moduleId}`} className="take-quiz-btn">
                                Take Module {item.moduleNumber} Quiz
                              </Link>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
                
                <aside className="course-fees-section">
                  {course.fees ? (
                    <div className="fees-card">
                      <p className="price">${course.fees.amount} {course.fees.currency}</p>
                      <a href={course.fees.paymentLink || '#'} className="enroll-button">Enroll Now</a>
                    </div>
                  ) : (
                    <div className="fees-card">
                       <p>Fee details are not available.</p>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          ) : (
            <Discussion courseId={courseId} />
          )}
        </>
      ) : (
        <p>Course not found.</p>
      )}
    </div>
  );
}

export default CourseDetailPage;