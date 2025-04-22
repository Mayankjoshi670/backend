// models/Trip.js
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', User);
