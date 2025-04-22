// models/TimeSlot.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Store as 'YYYY-MM-DD' string for easy lookup
    required: true,
  },
  slotNumber: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['car', '2wheeler', 'heavy'],
    required: true,
  },
  vehicles: {
    type: [String], // Array of vehicle IDs
    default: [],
  },
  capacity: {
    type: Number,
    default: 200,
  }
});

timeSlotSchema.index({ date: 1, slotNumber: 1, vehicleType: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
