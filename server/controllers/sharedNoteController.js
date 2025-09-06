const SharedNote = require('../models/SharedNote');
const fs = require('fs');
const path = require('path');

const createSharedNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    const webFilePath = req.file.path.replace(/\\/g, '/');
    const sharedNote = new SharedNote({
      user: req.user._id,
      title,
      description,
      filePath: webFilePath,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
    });
    const createdNote = await sharedNote.save();
    const populatedNote = await SharedNote.findById(createdNote._id).populate('user', 'username');
    res.status(201).json(populatedNote);
  } catch (error) {
    console.error('Error creating shared note:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
    
const getSharedNotes = async (req, res) => {
    try {
        const notes = await SharedNote.find({}).populate('user', 'username').sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Error getting shared notes:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteSharedNote = async (req, res) => {
  try {
    const note = await SharedNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Shared note not found' });
    }
    const filePath = path.join(__dirname, '..', note.filePath);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error(`File deletion error: ${err.message}`);
    }
    await SharedNote.deleteOne({ _id: req.params.id });
    res.json({ message: 'Shared note removed' });
  } catch (error) {
    console.error('Error in deleteSharedNote:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// This line is crucial for exporting all three functions.
module.exports = { createSharedNote, getSharedNotes, deleteSharedNote };