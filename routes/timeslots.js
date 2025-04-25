const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const { getCongestionFromModel, getDisabledSlots } = require('../utils/dataFetchers');

function getSlotVehicleType(slotNumber) {
  const types = ['2wheeler', '4wheeler', 'heavy'];
  return types[(slotNumber - 1) % 3];
}
function getBaseCapacity(type) {
  if (type === '2wheeler') return 200;
  if (type === '4wheeler') return 150;
  return 100;
}
function adjustCapacity(base, congestion) {
  const minCap = Math.floor(base * 0.2);
  const maxCap = Math.floor(base * 1.5);
  let adjusted;
  if (congestion < 50) {
    adjusted = base + Math.floor((50 - congestion) * 1);
  } else {
    adjusted = base - Math.floor((congestion - 50) * 1.2);
  }
  return Math.max(minCap, Math.min(adjusted, maxCap));
}
// POST /api/timeslots
router.post('/timeslots', async (req, res) => {
  try {
    const { vehicleType, vehicleId } = req.body;
    if (!vehicleType || !vehicleId) {
      return res.status(400).json({ message: 'vehicleType and vehicleId are required' });
    }
    // Validate vehicleType
    const allowedTypes = ['2wheeler', '4wheeler', 'heavy'];
    if (!allowedTypes.includes(vehicleType)) {
      return res.status(400).json({ message: `vehicleType must be one of: ${allowedTypes.join(', ')}` });
    }
    const today = new Date();
    const dayOffsets = [1, 2];
    for (const offset of dayOffsets) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + offset);
      const dateStr = targetDate.toISOString().split('T')[0];
      const congestionData = await getCongestionFromModel(dateStr);
      const disabledSlots = await getDisabledSlots(dateStr);
      for (let slot = 1; slot <= 26; slot++) {
        if (getSlotVehicleType(slot) !== vehicleType) continue;
        if (disabledSlots.includes(slot)) continue;
        const congestion = congestionData[slot - 1];
        const base = getBaseCapacity(vehicleType);
        const adjustedCap = adjustCapacity(base, congestion);
        let existing = await TimeSlot.findOne({ date: dateStr, slotNumber: slot, vehicleType });
        if (!existing) {
          const newSlot = new TimeSlot({
            date: dateStr,
            slotNumber: slot,
            vehicleType,
            capacity: adjustedCap,
            vehicles: [vehicleId]
          });
          await newSlot.save();
          return res.status(201).json({ assignedSlot: slot, date: dateStr, capacity: adjustedCap });
        } else if (existing.vehicles.length < existing.capacity) {
          existing.vehicles.push(vehicleId);
          await existing.save();
          return res.status(200).json({ assignedSlot: slot, date: dateStr, capacity: existing.capacity });
        }
      }
    }
    return res.status(409).json({ message: 'No available slots for this vehicle type in the next 2 days' });
  } catch (err) {
    console.error('Slot assignment failed:', err?.message || err);
    res.status(500).json({ message: 'Internal server error', details: err?.message || err });
  }
});

module.exports = router;
