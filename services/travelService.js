'use strict';

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const TRANSPORTATION_KEY = process.env.TRANSPORTATION_KEY;

const transportationSchema = new mongoose.Schema({
  name: String,
  time: String,
  category: String
});

const Transportation = mongoose.model('Transportation', transportationSchema);

//https://transit.hereapi.com/v8/departures?in=41.90123,12.50091&name=termini&apiKey=tmvCe75EErD9HjBIUgDRviLVEbjIGst7K7tqllPkc6Q
// Function to fetch transportation data asynchronously
const fetchTransportationData = async (lat, lng, name) => {
  const response = await axios.get('https://transit.hereapi.com/v8/departures', {
    params: {
      in: `${lat},${lng}`,
      name: name,
      apiKey: TRANSPORTATION_KEY
    }
  });
  console.log('response', response.data.boards[0].place.name);
  await Promise.all(response.data.boards.map(async cityDeparture => {
    const newTransportation = new Transportation({
      time: cityDeparture.departures[0].time,
      name: cityDeparture.place.name,
      category: cityDeparture.departures[0].transport.category
    });
    console.log(newTransportation);
    await newTransportation.save();
    return newTransportation;
  }));

  return response.data;
};
module.exports = {
  fetchTransportationData
};
