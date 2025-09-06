const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const coursesData = require('./data/courses'); 
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...'.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

connectDB();

const importData = async () => {
  try {
    await Course.deleteMany();
    
    const formattedCourses = coursesData.map(course => ({
      courseId: course.id,
      title: course.title,
      description: course.description,
      detailedDescription: course.detailedDescription,
      fees: course.fees,
      contents: course.contents.map(module => ({
        moduleId: module.moduleId,
        moduleNumber: module.module,
        title: module.title,
        topics: module.topics.map(topic => ({
          topicId: topic.id,
          text: topic.text,
        })),
      })),
    }));

    await Course.insertMany(formattedCourses);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}