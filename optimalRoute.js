const express = require('express');
const router = express.Router();
const dataSchema = require('./models/user');  
const axios = require('axios');

router.post('/optimal', async (req, res) => {
  try {
    console.log("inside optimal route ")
    const { name, from, to, date, vehicleNo, vehicleType } = req.body;  
    console.log({name , from , to , date , vehicleNo  ,vehicleType });
    // Validate inputs
    if (!name || !from || !to || !date || !vehicleNo || !vehicleType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to DB
    const newData = new dataSchema({ name, to, from, date, vehicleNo, vehicleType });
    const ticket = await newData.save();  

    // Call time slot API
    const timeSlotRes = await axios.post('http://localhost:5003/api/timeslots', {
      from,
      to,
      date , 
      vehicleType
    });
    //  this will return me the optimal  window id 

    // Call congestion API
    const congestionRes = await axios.post('http://localhost:5003/api/predict-traffic', {
      date
    });

    // Call optimal path API
    const distanceRes = await axios.post('http://localhost:5003/api/optimalPath', {
      to,
      from,
      congestion: congestionRes.data
    });

    // Respond with ticket + results
    return res.status(201).json({
      ticketInfo: ticket,
      timeSlot: timeSlotRes.data,
      distance: distanceRes.data
    });

  } catch (error) {
    console.error('Error creating trip:', error); 
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
