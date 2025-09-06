import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
  return (
    <div className="admin-page-container">
      <h1>Mentor Admin Panel</h1>
      
      <div className="admin-hub">
        <Link to="/admin/shared-notes" className="admin-hub-card">
          <h3>Manage Shared Notes</h3>
          <p>Upload, view, and delete shared files for all students.</p>
        </Link>
        {/* You can add more links here for other tools like scheduling classes in the future */}
      </div>
    </div>
  );
}

export default AdminPage;