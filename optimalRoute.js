const express = require('express');
const router = express.Router();
const dataSchema = require('../models/user'); // ✅ Fix the path if it's not at the same level
const axios = require('axios');

router.post('/optimal', async (req, res) => {
  try {
    const { name, from, to, date, vehicleNo, vehicleType } = req.body; // ✅ Changed `request` to `req`

    // Validate inputs
    if (!name || !from || !to || !date || !vehicleNo || !vehicleType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to DB
    const newData = new dataSchema({ name, to, from, date, vehicleNo, vehicleType });
    const ticket = await newData.save(); // ✅ Fixed typo: should call `save()` on `newData`, not `dataSchema`

    // Call time slot API
    const timeSlotRes = await axios.post('http://localhost:5000/api/timeslots', {
      from,
      to,
      date , 
      vehicleType
    });
    //  this will return me the optimal  window id 

    // Call congestion API
    const congestionRes = await axios.post('http://localhost:5000/api/predict-traffic', {
      date
    });

    // Call optimal path API
    const distanceRes = await axios.post('http://localhost:5000/api/optimalPath', {
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
    console.error('Error creating trip:', error); // ✅ Changed err to error for clarity
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
