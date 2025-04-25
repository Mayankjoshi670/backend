require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const optimalRoute = require('./routes/optimalRoute');
const timeslots = require('./routes/timeslots');
const optimalPath = require('./routes/optimalPath');
const liveStats = require('./routes/liveStats');
const graphVisualizer = require('./routes/graphVisualizer');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartroute_backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', optimalRoute);
app.use('/api', timeslots);
app.use('/api', optimalPath);
app.use('/api', liveStats);
app.use('/api', graphVisualizer);

module.exports = app;
