import API from './api';

export const aiApi = {
  simulateWhatIf: (baseMetrics, params) => API.post('/ai/what-if', { baseMetrics, params }),
  optimizeMultiLoad: (vehicleId) => API.post('/ai/optimize-multiload', { vehicleId }),
  evaluateLoad: (vehicleId, shipmentId, detourKm) => API.post('/ai/evaluate-load', { vehicleId, shipmentId, detourKm }),
  getRadarData: () => API.get('/ai/radar'),
  getMarketIntelligence: () => API.get('/ai/market-intelligence'),
  reoptimize: (vehicleId) => API.post('/ai/reoptimize', { vehicleId })
};
