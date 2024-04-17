'use strict';

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const TRANSPORTATION_KEY = process.env.TRANSPORTATION_KEY;

const transportationSchema = new mongoose.Schema({
  name: String,
  type: String,
  location: String
});

const Transportation = mongoose.model('Transportation', transportationSchema);

// Function to fetch transportation data asynchronously
const fetchTransportationData = async (lat, lng, name) => {
  const response = await axios.get('https://transit.hereapi.com/v8/stations', {
    params: {
      in: `${lat},${lng}`,
      name: name,
      apiKey: TRANSPORTATION_KEY
    }
  });
  await Promise.all(response.data.stations.map(async station => {
    const newTransportation = new Transportation({
      name: station.place.name,
      type: station.place.type,
      location: station.location
    });
    await newTransportation.save();
    return newTransportation;
  }));

  return response.data;
};
module.exports = {
  fetchTransportationData
};
