// Comprehensive Coordinates dictionary for Indian Interstate Logistics Corridors
const CITY_COORDS = {
  // Delhi - Jaipur Corridor (NH 48)
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Manesar': { lat: 28.3516, lng: 76.9366 },
  'Bhiwadi': { lat: 28.2096, lng: 76.8335 },
  'Neemrana': { lat: 27.9890, lng: 76.3813 },
  'Kotputli': { lat: 27.7028, lng: 76.2008 },
  'Shahpura': { lat: 27.3871, lng: 75.9615 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },

  // Mumbai - Chennai / Pune Corridor (NH 48 / NH 65)
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Navi Mumbai': { lat: 19.0330, lng: 73.0297 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Satara': { lat: 17.6805, lng: 74.0183 },
  'Kolhapur': { lat: 16.7050, lng: 74.2433 },
  'Belgaum': { lat: 15.8497, lng: 74.4977 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hosur': { lat: 12.7409, lng: 77.8253 },
  'Vellore': { lat: 12.9165, lng: 79.1325 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },

  // North - East / Central Corridors
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 }
};

class RouteService {
  getCoords(cityName) {
    if (!cityName) return { lat: 28.6139, lng: 77.2090 };
    const key = Object.keys(CITY_COORDS).find(c => c.toLowerCase() === cityName.toLowerCase().trim());
    if (key) return CITY_COORDS[key];

    // Fallback hash for unlisted cities in India to ensure graceful coordinates
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    const latOffset = (Math.abs(hash) % 100) / 50;
    const lngOffset = (Math.abs(hash >> 3) % 100) / 50;
    return { lat: 20.5937 + latOffset, lng: 78.9629 + lngOffset };
  }

  // Haversine distance calculation in km
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Calculate detour for picking up load at pickupCity and dropping at dropCity along main vehicle corridor
  calculateDetour(mainOrigin, mainDest, pickupCity, dropCity) {
    const cOrigin = this.getCoords(mainOrigin);
    const cDest = this.getCoords(mainDest);
    const cPickup = this.getCoords(pickupCity);
    const cDrop = this.getCoords(dropCity);

    const directDist = this.calculateDistance(cOrigin.lat, cOrigin.lng, cDest.lat, cDest.lng);
    const detourDist = 
      this.calculateDistance(cOrigin.lat, cOrigin.lng, cPickup.lat, cPickup.lng) +
      this.calculateDistance(cPickup.lat, cPickup.lng, cDrop.lat, cDrop.lng) +
      this.calculateDistance(cDrop.lat, cDrop.lng, cDest.lat, cDest.lng);

    const netDetour = Math.max(0, detourDist - directDist);
    return Math.round(netDetour * 0.45); // Highway corridor efficiency discount
  }

  isRouteCompatible(mainOrigin, mainDest, pickupCity, dropCity) {
    const detour = this.calculateDetour(mainOrigin, mainDest, pickupCity, dropCity);
    return detour <= 120; // Allowable detour threshold for interstate backhaul
  }
}

module.exports = new RouteService();
