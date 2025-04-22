const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

router.post('/timeslots', async (req, res) => {
  try {
    const { date, vehicleType, vehicleId } = req.body;

    if (!date || !vehicleType || !vehicleId) {
      return res.status(400).json({ message: 'date, vehicleType, and vehicleId are required' });
    }

    // Slot pattern: slot 1 = car, 2 = 2wheeler, 3 = heavy, 4 = car again...
    const getSlotVehicleType = (slotNumber) => {
      const types = ['car', '2wheeler', 'heavy'];
      return types[(slotNumber - 1) % 3];
    };

    // Try slots 1-26
    for (let i = 1; i <= 26; i++) {
      if (getSlotVehicleType(i) !== vehicleType) continue;

      const existingSlot = await TimeSlot.findOne({ date, slotNumber: i, vehicleType });

      if (!existingSlot) {
        // Slot doesn't exist → create it
        const newSlot = new TimeSlot({
          date,
          slotNumber: i,
          vehicleType,
          vehicles: [vehicleId]
        });
        await newSlot.save();
        return res.status(201).json({ assignedSlot: i });
      } else if (existingSlot.vehicles.length < existingSlot.capacity) {
        // Slot exists and has space → push this vehicle
        existingSlot.vehicles.push(vehicleId);
        await existingSlot.save();
        return res.status(200).json({ assignedSlot: i });
      }
      // else: slot is full, try next
    }

    // No available slots for the given type on the given date
    return res.status(409).json({ message: 'No available slots for this vehicle type on the selected date' });

  } catch (err) {
    console.error('Error assigning time slot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
