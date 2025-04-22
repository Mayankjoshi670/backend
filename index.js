require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const optimalRoute = require('./optimalRoute');
const timeslots = require('./timeslots')
const optimalPath = require('./optimalPath')
const liveStats = require('./liveStats')
const graphVisulizer = require('./graphVisulizer')
const morgan = require("morgan")
// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartroute_backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', optimalRoute);
app.use('/api', timeslots);
app.use('/api', optimalPath);
//  this will give us the optmial path  for now it is just giving the distance between the your location  and the aprox time 
 

//  it gives the real time stats for place kanchi dham 
app.use('/api' , liveStats) ; 

//  it gives google api in frontend 

app.use('/api' , graphVisulizer) ; 
   

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
