import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CoursePage.css';

function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('You must be logged in to view courses.');
          setLoading(false);
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/courses`,
          config
        );
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error(err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading courses...</div>;
  }

  return (
    <div className="course-container">
      <h1>Courses</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <Link 
              key={course.courseId} 
              to={`/courses/${course.courseId}`} 
              className="course-card-link"
            >
              <div className="course-card">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <button className="view-course-btn">View Course</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursePage;