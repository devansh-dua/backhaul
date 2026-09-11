const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testDirect() {
  console.log('Connecting to Mongo...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const User = require('../server/src/models/User');
  const trustService = require('../server/src/services/trust.service');

  const usersCount = await User.countDocuments();
  console.log('Total users in DB:', usersCount);

  const firstUser = await User.findOne();
  if (firstUser) {
    console.log('First user:', firstUser.name, firstUser.role, firstUser.email);
    const profile = await trustService.getTrustProfile(firstUser._id);
    console.log('Trust Profile:', JSON.stringify(profile, null, 2));
  }

  await mongoose.disconnect();
}

testDirect().catch(console.error);
