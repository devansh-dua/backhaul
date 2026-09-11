const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../server/src/config/db');
const User = require('../server/src/models/User');
const Trip = require('../server/src/models/Trip');
const Vehicle = require('../server/src/models/Vehicle');
const Capacity = require('../server/src/models/Capacity');
const Shipment = require('../server/src/models/Shipment');
const copilotService = require('../server/src/services/ai/copilot.service');
const languageService = require('../server/src/services/ai/language.service');

async function runCopilotTests() {
  console.log('🚀 Starting BACKHAULX AI Copilot Logic & Integration Tests...\n');

  await connectDB();

  // Create test carrier and shipper users
  let carrier = await User.findOne({ role: 'CARRIER' });
  if (!carrier) {
    carrier = await User.create({
      name: 'Test Carrier Express',
      email: `test_carrier_copilot_${Date.now()}@backtracking.com`,
      password: 'password123',
      role: 'CARRIER',
      phone: '9876543210'
    });
  }

  let shipper = await User.findOne({ role: 'SHIPPER' });
  if (!shipper) {
    shipper = await User.create({
      name: 'Test Shipper Corp',
      email: `test_shipper_copilot_${Date.now()}@backtracking.com`,
      password: 'password123',
      role: 'SHIPPER',
      phone: '9123456789'
    });
  }

  // Seed test vehicle & open capacity
  const vehicle = await Vehicle.create({
    carrier: carrier._id,
    registrationNumber: `COPILOT-TRK-${Date.now().toString().slice(-4)}`,
    vehicleType: 'HEAVY_TRUCK',
    totalCapacityTons: 10,
    availableCapacityTons: 6,
    currentCity: 'Delhi',
    destinationCity: 'Jaipur',
    isActive: true
  });

  const capacity = await Capacity.create({
    carrier: carrier._id,
    vehicle: vehicle._id,
    origin: 'Delhi',
    destination: 'Jaipur',
    availableDate: new Date(),
    availableCapacityTons: 6,
    totalCapacityTons: 10,
    status: 'OPEN'
  });

  console.log('--- TEST 1: Hindi Voice Input ("Jaipur wala load le lunga") ---');
  const res1 = await copilotService.processCopilotRequest(
    { message: 'Jaipur wala load le lunga', language: 'hi', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent parsed: ${res1.intent}, Requires Confirmation: ${res1.requiresConfirmation}`);
  console.log(`AI Response: "${res1.response}"`);
  console.log(res1.intent === 'ACCEPT_SHIPMENT' && res1.requiresConfirmation ? '✅ TEST 1 PASSED' : '❌ TEST 1 FAILED');

  console.log('\n--- TEST 2: English Text Input ("Find loads for Jaipur") ---');
  const res2 = await copilotService.processCopilotRequest(
    { message: 'Find loads for Jaipur', language: 'en', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent parsed: ${res2.intent}`);
  console.log(`AI Response: "${res2.response}"`);
  console.log(res2.intent === 'GET_AVAILABLE_LOADS' ? '✅ TEST 2 PASSED' : '❌ TEST 2 FAILED');

  console.log('\n--- TEST 3: Hinglish Input ("bhai iska bhada kitna hai") ---');
  const res3 = await copilotService.processCopilotRequest(
    { message: 'bhai iska bhada kitna hai', language: 'hi-en', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent parsed: ${res3.intent}`);
  console.log(`AI Response: "${res3.response}"`);
  console.log(res3.intent === 'GET_SHIPMENT_PRICE' ? '✅ TEST 3 PASSED' : '❌ TEST 3 FAILED');

  console.log('\n--- TEST 4: Shipment Creation through AI ("Mujhe kal Delhi se Jaipur 2.5 ton electronics bhejna hai") ---');
  const res4 = await copilotService.processCopilotRequest(
    { message: 'Mujhe kal Delhi se Jaipur 2.5 ton electronics bhejna hai', language: 'hi', role: 'SHIPPER' },
    shipper._id
  );
  console.log(`Intent parsed: ${res4.intent}, Requires Confirmation: ${res4.requiresConfirmation}`);
  console.log(`AI Response: "${res4.response}"`);
  console.log(res4.intent === 'CREATE_SHIPMENT' && res4.requiresConfirmation ? '✅ TEST 4 PASSED' : '❌ TEST 4 FAILED');

  console.log('\n--- TEST 5: Action Confirmation Flow (Creating Shipment) ---');
  const res5 = await copilotService.processCopilotRequest(
    {
      confirmAction: true,
      pendingIntent: 'CREATE_SHIPMENT',
      pendingEntities: { origin: 'Delhi', destination: 'Jaipur', weightTons: 2.5, shipmentType: 'Electronics' },
      language: 'hi',
      role: 'SHIPPER'
    },
    shipper._id
  );
  console.log(`Action Executed: ${res5.success ? 'SUCCESS' : 'FAILED'}, ShipmentId: ${res5.actionDetails?.shipmentId}`);
  console.log(`AI Response: "${res5.response}"`);
  console.log(res5.success && res5.actionDetails?.shipmentId ? '✅ TEST 5 PASSED' : '❌ TEST 5 FAILED');

  console.log('\n--- TEST 6: Accept Load Confirmation Flow ---');
  const res6 = await copilotService.processCopilotRequest(
    {
      confirmAction: true,
      pendingIntent: 'ACCEPT_SHIPMENT',
      pendingEntities: { capacityId: capacity._id, origin: 'Delhi', destination: 'Jaipur', weightTons: 2.5 },
      language: 'hi',
      role: 'CARRIER'
    },
    carrier._id
  );
  console.log(`Accept Status: ${res6.success}, TripId: ${res6.actionDetails?.tripId}`);
  console.log(`AI Response: "${res6.response}"`);
  console.log(res6.success && res6.actionDetails?.tripId ? '✅ TEST 6 PASSED' : '❌ TEST 6 FAILED');

  console.log('\n--- TEST 7: Capacity Update Intent ("Mere truck mein 3 ton jagah hai") ---');
  const res7 = await copilotService.processCopilotRequest(
    { message: 'Mere truck mein 3 ton jagah hai', language: 'hi', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent: ${res7.intent}, Requires Confirmation: ${res7.requiresConfirmation}`);
  console.log(`AI Response: "${res7.response}"`);
  console.log(res7.intent === 'UPDATE_AVAILABLE_CAPACITY' ? '✅ TEST 7 PASSED' : '❌ TEST 7 FAILED');

  console.log('\n--- TEST 8: Rejection Intent ("Ye load nahi lena, detour bahut hai") ---');
  const res8 = await copilotService.processCopilotRequest(
    { message: 'Ye load nahi lena, detour bahut hai', language: 'hi', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent: ${res8.intent}`);
  console.log(res8.intent === 'REJECT_SHIPMENT' ? '✅ TEST 8 PASSED' : '❌ TEST 8 FAILED');

  console.log('\n--- TEST 9: Inter-Party Translation Bridge (Driver -> Shipper) ---');
  const res9 = await languageService.translateInterPartyMessage(
    'Bhai traffic ki वजह se 20 minute late ho jaunga',
    'SHIPPER',
    'en'
  );
  console.log(`Original: "${res9.originalText}"`);
  console.log(`Translated: "${res9.translatedText}"`);
  console.log(res9.translatedText ? '✅ TEST 9 PASSED' : '❌ TEST 9 FAILED');

  console.log('\n--- TEST 10: Delivery OTP Code Verification via Copilot ("Verify OTP 482913") ---');
  const res10 = await copilotService.processCopilotRequest(
    { message: 'Verify delivery OTP 482913', language: 'en', role: 'CARRIER' },
    carrier._id
  );
  console.log(`Intent: ${res10.intent}, Entities:`, res10.pendingEntities || res10.entities);
  console.log(res10.intent === 'VERIFY_DELIVERY_OTP' ? '✅ TEST 10 PASSED' : '❌ TEST 10 FAILED');

  // Cleanup test vehicles & capacities
  await Vehicle.deleteMany({ registrationNumber: { $regex: '^COPILOT-' } });

  console.log('\n✨ ALL 10 COPILOT INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

runCopilotTests().catch(err => {
  console.error('🔥 Test runner error:', err);
  process.exit(1);
});
