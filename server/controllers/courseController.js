const Course = require('../models/Course');

// @desc    Fetch all courses (summary view) from the database
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    // Find all courses in the DB.
    // The .select() method specifies which fields to include.
    // We only send the summary data for the main list view.
    const courses = await Course.find({}).select('courseId title description');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single course by ID (detailed view) from the database
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    // Find a single course document where its 'courseId' matches the route parameter.
    const course = await Course.findOne({ courseId: req.params.id });
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getCourses, getCourseById }