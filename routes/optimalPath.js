const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const places = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/places.json'), 'utf-8')).places;
function getCoordinatesById(id) {
  return places.find(place => place.id === id);
}
async function getDistance(start, end) {
  const url = `http://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=false`;
  try {
    const res = await axios.get(url);
    const route = res.data.routes[0];
    return {
      distance_meters: route.distance,
      duration_seconds: route.duration
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
router.post('/optimalPath', async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    return res.status(400).json({ error: 'Both "from" and "to" fields are required in the body.' });
  }
  const fromCoords = getCoordinatesById(from);
  const toCoords = getCoordinatesById(to);
  if (!fromCoords || !toCoords) {
    return res.status(404).json({ error: 'Invalid place ID provided for "from" or "to".' });
  }
  try {
    const result = await getDistance(fromCoords, toCoords);
    res.json({
      from: fromCoords.name,
      to: toCoords.name,
      distance_meters: result.distance_meters,
      duration_seconds: result.duration_seconds
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route data.', details: err.message });
  }
});
module.exports = router;
