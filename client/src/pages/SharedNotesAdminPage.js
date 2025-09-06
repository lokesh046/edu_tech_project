import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

function SharedNotesAdminPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shared-notes`, config);
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!file || !title) {
      setUploadError('Title and file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sharedNoteFile', file);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/shared-notes`, formData, config);
      setNotes([data, ...notes]);
      setUploadSuccess('Note uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      e.target.reset();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'File upload failed.');
    }
  };
  
  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this shared note?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/shared-notes/${noteId}`, config);
        setNotes(notes.filter(n => n._id !== noteId));
      } catch (err) {
        alert('Failed to delete the shared note.');
      }
    }
  };

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

  return (
    <div className="admin-page-container">
      <h1>Manage Shared Notes</h1>
      <div className="admin-widget">
        <h2>Upload a New Note</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="title">Note Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Python Data Structures Cheat Sheet"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">File (PDF, DOCX, TXT, etc.)</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
            />
          </div>
          {uploadError && <p className="error-message">{uploadError}</p>}
          {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}
          <button type="submit" className="submit-btn">Upload Note</button>
        </form>
      </div>

      <div className="admin-widget">
        <h2>Existing Shared Notes</h2>
        {loading ? <p>Loading notes...</p> : (
          <div className="resource-list">
            {notes.length > 0 ? notes.map(note => (
              <div key={note._id} className="resource-item">
                <span className="resource-title">{note.title}</span>
                <div className="resource-buttons">
                  <a
                    href={`${process.env.REACT_APP_API_URL}/${note.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-btn-small"
                  >
                    View
                  </a>
                  <button onClick={() => handleDownload(note.filePath, note.fileName)} className="download-btn-small">Download</button>
                  <button onClick={() => handleDelete(note._id)} className="delete-btn">Delete</button>
                </div>
              </div>
            )) : <p>No shared notes found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedNotesAdminPage;