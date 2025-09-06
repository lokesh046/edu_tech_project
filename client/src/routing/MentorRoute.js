import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const MentorRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // This component checks two things:
  // 1. Is a user logged in? (userInfo exists)
  // 2. If so, does that user have the 'mentor' role?
  if (userInfo && userInfo.role === 'mentor') {
    // If both are true, render the child component (e.g., AdminPage)
    // The <Outlet /> component is a placeholder for the nested routes.
    return <Outlet />;
  } else {
    // Otherwise, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
};

export default MentorRoute;