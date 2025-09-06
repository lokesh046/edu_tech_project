const express = require('express');
const router = express.Router();
const { protect, mentor } = require('../middleware/authMiddleware');
const { createSharedNote, getSharedNotes, deleteSharedNote } = require('../controllers/sharedNoteController');
const upload = require('../middleware/sharedUploadMiddleware');

// Route to get all notes (for students and mentors)
router.route('/').get(protect, getSharedNotes);
    
// Route to post a new note (for mentors only)
router.route('/').post(protect, mentor, upload, createSharedNote);

// Route to delete a note (for mentors only)
router.route('/:id').delete(protect, mentor, deleteSharedNote);

module.exports = router;