const Note = require('../models/Note');

// @desc    Get logged in user's notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    // Check for a 'limit' query parameter
    const limit = req.query.limit ? parseInt(req.query.limit) : 0; // if no limit, 0 means no limit

    // Find notes, sort by most recently updated, and apply the limit
    const notes = await Note.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(limit);
      
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Please add a title and content' });
  }
  try {
    const note = new Note({
      user: req.user._id,
      title,
      content,
    });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNotes, createNote, deleteNote };