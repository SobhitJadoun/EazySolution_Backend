const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the course model
const courseSchema = new Schema({
  courseName: {
    type: String,
  },
  coursePrice: {
    type: Number,
  },
  category: {
    type: String,
  },
  Description: {
    type: String,
  },
  Learn: {
    type: String,
  },
  CourseInclude: {
    type: String,
  },
  lecturer: {
    type: String,
  },
  image: {
    type: String,
  },
  timeDuration: {
    type: String,
  }
});

// Create a model based on the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
