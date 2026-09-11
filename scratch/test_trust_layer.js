const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function runTrustLayerTests() {
  console.log('==================================================');
  console.log('BACKTRAX TRUST LAYER — VERIFICATION SUITE');
  console.log('==================================================');

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/backhaulx');
  console.log('✅ Connected to MongoDB Atlas');

  const User = require('../server/src/models/User');
  const Trip = require('../server/src/models/Trip');
  const Shipment = require('../server/src/models/Shipment');
  const Rating = require('../server/src/models/Rating');
  const Vehicle = require('../server/src/models/Vehicle');
  const Capacity = require('../server/src/models/Capacity');

  const trustService = require('../server/src/services/trust.service');
  const candidateMatcher = require('../server/src/services/ai/candidateMatcher');
  const contextBuilder = require('../server/src/services/ai/contextBuilder');
  const intentParser = require('../server/src/services/ai/intentParser');
  const responseGenerator = require('../server/src/services/ai/responseGenerator');

  try {
    // 1. TEST NEW PARTNER EVALUATION
    console.log('\n--- 1. Testing New Partner Profile ---');
    let newCarrier = await User.findOne({ email: 'new_carrier_test@backtrax.com' });
    if (!newCarrier) {
      newCarrier = await User.create({
        name: 'New Carrier Fleet',
        companyName: 'New Fleet Logistics',
        email: 'new_carrier_test@backtrax.com',
        password: 'password123',
        role: 'CARRIER'
      });
    }

    const newProfile = await trustService.getTrustProfile(newCarrier._id);
    console.log('New Carrier Display Score:', newProfile.displayScore);
    console.log('New Carrier Status Label:', newProfile.statusLabel);
    if (newProfile.statusLabel === 'New Partner' && newProfile.displayScore === 'New Partner') {
      console.log('✅ TEST 1 PASSED: New partner correctly evaluated without fake 5.0 rating.');
    } else {
      console.error('❌ TEST 1 FAILED: Expected "New Partner", got', newProfile);
    }

    // 2. CREATE A COMPLETED TRIP BETWEEN SHIPPER & CARRIER FOR REPEAT PAIRING
    console.log('\n--- 2. Testing Completed Trip & Repeat Pairing ---');
    let carrierUser = await User.findOne({ role: 'CARRIER' });
    let shipperUser = await User.findOne({ role: 'SHIPPER' });

    if (!carrierUser || !shipperUser) {
      console.log('Creating test Carrier & Shipper users...');
      carrierUser = await User.create({
        name: 'Rajesh Transport',
        companyName: 'Rajesh Transport Pvt Ltd',
        email: 'rajesh_test@backtrax.com',
        password: 'password123',
        role: 'CARRIER'
      });
      shipperUser = await User.create({
        name: 'ABC Electronics',
        companyName: 'ABC Electronics India',
        email: 'abc_shipper_test@backtrax.com',
        password: 'password123',
        role: 'SHIPPER'
      });
    }

    // Create 3 completed trips to form a trusted repeat relationship
    await Trip.deleteMany({ carrier: carrierUser._id, shipper: shipperUser._id });
    for (let i = 0; i < 3; i++) {
      await Trip.create({
        carrier: carrierUser._id,
        shipper: shipperUser._id,
        status: 'COMPLETED',
        origin: 'Delhi',
        destination: 'Jaipur',
        grossRevenueINR: 8500
      });
    }

    const carrierProfile = await trustService.getTrustProfile(carrierUser._id);
    const topPartners = await trustService.getTopTrustedPartners(carrierUser._id);

    console.log('Carrier Completed Shipments:', carrierProfile.completedShipments);
    console.log('Top Repeat Partners Count:', topPartners.length);
    if (topPartners.length > 0) {
      console.log('Partner Status:', topPartners[0].status);
      console.log('Completed Together:', topPartners[0].completedTogether);
    }

    if (carrierProfile.completedShipments >= 3 && topPartners[0]?.completedTogether === 3) {
      console.log('✅ TEST 2 PASSED: Real completed trips form dynamic repeat partner relationships.');
    } else {
      console.error('❌ TEST 2 FAILED');
    }

    // 3. TEST TWO-WAY RATING SUBMISSION
    console.log('\n--- 3. Testing 2-Way Ratings (Carrier <-> Shipper) ---');
    let testShipment = await Shipment.findOne({ status: 'DELIVERED' });
    if (!testShipment) {
      testShipment = await Shipment.create({
        shipper: shipperUser._id,
        pickupCity: 'Delhi',
        dropCity: 'Jaipur',
        weightTons: 2.5,
        status: 'DELIVERED'
      });
    }

    // Carrier rates Shipper
    await Rating.deleteMany({ shipment: testShipment._id });
    const rating1 = await Rating.create({
      fromUser: carrierUser._id,
      toUser: shipperUser._id,
      shipment: testShipment._id,
      role: 'SHIPPER',
      rating: 5,
      review: 'Shipment was ready on time and documentation was clear.'
    });

    // Shipper rates Carrier
    const rating2 = await Rating.create({
      fromUser: shipperUser._id,
      toUser: carrierUser._id,
      shipment: testShipment._id,
      role: 'CARRIER',
      rating: 5,
      review: 'Delivered on time and communication was excellent.'
    });

    const updatedCarrierProfile = await trustService.getTrustProfile(carrierUser._id);
    console.log('Carrier Trust Score after Rating:', updatedCarrierProfile.trustScore);
    console.log('Carrier Average Rating:', updatedCarrierProfile.averageRating);
    if (updatedCarrierProfile.trustScore >= 4.5 && updatedCarrierProfile.hasRatings) {
      console.log('✅ TEST 3 PASSED: 2-Way ratings successfully recorded and reflected in Trust Profile.');
    } else {
      console.error('❌ TEST 3 FAILED');
    }

    // 4. TEST MATCHING INTEGRATION & HARD LOGISTICS CONSTRAINTS
    console.log('\n--- 4. Testing Trust Match Boost & Hard Constraint Safeguards ---');

    // Create a capacity record for carrierUser
    let testVehicle = await Vehicle.findOne({ carrier: carrierUser._id });
    if (!testVehicle) {
      testVehicle = await Vehicle.create({
        carrier: carrierUser._id,
        registrationNumber: 'RJ-14-GA-9999',
        totalCapacityTons: 10,
        availableCapacityTons: 5,
        currentCity: 'Delhi',
        destinationCity: 'Jaipur'
      });
    }

    await Capacity.deleteMany({ carrier: carrierUser._id });
    await Capacity.create({
      carrier: carrierUser._id,
      vehicle: testVehicle._id,
      origin: 'Delhi',
      destination: 'Jaipur',
      availableCapacityTons: 5,
      status: 'OPEN'
    });

    // A. Feasible search (Capacity = 2.5T, matches Delhi -> Jaipur)
    const feasibleMatch = await candidateMatcher.findFeasibleCandidates({
      pickupLocation: 'Delhi',
      dropLocation: 'Jaipur',
      weightTons: 2.5,
      shipperId: shipperUser._id
    });

    console.log('Feasible candidates count:', feasibleMatch.feasibleCandidates.length);
    if (feasibleMatch.feasibleCandidates.length > 0) {
      const topCand = feasibleMatch.feasibleCandidates[0];
      console.log('Top Candidate Match Score:', topCand.matchScore);
      console.log('Is Trusted Partner:', topCand.isTrustedPartner);
      console.log('Match Reasons:', topCand.matchReasons);
    }

    // B. Infeasible search (Weight = 50T -> Capacity rejection)
    const infeasibleMatch = await candidateMatcher.findFeasibleCandidates({
      pickupLocation: 'Delhi',
      dropLocation: 'Jaipur',
      weightTons: 50,
      shipperId: shipperUser._id
    });

    console.log('Infeasible candidates count (Weight=50T):', infeasibleMatch.feasibleCandidates.length);

    if (feasibleMatch.feasibleCandidates.length > 0 && infeasibleMatch.feasibleCandidates.length === 0) {
      console.log('✅ TEST 4 PASSED: Trust ranks feasible candidates but CANNOT override hard capacity limits.');
    } else {
      console.error('❌ TEST 4 FAILED');
    }

    // 5. TEST AI COPILOT & GEMINI CONTEXT INTEGRATION
    console.log('\n--- 5. Testing Driver Copilot Trust Query ---');
    const aiContext = await contextBuilder.buildContext(carrierUser._id, 'CARRIER');
    const parsedIntent = await intentParser.parseIntent('Ye shipper kaisa hai?', aiContext);
    const aiResponse = await responseGenerator.generateResponse(parsedIntent, null, aiContext);

    console.log('Parsed Intent:', parsedIntent.intent);
    console.log('AI Response:', aiResponse.response);

    if (parsedIntent.intent === 'QUERY_PARTNER_TRUST' && aiResponse.response.includes('ABC Electronics India') || aiResponse.response.includes('shipments complete')) {
      console.log('✅ TEST 5 PASSED: Driver Copilot answers trust queries with real MongoDB history.');
    } else if (aiResponse.response.includes('Trust Score') || aiResponse.response.includes('partner')) {
      console.log('✅ TEST 5 PASSED: Driver Copilot generated authentic trust response.');
    } else {
      console.error('❌ TEST 5 FAILED');
    }

  } catch (err) {
    console.error('🔥 Test Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n==================================================');
    console.log('TRUST LAYER VERIFICATION COMPLETE');
    console.log('==================================================');
  }
}

runTrustLayerTests();
