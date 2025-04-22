const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/map', (req, res) => {
    // const location = req.query.from; // e.g., "Haldwani"
    const location = "Handwani" ; 
    const dataPath = path.join(__dirname, 'imap.json');
//   console.log(dataPath);
    fs.readFile(dataPath, 'utf8', (err, jsonData) => {
      if (err) return res.status(500).json({ error: 'Failed to read route data' });
  
      const routes = JSON.parse(jsonData).routes;
      const route = routes.find(r => r.from.toLowerCase().includes(location.toLowerCase()));
  
      if (!route) return res.status(404).json({ error: 'Route not found' });
        console.log(route.src)
      res.json({ src: route.src });
    });
  });
  
  module.exports = router;