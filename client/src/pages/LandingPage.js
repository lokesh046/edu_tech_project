import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1>Welcome to CodeCrack</h1>
        <p className="subtitle">The complete platform to learn, practice, and master your coding skills.</p>
        
        <div className="features-preview">
          <span className="feature-item">Interactive Courses</span>
          <span className="feature-item">Live Code Compiler</span>
          <span className="feature-item">Personal Note-Taking</span>
        </div>

        <Link to="/signup" className="get-started-btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;