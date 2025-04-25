const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.get('/map', (req, res) => {
  const location = req.query.from || 'Handwani';
  const dataPath = path.join(__dirname, '../data/imap.json');
  fs.readFile(dataPath, 'utf8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Failed to read route data' });
    const routes = JSON.parse(jsonData).routes;
    const route = routes.find(r => r.from.toLowerCase().includes(location.toLowerCase()));
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ src: route.src });
  });
});
module.exports = router;
