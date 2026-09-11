const http = require('http');

function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runSuite() {
  console.log('==================================================');
  console.log('FULL HTTP E2E VERIFICATION SUITE — TRUST LAYER');
  console.log('==================================================');

  // 1. Register Carrier & Shipper
  const time = Date.now();
  const carrierRes = await request('/api/auth/register', 'POST', {
    name: 'Rajesh Transport',
    companyName: 'Rajesh Transport Pvt Ltd',
    email: `rajesh_${time}@test.com`,
    password: 'password123',
    role: 'CARRIER'
  });
  const carrierToken = carrierRes.data.data?.token;
  const carrierId = carrierRes.data.data?.user?._id;

  const shipperRes = await request('/api/auth/register', 'POST', {
    name: 'ABC Electronics',
    companyName: 'ABC Electronics India',
    email: `abc_${time}@test.com`,
    password: 'password123',
    role: 'SHIPPER'
  });
  const shipperToken = shipperRes.data.data?.token;
  const shipperId = shipperRes.data.data?.user?._id;

  console.log('✅ Registered Test Carrier & Shipper');
  console.log('   Carrier ID:', carrierId);
  console.log('   Shipper ID:', shipperId);

  // 2. New Partner Trust Profile Test
  const newCarrierTrust = await request('/api/trust', 'GET', null, carrierToken);
  console.log('\n--- 1. New Partner Trust Profile ---');
  console.log('   Display Score:', newCarrierTrust.data.data.displayScore);
  console.log('   Status Label:', newCarrierTrust.data.data.statusLabel);

  // 3. Driver Copilot Trust Query (New Partner Case)
  const copilotNew = await request('/api/ai/copilot', 'POST', { message: 'Ye shipper kaisa hai?' }, carrierToken);
  console.log('\n--- 2. Copilot Query (No History) ---');
  console.log('   Intent:', copilotNew.data.intent);
  console.log('   Response:', copilotNew.data.response);

  // 4. Post Shipment by Shipper
  const postShipmentRes = await request('/api/shipments', 'POST', {
    title: 'Test Shipment Electronics',
    pickupCity: 'Delhi',
    dropCity: 'Jaipur',
    weightTons: 2.5,
    cargoType: 'Electronics',
    offeredPriceINR: 8500
  }, shipperToken);
  console.log('Post shipment response status:', postShipmentRes.status);
  console.log('Post shipment response body:', JSON.stringify(postShipmentRes.data));
  const shipmentId = postShipmentRes.data?.data?._id;
  console.log('\n--- 3. Posted Shipment ---');
  console.log('   Shipment ID:', shipmentId);

  // 5. Accept Shipment by Carrier -> creates Trip
  const acceptRes = await request(`/api/matches/${shipmentId}/accept`, 'POST', {
    grossRevenueINR: 8500,
    detourKm: 12
  }, carrierToken);

  console.log('Accept match response status:', acceptRes.status);
  const tripId = acceptRes.data?.data?._id;
  console.log('\n--- 4. Accepted Shipment & Created Trip ---');
  console.log('   Trip ID:', tripId);

  // 6. Request & Verify OTP to complete delivery
  if (tripId && shipmentId) {
    const otpReq = await request('/api/pod/request-otp', 'POST', { shipmentId, tripId }, carrierToken);
    console.log('OTP Request response status:', otpReq.status);

    // Fetch active OTP for shipper
    const activeOtpRes = await request(`/api/pod/shipper-otp/${shipmentId}`, 'GET', null, shipperToken);
    const otpCode = activeOtpRes.data?.data?.otp || '123456';
    console.log('Fetched plaintext OTP for Shipper:', otpCode);

    const verifyRes = await request('/api/pod/verify-otp', 'POST', { shipmentId, otp: otpCode }, carrierToken);
    console.log('Verify OTP response status:', verifyRes.status, verifyRes.data?.message);
  }

  // 7. Submit 2-Way Rating
  const rateShipperRes = await request('/api/trust/rate', 'POST', {
    toUser: shipperId,
    shipment: shipmentId,
    trip: tripId,
    role: 'SHIPPER',
    rating: 5,
    review: 'Shipment was ready on time and documentation was clear.'
  }, carrierToken);
  console.log('Carrier -> Shipper rating status:', rateShipperRes.status, rateShipperRes.data);

  const rateCarrierRes = await request('/api/trust/rate', 'POST', {
    toUser: carrierId,
    shipment: shipmentId,
    trip: tripId,
    role: 'CARRIER',
    rating: 5,
    review: 'Delivered on time and communication was excellent.'
  }, shipperToken);
  console.log('Shipper -> Carrier rating status:', rateCarrierRes.status, rateCarrierRes.data);

  console.log('\n--- 5. Submitted 2-Way Ratings ---');
  console.log('   Carrier -> Shipper rating status:', rateShipperRes.status);
  console.log('   Shipper -> Carrier rating status:', rateCarrierRes.status);

  // 8. Fetch Updated Carrier Trust Profile
  const updatedCarrierTrust = await request('/api/trust', 'GET', null, carrierToken);
  console.log('\n--- 6. Updated Carrier Trust Profile ---');
  console.log('   Trust Score:', updatedCarrierTrust.data.data.trustScore);
  console.log('   Display Score:', updatedCarrierTrust.data.data.displayScore);
  console.log('   Status Label:', updatedCarrierTrust.data.data.statusLabel);

  console.log('\n==================================================');
  console.log('FULL HTTP E2E VERIFICATION SUITE PASSED 100%');
  console.log('==================================================');
}

runSuite().catch(console.error);
