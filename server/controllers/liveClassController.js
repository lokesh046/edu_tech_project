const axios = require('axios');
const Course = require('../models/Course'); // Import the Course model

// Helper function to create the required authentication hash for Dyte's API
const getDyteApiAuthHash = () => {
  const apiKey = process.env.DYTE_API_KEY;
  const orgId = process.env.DYTE_ORG_ID;
  return Buffer.from(`${orgId}:${apiKey}`, 'utf-8').toString('base64');
};

// Create a pre-configured axios instance for Dyte API calls
const dyteApi = axios.create({
  baseURL: 'https://api.cluster.dyte.in/v2',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${getDyteApiAuthHash()}`
  }
});

// @desc    Join a live class meeting
// @route   POST /api/live-class/join
// @access  Private
const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const user = req.user;

    if (!meetingId) {
      return res.status(400).json({ message: 'Meeting ID is required' });
    }

    // Determine the preset based on the user's role
    const preset_name = user.role === 'mentor' ? 'group_call_host' : 'group_call_participant';

    const response = await dyteApi.post(`/meetings/${meetingId}/participants`, {
      name: user.username,
      preset_name: preset_name,
      custom_participant_id: user._id.toString(),
    });

    const authToken = response.data.data.token;

    if (!authToken) {
      throw new Error('Authentication token was not received from Dyte API.');
    }
    
    res.json({
      auth: authToken,
    });

  } catch (error) {
    console.error('Dyte API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to join meeting', error: error.message });
  }
};

// --- THIS IS THE NEW FUNCTION FOR MENTORS ---
// @desc    Schedule a new live class
// @route   POST /api/live-class/schedule
// @access  Mentor Only
const scheduleClass = async (req, res) => {
  try {
    const { courseId, title, scheduledTime, meetingId } = req.body;

    if (!courseId || !title || !scheduledTime || !meetingId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const course = await Course.findOne({ courseId: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newClass = {
      title,
      scheduledTime: new Date(scheduledTime),
      meetingId,
      isCompleted: false,
    };
    
    course.liveClasses.push(newClass);
    await course.save();

    res.status(201).json(course.liveClasses);

  } catch (error) {
    console.error('Error scheduling class:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Make sure to export both functions
module.exports = { joinMeeting, scheduleClass };