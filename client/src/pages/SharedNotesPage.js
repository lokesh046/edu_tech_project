import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedNotesPage.css';

function SharedNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shared-notes`, config);
        setNotes(data);
      } catch (err) {
        setError('Could not load shared notes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedNotes();
  }, []);

  const handleDownload = async (filePath, fileName) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
            responseType: 'blob',
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/${filePath}`, config);
        
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download error:', error);
        alert('Could not download the file.');
    }
  };

  if (loading) return <div className="loading-container">Loading Shared Notes...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="shared-notes-page-container">
      <h1>Shared Notes & Resources</h1>
      <p className="page-subtitle">Downloadable materials and notes shared by our mentors.</p>

      <div className="shared-notes-list">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note._id} className="shared-note-card">
              <div className="file-icon">📄</div>
              <div className="note-info">
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <small>Uploaded by {note.user.username} on {new Date(note.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="note-actions">
                <a 
                  href={`${process.env.REACT_APP_API_URL}/${note.filePath}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View
                </a>
                <button
                  onClick={() => handleDownload(note.filePath, note.fileName)}
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state-message">No shared notes have been uploaded yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}

export default SharedNotesPage;