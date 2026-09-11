const http = require('http');

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testTrustEndpoints() {
  console.log('==================================================');
  console.log('TRUST LAYER — HTTP API INTEGRATION TESTS');
  console.log('==================================================');

  // 1. Health check
  const health = await makeRequest('/api/health');
  console.log('1. Health check status:', health.status, health.body?.message);

  // 2. Register / Login test carrier
  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: 'carrier@backhaulx.com',
    password: 'password123'
  });

  let token = loginRes.body?.token;
  if (!token) {
    // Try registering
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Test Carrier',
      companyName: 'Test Carrier Logistics',
      email: 'carrier@backhaulx.com',
      password: 'password123',
      role: 'CARRIER'
    });
    token = regRes.body?.token;
  }

  console.log('2. Auth Token retrieved:', !!token);

  if (token) {
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Get Trust Profile
    const profileRes = await makeRequest('/api/trust', 'GET', null, authHeaders);
    console.log('3. GET /api/trust response status:', profileRes.status);
    console.log('   Display Score:', profileRes.body?.data?.displayScore);
    console.log('   Status Label:', profileRes.body?.data?.statusLabel);
    console.log('   Completed Shipments:', profileRes.body?.data?.completedShipments);

    // 4. Get Top Partners
    const partnersRes = await makeRequest('/api/trust/partners', 'GET', null, authHeaders);
    console.log('4. GET /api/trust/partners response status:', partnersRes.status);
    console.log('   Partners count:', partnersRes.body?.data?.length || 0);
  }

  console.log('==================================================');
  console.log('HTTP API INTEGRATION TESTS COMPLETE');
  console.log('==================================================');
}

testTrustEndpoints();
