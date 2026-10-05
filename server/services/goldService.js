const API_URL = process.env.APIMITRA_API_URL || 'https://api.apimitra.in/commodities';
const goldService = require('../src/services/goldService');

/**
 * Fetch commodities from API Mitra
 * Direct implementation of Section 3 in user request
 */
async function getGoldRates() {
  const headers = {};
  const apiKey = (process.env.APIMITRA_API_KEY || '').trim();
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const response = await fetch(API_URL, { headers });

  if (!response.ok) {
    throw new Error(`API Mitra request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

module.exports = {
  getGoldRates,
  getRates: (city) => goldService.getRates(city),
  getHistory: (city) => goldService.getHistory(city),
  manualRefresh: () => goldService.manualRefresh()
};
