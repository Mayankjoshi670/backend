// Optimal Route API
const express = require('express');
const router = express.Router();
const dataSchema = require('../models/user');
const axios = require('axios');

// POST /api/optimal
router.post('/optimal', async (req, res) => {
  try {
    const { name, from, to, date, vehicleNo, vehicleType } = req.body;
    if (!name || !from || !to || !date || !vehicleNo || !vehicleType) {
      return res.status(400).json({ message: 'All fields are required: name, from, to, date, vehicleNo, vehicleType' });
    }
    // Validate vehicleType
    const allowedTypes = ['2wheeler', '4wheeler', 'heavy'];
    if (!allowedTypes.includes(vehicleType)) {
      return res.status(400).json({ message: `vehicleType must be one of: ${allowedTypes.join(', ')}` });
    }
    // Save user trip
    const newData = new dataSchema({ name, to, from, date, vehicleNo, vehicleType });
    const ticket = await newData.save();

    // Call time slot API with correct payload
    const timeSlotRes = await axios.post(`${process.env.API_BASE_URL || 'http://localhost:5003'}/api/timeslots`, {
      vehicleType,
      vehicleId: vehicleNo
    });

    // Call congestion API (if needed)
    // const congestionRes = await axios.post(`${process.env.API_BASE_URL || 'http://localhost:5003'}/api/predict-traffic`, { date });
    // Call optimal path API
    const distanceRes = await axios.post(`${process.env.API_BASE_URL || 'http://localhost:5003'}/api/optimalPath`, {
      from,
      to
    });

    return res.status(201).json({
      ticketInfo: ticket,
      timeSlot: timeSlotRes.data,
      distance: distanceRes.data
    });
  } catch (error) {
    console.error('Error creating trip:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Server error', details: error?.response?.data || error.message });
  }
});

module.exports = router;
