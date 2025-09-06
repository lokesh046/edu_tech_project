const User = require('../models/User');

const getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseProgress = user.progress.find(p => p.courseId === req.params.courseId);
    if (courseProgress) {
      res.json(courseProgress.completedTopics);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const toggleTopicStatus = async (req, res) => {
  const { courseId, topicId } = req.body;
  const { courses } = require('./courseController'); // Note: This is a temporary way to get course data

  try {
    const user = await User.findById(req.user._id);
    let courseProgress = user.progress.find(p => p.courseId === courseId);

    if (courseProgress) {
      const topicIndex = courseProgress.completedTopics.indexOf(topicId);
      if (topicIndex > -1) {
        courseProgress.completedTopics.splice(topicIndex, 1);
      } else {
        courseProgress.completedTopics.push(topicId);
      }
    } else {
      user.progress.push({ courseId, completedTopics: [topicId] });
      courseProgress = user.progress[user.progress.length - 1]; // Get the newly created progress object
    }

    const updatedUser = await user.save();
    
    // Badge logic removed for simplicity in this file, handled elsewhere
    
    res.json(courseProgress.completedTopics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllProgress = async (req, res) => {
  try {
    // req.user is attached from the 'protect' middleware
    const user = await User.findById(req.user._id).select('progress');
    if (user) {
        res.json(user.progress);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getCourseProgress, toggleTopicStatus, getAllProgress };