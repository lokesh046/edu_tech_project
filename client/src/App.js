import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import MentorRoute from './routing/MentorRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import CourseDetailPage from './pages/CourseDetailPage';
import OnlineCompilerPage from './pages/OnlineCompilerPage';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AdminPage from './pages/AdminPage';
import SharedNotesAdminPage from './pages/SharedNotesAdminPage';
// 1. Import the new page
import SharedNotesPage from './pages/SharedNotesPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* User Routes */}
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/compiler" element={<OnlineCompilerPage />} />
        <Route path="/notes" element={<NotesPage />} />
        {/* 2. ADD THE NEW ROUTE FOR STUDENTS */}
        <Route path="/shared-notes" element={<SharedNotesPage />} />
        <Route path="/quiz/:moduleId" element={<QuizPage />} />
        <Route path="/question/:questionId" element={<QuestionDetailPage />} />
        
        {/* Mentor-Only Routes */}
        <Route path="/admin" element={<MentorRoute />}>
          <Route path="" element={<AdminPage />} />
          <Route path="shared-notes" element={<SharedNotesAdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;