const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');
const Capacity = require('../models/Capacity');
const Trip = require('../models/Trip');

async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Connected to Database for Seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Shipment.deleteMany({});
    await Capacity.deleteMany({});
    await Trip.deleteMany({});

    console.log('🧹 Cleared old records');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Carrier User
    const carrier = await User.create({
      name: 'Rajesh Sharma',
      email: 'carrier@backhaulx.com',
      password: hashedPassword,
      role: 'CARRIER',
      company: 'Apex Express Logistics',
      phone: '+91 98765 43210',
      rating: 4.9,
      completedTrips: 34,
      onTimePercentage: 98.5,
      isVerified: true
    });

    // 2. Create Shipper User
    const shipper = await User.create({
      name: 'Vikram Mehta',
      email: 'shipper@backhaulx.com',
      password: hashedPassword,
      role: 'SHIPPER',
      company: 'Jaipur Auto Components Ltd',
      phone: '+91 98123 45678',
      rating: 4.8,
      completedTrips: 28,
      onTimePercentage: 99.0,
      isVerified: true
    });

    console.log('👤 Created Carrier & Shipper accounts');

    // 3. Create Primary Vehicle: RJ-104
    const vehicle = await Vehicle.create({
      carrier: carrier._id,
      registrationNumber: 'RJ-104',
      vehicleType: 'HEAVY_TRUCK',
      totalCapacityTons: 12.0,
      usedCapacityTons: 4.2,
      availableCapacityTons: 7.8,
      volumeCapacityCbm: 42,
      currentCity: 'Delhi',
      destinationCity: 'Jaipur',
      routeCoordinates: [
        { city: 'Delhi', lat: 28.6139, lng: 77.2090 },
        { city: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
        { city: 'Neemrana', lat: 27.9890, lng: 76.3813 },
        { city: 'Kotputli', lat: 27.7028, lng: 76.2008 },
        { city: 'Shahpura', lat: 27.3871, lng: 75.9615 },
        { city: 'Jaipur', lat: 26.9124, lng: 75.7873 }
      ],
      driverHoursAvailable: 6.33, // 6h 20m
      maxDrivingHours: 11.0,
      restStatus: 'WELL_RESTED',
      cargoRestrictions: [],
      isActive: true
    });

    console.log('🚛 Created Vehicle RJ-104 (Delhi -> Jaipur, 7.8T available)');

    // 4. Create Capacity Listing
    await Capacity.create({
      carrier: carrier._id,
      vehicle: vehicle._id,
      origin: 'Delhi',
      destination: 'Jaipur',
      availableDate: new Date(),
      availableCapacityTons: 7.8,
      totalCapacityTons: 12.0,
      departureTime: '06:30 PM',
      driverHoursAvailable: 6.33,
      status: 'OPEN'
    });

    // 5. Create Corridor Candidate Shipments
    const shipments = await Shipment.insertMany([
      {
        shipper: shipper._id,
        title: 'Auto Parts & Bearings',
        pickupCity: 'Gurgaon',
        dropCity: 'Neemrana',
        pickupLocation: { address: 'Manesar Industrial Area Sec 8', lat: 28.3516, lng: 76.9366 },
        dropLocation: { address: 'RIICO Industrial Zone Neemrana', lat: 27.9890, lng: 76.3813 },
        weightTons: 2.5,
        volumeCbm: 8.5,
        cargoType: 'Industrial Auto Parts',
        deadline: new Date(Date.now() + 24 * 3600 * 1000),
        offeredPriceINR: 7200,
        status: 'POSTED'
      },
      {
        shipper: shipper._id,
        title: 'Precision Electrical Wiring Kits',
        pickupCity: 'Manesar',
        dropCity: 'Kotputli',
        pickupLocation: { address: 'Sector 5 IMT Manesar', lat: 28.3516, lng: 76.9366 },
        dropLocation: { address: 'Kotputli Freight Terminal', lat: 27.7028, lng: 76.2008 },
        weightTons: 1.8,
        volumeCbm: 6.0,
        cargoType: 'Electrical Components',
        deadline: new Date(Date.now() + 30 * 3600 * 1000),
        offeredPriceINR: 5400,
        status: 'POSTED'
      },
      {
        shipper: shipper._id,
        title: 'Textile Machinery Spare Parts',
        pickupCity: 'Delhi',
        dropCity: 'Jaipur',
        pickupLocation: { address: 'Okhla Industrial Estate Phase III', lat: 28.5284, lng: 77.2785 },
        dropLocation: { address: 'VKI Area Road No 14 Jaipur', lat: 26.9124, lng: 75.7873 },
        weightTons: 3.2,
        volumeCbm: 12.0,
        cargoType: 'Machinery Hardware',
        deadline: new Date(Date.now() + 18 * 3600 * 1000),
        offeredPriceINR: 9100,
        status: 'POSTED'
      },
      {
        shipper: shipper._id,
        title: 'Consumer Packed Food Cartons',
        pickupCity: 'Shahpura',
        dropCity: 'Jaipur',
        pickupLocation: { address: 'NH 48 Logistics Hub Shahpura', lat: 27.3871, lng: 75.9615 },
        dropLocation: { address: 'Sanganer Cargo Depot Jaipur', lat: 26.8143, lng: 75.8073 },
        weightTons: 2.7,
        volumeCbm: 9.0,
        cargoType: 'FMCG Goods',
        deadline: new Date(Date.now() + 36 * 3600 * 1000),
        offeredPriceINR: 6800,
        status: 'POSTED'
      }
    ]);

    console.log(`📦 Seeded ${shipments.length} Corridor Shipments along Delhi-Jaipur highway`);

    // 6. Create Initial Demo Active Trip
    const activeTrip = await Trip.create({
      carrier: carrier._id,
      shipper: shipper._id,
      vehicle: vehicle._id,
      shipments: [shipments[0]._id, shipments[1]._id, shipments[2]._id],
      origin: 'Delhi',
      destination: 'Jaipur',
      status: 'IN_TRANSIT',
      currentPosition: {
        lat: 28.4595,
        lng: 77.0266,
        city: 'Gurgaon'
      },
      currentSpeedKm: 64,
      eta: '3 hrs 20 mins',
      grossRevenueINR: 21700,
      netContributionINR: 18900,
      detourKm: 24,
      co2SavedKg: 220
    });

    console.log('🏁 Created Active Demo Trip:', activeTrip._id);

    console.log('✅ SEEDING COMPLETE SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seedDatabase();
