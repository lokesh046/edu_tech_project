const mongoose = require('mongoose');

const sharedNoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String }
}, { timestamps: true });

const SharedNote = mongoose.model('SharedNote', sharedNoteSchema);

module.exports = SharedNote;