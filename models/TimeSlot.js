const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
  },
  slotNumber: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['2wheeler', '4wheeler', 'heavy'], // Ensure consistency with controller
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
