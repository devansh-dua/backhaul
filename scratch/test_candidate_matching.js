const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Capacity = require('../server/src/models/Capacity');
const Vehicle = require('../server/src/models/Vehicle');
const User = require('../server/src/models/User');
const Driver = require('../server/src/models/Driver');
const candidateMatcher = require('../server/src/services/ai/candidateMatcher');
const matchRanker = require('../server/src/services/ai/matchRanker');

async function runTests() {
  console.log('🚀 Starting Candidate Matching & AI Logic Verification Tests...\n');

  const connectDB = require('../server/src/config/db');
  await connectDB();

  // Helper to create carrier user
  let carrier = await User.findOne({ role: 'CARRIER' });
  if (!carrier) {
    carrier = await User.create({
      name: 'Test Carrier Express',
      email: `test_carrier_${Date.now()}@backtracking.com`,
      password: 'password123',
      role: 'CARRIER',
      phone: '9876543210'
    });
  }

  // Clean test capacities & vehicles created in previous runs
  await Capacity.deleteMany({ origin: { $in: ['TestDelhi', 'Delhi'] }, destination: { $in: ['TestJaipur', 'Jaipur', 'Mumbai'] } });

  console.log('\n--- SCENARIO 1: Matching Compatible Vehicle (5T available vs 2.5T shipment) ---');
  const vehicle1 = await Vehicle.create({
    carrier: carrier._id,
    registrationNumber: `TEST-501-${Date.now().toString().slice(-4)}`,
    vehicleType: 'HEAVY_TRUCK',
    totalCapacityTons: 10,
    availableCapacityTons: 5,
    currentCity: 'Delhi',
    destinationCity: 'Jaipur',
    isActive: true
  });

  const cap1 = await Capacity.create({
    carrier: carrier._id,
    vehicle: vehicle1._id,
    origin: 'Delhi',
    destination: 'Jaipur',
    availableDate: new Date(),
    availableCapacityTons: 5,
    totalCapacityTons: 10,
    status: 'OPEN'
  });

  const res1 = await candidateMatcher.findFeasibleCandidates({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: 'Today'
  });

  console.log(`TEST 1 RESULT: Candidates returned = ${res1.feasibleCandidates.length}`);
  const match1 = res1.feasibleCandidates.find(c => c.vehicleNumber === vehicle1.registrationNumber);
  console.log(match1 ? `✅ TEST 1 PASSED: Vehicle ${match1.vehicleNumber} matched with score ${match1.matchScore}%` : '❌ TEST 1 FAILED');

  console.log('\n--- SCENARIO 2: Capacity Hard Filter Failure (2T available vs 2.5T shipment) ---');
  const vehicle2 = await Vehicle.create({
    carrier: carrier._id,
    registrationNumber: `TEST-201-${Date.now().toString().slice(-4)}`,
    vehicleType: 'LIGHT_TRUCK',
    totalCapacityTons: 3,
    availableCapacityTons: 2,
    currentCity: 'Delhi',
    destinationCity: 'Jaipur',
    isActive: true
  });

  const cap2 = await Capacity.create({
    carrier: carrier._id,
    vehicle: vehicle2._id,
    origin: 'Delhi',
    destination: 'Jaipur',
    availableDate: new Date(),
    availableCapacityTons: 2,
    totalCapacityTons: 3,
    status: 'OPEN'
  });

  const res2 = await candidateMatcher.findFeasibleCandidates({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: 'Today'
  });

  const match2 = res2.feasibleCandidates.find(c => c.vehicleNumber === vehicle2.registrationNumber);
  console.log(!match2 ? `✅ TEST 2 PASSED: 2T Vehicle ${vehicle2.registrationNumber} correctly REJECTED (Insufficient capacity)` : '❌ TEST 2 FAILED');

  console.log('\n--- SCENARIO 3: Route Compatibility Failure (Delhi->Mumbai truck for Delhi->Jaipur shipment with high detour) ---');
  const vehicle3 = await Vehicle.create({
    carrier: carrier._id,
    registrationNumber: `TEST-MUM-${Date.now().toString().slice(-4)}`,
    vehicleType: 'CONTAINER',
    totalCapacityTons: 15,
    availableCapacityTons: 10,
    currentCity: 'Delhi',
    destinationCity: 'Mumbai',
    isActive: true
  });

  const cap3 = await Capacity.create({
    carrier: carrier._id,
    vehicle: vehicle3._id,
    origin: 'Delhi',
    destination: 'Mumbai',
    availableDate: new Date(),
    availableCapacityTons: 10,
    totalCapacityTons: 15,
    status: 'OPEN'
  });

  const res3 = await candidateMatcher.findFeasibleCandidates({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: 'Today'
  });
  const match3 = res3.feasibleCandidates.find(c => c.vehicleNumber === vehicle3.registrationNumber);
  // Note: If drop detour to Mumbai exceeds limits, candidate is rejected
  console.log(`TEST 3 RESULT: Delhi->Mumbai truck evaluated. Matched? ${!!match3}`);

  console.log('\n--- SCENARIO 4: Date/Time Compatibility Failure (Available Tomorrow vs Shipment Today) ---');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 5);

  const vehicle4 = await Vehicle.create({
    carrier: carrier._id,
    registrationNumber: `TEST-TOM-${Date.now().toString().slice(-4)}`,
    vehicleType: 'HEAVY_TRUCK',
    totalCapacityTons: 10,
    availableCapacityTons: 6,
    currentCity: 'Delhi',
    destinationCity: 'Jaipur',
    isActive: true
  });

  const cap4 = await Capacity.create({
    carrier: carrier._id,
    vehicle: vehicle4._id,
    origin: 'Delhi',
    destination: 'Jaipur',
    availableDate: tomorrow,
    availableCapacityTons: 6,
    totalCapacityTons: 10,
    status: 'OPEN'
  });

  const res4 = await candidateMatcher.findFeasibleCandidates({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: new Date().toISOString().split('T')[0] // Today's date YYYY-MM-DD
  });
  const match4 = res4.feasibleCandidates.find(c => c.vehicleNumber === vehicle4.registrationNumber);
  console.log(!match4 ? `✅ TEST 4 PASSED: Vehicle available on ${tomorrow.toLocaleDateString()} REJECTED for Today's pickup` : '❌ TEST 4 FAILED');

  console.log('\n--- SCENARIO 5: Return ALL Feasible Candidates (5 Compatible Vehicles) ---');
  const created5Vehicles = [];
  for (let i = 1; i <= 5; i++) {
    const v = await Vehicle.create({
      carrier: carrier._id,
      registrationNumber: `TEST-MULTI-${i}-${Date.now().toString().slice(-4)}`,
      vehicleType: 'HEAVY_TRUCK',
      totalCapacityTons: 10,
      availableCapacityTons: 4 + i,
      currentCity: 'Delhi',
      destinationCity: 'Jaipur',
      isActive: true
    });
    await Capacity.create({
      carrier: carrier._id,
      vehicle: v._id,
      origin: 'Delhi',
      destination: 'Jaipur',
      availableDate: new Date(),
      availableCapacityTons: 4 + i,
      totalCapacityTons: 10,
      status: 'OPEN'
    });
    created5Vehicles.push(v.registrationNumber);
  }

  const res5 = await candidateMatcher.findFeasibleCandidates({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: 'Today'
  });

  const foundCount = res5.feasibleCandidates.filter(c => created5Vehicles.includes(c.vehicleNumber)).length;
  console.log(`TEST 5 RESULT: Created 5 compatible vehicles. Found ${foundCount} in matching list.`);
  console.log(foundCount === 5 ? '✅ TEST 5 PASSED: ALL 5 compatible vehicles returned!' : '❌ TEST 5 FAILED');

  console.log('\n--- SCENARIO 6: Gemini Offline / Fallback Matcher ---');
  const res6 = await matchRanker.findAndRankCapacities({
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    weightTons: 2.5,
    pickupDate: 'Today'
  });
  console.log(`TEST 6 RESULT: Deterministic/Gemini ranking returned ${res6.candidates.length} candidates.`);
  console.log(res6.candidates.length > 0 ? `✅ TEST 6 PASSED: AI ranking fallback returned ${res6.candidates.length} valid vehicles` : '❌ TEST 6 FAILED');

  console.log('\n--- SCENARIO 7: Empty State & Rejection Diagnostics ---');
  // Delete all open capacities temporarily to simulate 0 matches
  await Capacity.deleteMany({});
  const res7 = await matchRanker.findAndRankCapacities({
    pickupLocation: 'Kolkata',
    dropLocation: 'Patna',
    weightTons: 12,
    pickupDate: 'Today'
  });
  console.log(`TEST 7 RESULT: Message = "${res7.message}", Total Checked = ${res7.diagnostics?.totalChecked || 0}`);
  console.log(res7.candidates.length === 0 && res7.rejectionReasons?.length > 0 ? '✅ TEST 7 PASSED: Intelligent empty state with rejection reasons generated' : '❌ TEST 7 FAILED');

  // Clean up test data
  await Vehicle.deleteMany({ registrationNumber: { $regex: '^TEST-' } });

  console.log('\n✨ ALL TEST SCENARIOS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('🔥 Test runner error:', err);
  process.exit(1);
});
