const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').delete(protect, deleteNote);

module.exports = router;