const Tracking = require('../models/Tracking');
const Trip = require('../models/Trip');
const routeService = require('./route.service');

// Default fallback corridor for Delhi-Jaipur highway (NH 48)
const DELHI_JAIPUR_CORRIDOR = [
  { city: 'Delhi (Dhaula Kuan)', lat: 28.5921, lng: 77.1691, eta: '4h 15m', progress: 0 },
  { city: 'Gurgaon (IFFCO Chowk)', lat: 28.4595, lng: 77.0266, eta: '3h 45m', progress: 15 },
  { city: 'Manesar Industrial Hub', lat: 28.3516, lng: 76.9366, eta: '3h 15m', progress: 30 },
  { city: 'Dharuhera Toll Plaza', lat: 28.2045, lng: 76.7865, eta: '2h 45m', progress: 45 },
  { city: 'Neemrana Industrial Zone', lat: 27.9890, lng: 76.3813, eta: '2h 10m', progress: 60 },
  { city: 'Kotputli Checkpost', lat: 27.7028, lng: 76.2008, eta: '1h 35m', progress: 75 },
  { city: 'Shahpura Toll', lat: 27.3871, lng: 75.9615, eta: '50m', progress: 88 },
  { city: 'Jaipur (VKI Transport Nagar)', lat: 26.9124, lng: 75.7873, eta: 'Arrived', progress: 100 }
];

class TrackingService {
  getCorridorWaypoints(originCity, destCity) {
    if (!originCity && !destCity) {
      return DELHI_JAIPUR_CORRIDOR;
    }

    const c1 = routeService.getCoords(originCity || 'Delhi');
    const c2 = routeService.getCoords(destCity || 'Jaipur');

    const totalDist = routeService.calculateDistance(c1.lat, c1.lng, c2.lat, c2.lng);
    const steps = 8;
    const waypoints = [];

    for (let i = 0; i <= steps; i++) {
      const progress = Math.round((i / steps) * 100);
      const fraction = i / steps;
      
      const curveOffset = Math.sin(fraction * Math.PI) * 0.04;

      const lat = Number((c1.lat + (c2.lat - c1.lat) * fraction + curveOffset).toFixed(4));
      const lng = Number((c1.lng + (c2.lng - c1.lng) * fraction).toFixed(4));

      const remainingKm = Math.round(totalDist * (1 - fraction));
      const hoursLeft = (remainingKm / 60).toFixed(1);
      const eta = progress === 100 ? 'Arrived' : `${hoursLeft}h (${remainingKm} km remaining)`;

      let checkpointName = `${originCity || 'Origin'} Checkpoint ${i}`;
      if (i === 0) checkpointName = `${originCity || 'Origin'} Logistics Hub`;
      else if (i === Math.floor(steps / 2)) checkpointName = `Interstate Highway Toll`;
      else if (i === steps) checkpointName = `${destCity || 'Destination'} Freight Terminal`;

      waypoints.push({
        city: checkpointName,
        lat,
        lng,
        eta,
        progress
      });
    }

    return waypoints;
  }

  async getLatestTracking(tripId) {
    return await Tracking.findOne({ trip: tripId }).sort({ timestamp: -1 });
  }

  async recordLocation(tripId, vehicleId, locationData) {
    return await Tracking.create({
      trip: tripId,
      vehicle: vehicleId,
      location: {
        lat: locationData.lat,
        lng: locationData.lng,
        city: locationData.city || ''
      },
      speed: locationData.speed || 60,
      heading: locationData.heading || 210,
      eta: locationData.eta || 'In Progress',
      progressPercent: locationData.progressPercent || 0
    });
  }
}

module.exports = new TrackingService();

