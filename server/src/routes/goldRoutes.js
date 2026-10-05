const express = require('express');
const router = express.Router();
const goldService = require('../services/goldService');

/**
 * GET /api/gold
 * Returns Indian gold rates from API Mitra for the requested city.
 * Defaults to Hyderabad.
 */
router.get('/', (req, res, next) => {
  try {
    const city = req.query.city || 'India';
    const data = goldService.getRates(city);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/gold/history
 * Returns historical snapshots from API Mitra for the specified city.
 */
router.get('/history', (req, res, next) => {
  try {
    const city = req.query.city || 'India';
    const history = goldService.getHistory(city);
    res.status(200).json({
      success: true,
      source: 'API Mitra',
      city,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/gold/cities
 * Returns list of supported Indian cities from API Mitra.
 */
router.get('/cities', (req, res) => {
  res.status(200).json({
    success: true,
    source: 'API Mitra',
    defaultCity: 'Hyderabad',
    cities: goldService.availableCities
  });
});

/**
 * POST /api/gold/refresh
 * Triggers manual refresh against API Mitra commodities API.
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const data = await goldService.manualRefresh();
    res.status(200).json({
      success: true,
      message: 'API Mitra commodities rates refreshed.',
      data
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
