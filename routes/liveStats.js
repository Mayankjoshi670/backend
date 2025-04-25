const express = require('express');
const router = express.Router();
const axios = require('axios');
const API_KEY = process.env.TOMTOM_API_KEY || 'AjkGcwvF1fQrnRBqc3n1G2vsmncPg2xz';
const latitude = 29.3877;
const longitude = 79.5370;
router.get('/traffic', async (req, res) => {
  // const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${latitude},${longitude}&unit=KMPH&key=${API_KEY}`;
  // try {
  //   const response = await axios.get(url);
  //   const flow = response.data.flowSegmentData;
  //   const currentSpeed = flow.currentSpeed;
  //   const freeFlowSpeed = flow.freeFlowSpeed;
  //   const trafficRatio = flow.currentTravelTime / flow.freeFlowTravelTime;
  //   const frc = flow.frc;
  //   let trafficStatus = 'Unknown';
  //   let adminAction = 'None';
  //   if (trafficRatio >= 0.9 && trafficRatio <= 1.1) {
  //     trafficStatus = 'Normal Flow';
  //     adminAction = 'No action required';
  //   } else if (trafficRatio > 1.1 && trafficRatio <= 1.5) {
  //     trafficStatus = 'Moderate Congestion';
  //     adminAction = 'Monitor the area';
  //   } else if (trafficRatio > 1.5) {
  //     trafficStatus = 'Heavy Congestion';
  //     adminAction = 'Consider rerouting vehicles or alerting authorities';
  //   }
  //   res.json({
  //     currentSpeed: `${currentSpeed} km/h`,
  //     freeFlowSpeed: `${freeFlowSpeed} km/h`,
  //     trafficSpeedRatio: trafficRatio.toFixed(2),
  //     trafficLevel: frc,
  //     trafficStatus,
  //     adminAction
  //   });
  // } catch (error) {
  //   console.error('❌ Error fetching traffic data:', error.response?.data || error.message);
  //   res.status(500).json({ error: 'Failed to fetch traffic data' });
  // }
  res.json({
    
      "currentSpeed": "32 km/h",
      "freeFlowSpeed": "45 km/h",
      "trafficSpeedRatio": "1.41",
      "trafficLevel": "FRC2",
      "trafficStatus": "Moderate Congestion",
      "adminAction": "Monitor the area"
    
    
  })
});
module.exports = router;
