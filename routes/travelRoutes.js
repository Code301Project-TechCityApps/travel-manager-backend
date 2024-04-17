/* eslint-disable indent */
'use strict';

const express = require('express');
const router = express.Router();
const transportationService = require('../services/travelService');

// Route to handle transportation data request
router.get('/traveldata', async (req, res) => {
  const { lat, lng, name } = req.query;
  // console.log('lat', lat);
  try {
    const transportationData = await transportationService.fetchTransportationData(lat, lng, name);
    // console.log('response', transportationData);
    res.json(transportationData);
  } catch (error) {
    console.error('Error fetching transportation:', error);
    res.status(500).json({ error: 'Error fetching transportation' });
  }
});

module.exports = router;
