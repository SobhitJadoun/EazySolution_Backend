const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Course = require('./Models/Courses'); // Adjust the path if necessary
require('dotenv').config();
const User = require('./Models/UserRegistration');
const  {isuser}  = require('./middleware/middleware');
const multer = require('multer');

const MONGO_URL = process.env.MONGO_URL


// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}

connectToDB();

// Define schema for form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactNo: String,
  service: String,
  description: String,
});
// Define model for form data
const FormData = mongoose.model('contactus', formDataSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
 { extended : true}
))
app.use(express.json());
// Route to handle form submission
app.post('/api/submitForm', async (req, res) => {
  try {
    // Create a new FormData document
    const formData = new FormData(req.body);
    // Save the document to MongoDB
    await formData.save();
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error('Error submitting form', error);
    res.status(500).send('Form submission failed');
  }
});

// Middleware to handle unsupported methods
app.use('/api/submitForm', (req, res, next) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed, use POST instead');
  } else {
    next();
  }
});


// =======user registration===============
app.post('/userreg', async (req, res)=>{
 
  let {
    name, email, contactNo, password,role
  }= req.body;
  try{
    const user = new User({
      name, email, contactNo, password, role
    });
    await user.save();
    console.log('user added');
    res.status(200).send({
      success : true,
      message : user,
    })
  }
  catch (error){
  console.log('error ', error);
  res.status(400).send(`"err:" ${error}`)
  }
});

app.post('/login', [isuser], (req,res)=>{

  res.status(200).send({
    success : true,
    message : "successfull login"
  });
} ) 


// ===================course upload================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/'); // Define the destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Maintain the original filename
  }
});

const upload = multer({ storage: storage });

app.post('/addCourse', upload.single('courseImage'), async (req, res) => {
  try {
    const { courseName, coursePrice, category, Description, Learn, CourseInclude, lecturer, timeDuration } = req.body;

    // Check if req.file exists before accessing its properties
    const courseImage = req.file ? req.file.filename : null;

    // Save the course data to MongoDB
    const course = new Course({
      courseName,
      coursePrice,
      category,
      Description,
      Learn,
      CourseInclude,
      lecturer,
      timeDuration,
      courseImage // Save the filename of the uploaded image
    });

    await course.save();

    res.status(201).json({ success: true, message: 'Course added successfully' });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// =============get course==========
// Example route to fetch courses
app.get('/getCourses', async (req, res) => {
  try {
    // Fetch courses from the database
    const courses = await Course.find(); // Assuming Course is your Mongoose model for courses
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Delete Course
app.delete('/deleteCourse/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    // Find the course by ID and delete it
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Course
app.put('/updateCourse/:id', async (req, res) => {
  const courseId = req.params.id;
  const updateData = req.body;
  try {
    // Find the course by ID and update it with the new data
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});