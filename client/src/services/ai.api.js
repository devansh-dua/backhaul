import API from './api';

export const aiApi = {
  simulateWhatIf: (baseMetrics, params) => API.post('/ai/what-if', { baseMetrics, params }),
  optimizeMultiLoad: (vehicleId) => API.post('/ai/optimize-multiload', { vehicleId }),
  evaluateLoad: (vehicleId, shipmentId, detourKm) => API.post('/ai/evaluate-load', { vehicleId, shipmentId, detourKm }),
  getRadarData: () => API.get('/ai/radar'),
  getMarketIntelligence: () => API.get('/ai/market-intelligence'),
  reoptimize: (vehicleId) => API.post('/ai/reoptimize', { vehicleId }),
  
  // BACKTRACKING Multilingual Voice AI Copilot
  sendCopilotRequest: (payload) => API.post('/ai/copilot', payload),
  translateMessage: (text, targetRole, targetLanguage) => API.post('/ai/copilot/translate', { text, targetRole, targetLanguage }),
  getCopilotAnalytics: () => API.get('/ai/copilot/analytics')
};
