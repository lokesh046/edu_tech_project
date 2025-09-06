import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotesPage.css'; // We will create this CSS file

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch notes from the server
  const fetchNotes = async (config) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notes', config);
      setNotes(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token) {
      setError('You must be logged in to view your notes.');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    fetchNotes(config);
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in both title and content.');
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/notes`,
        { title, content },
        config
      );
      setNotes([...notes, data]); // Add the new note to the UI
      setTitle(''); // Clear the form
      setContent('');
    } catch (err) {
      setError('Failed to create note.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        try {
            await axios.delete(`http://localhost:5000/api/notes/${id}`, config);
            setNotes(notes.filter((note) => note._id !== id)); // Remove the note from the UI
        } catch (err) {
            setError('Failed to delete note.');
        }
    }
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="notes-container">
      <h1>My Notes</h1>
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="add-note-form">
            <h2>Create a New Note</h2>
            <form onSubmit={handleAddNote}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <button type="submit">Add Note</button>
            </form>
          </div>

          <div className="notes-list">
            {notes.length === 0 ? (
              <p>You have no notes yet.</p>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <button className="delete-btn" onClick={() => handleDeleteNote(note._id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default NotesPage;