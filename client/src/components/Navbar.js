import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    // A page reload ensures all state is cleared cleanly
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to={userInfo ? "/home" : "/"} className="navbar-brand">
        CodeQuark
      </Link>
      <div className="nav-links">
        {userInfo ? (
          // Links to show when a user is logged in
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/shared-notes" className="nav-link">Shared Notes</Link>
            <Link to="/compiler" className="nav-link">Compiler</Link>
            <Link to="/notes" className="nav-link">Notes</Link>
            
            {/* 
              This is the conditional rendering logic for the admin link.
              It checks if a user is logged in AND if their role is 'mentor'.
            */}
            {userInfo && userInfo.role === 'mentor' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
            
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          // Links to show when a user is logged out
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;