const mongoose = require('mongoose');
const User = require('./models/user');
const TimeSlot = require('./models/TimeSlot');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smartroute_backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Demo users data
const users = [
  {
    name: "John Doe",
    from: "Delhi",
    to: "Kanchi Dham",
    date: new Date("2024-04-23"),
    vehicleNo: "DL01AB1234",
    vehicleType: "car"
  },
  {
    name: "Jane Smith",
    from: "Agra",
    to: "Kanchi Dham",
    date: new Date("2024-04-23"),
    vehicleNo: "UP02CD5678",
    vehicleType: "2wheeler"
  },
  {
    name: "Mike Johnson",
    from: "Jaipur",
    to: "Kanchi Dham",
    date: new Date("2024-04-23"),
    vehicleNo: "RJ03EF9012",
    vehicleType: "heavy"
  }
];

// Demo time slots data
const timeSlots = [
  {
    date: "2024-04-23",
    slotNumber: 1,
    vehicleType: "car",
    vehicles: ["DL01AB1234"],
    capacity: 200
  },
  {
    date: "2024-04-23",
    slotNumber: 2,
    vehicleType: "2wheeler",
    vehicles: ["UP02CD5678"],
    capacity: 200
  },
  {
    date: "2024-04-23",
    slotNumber: 3,
    vehicleType: "heavy",
    vehicles: ["RJ03EF9012"],
    capacity: 200
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await TimeSlot.deleteMany({});

    // Insert new data
    await User.insertMany(users);
    await TimeSlot.insertMany(timeSlots);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();