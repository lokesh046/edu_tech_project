const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Import all route files
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const noteRoutes = require('./routes/noteRoutes');
const progressRoutes = require('./routes/progressRoutes');
const quizRoutes = require('./routes/quizRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const sharedNoteRoutes = require('./routes/sharedNoteRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- THIS IS THE CRITICAL FIX ---
// We will use __dirname to create a reliable, absolute path to the 'uploads' folder.
// __dirname is a Node.js variable that gives the path of the directory where the current file lives.
// In our case, it's the 'server' folder.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --- END OF CRITICAL FIX ---

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use all the API routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/shared-notes', sharedNoteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});