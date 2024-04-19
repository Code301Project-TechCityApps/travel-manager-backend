const express = require('express');
const router = express.Router();
const Flight = require("../model");  
const { clearSavedFlightDetails } = require('../services/itineraryService');


// Middleware for error handling
const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

// Get all flights with error handling
router.get('/', asyncMiddleware(async (req, res) => {
    const flights = await Flight.find();
    res.status(200).json(flights);
}));

// Add a new flight with validation and error handling
router.post('/', asyncMiddleware(async (req, res) => {
    console.log("Received:", req.body); 
    const { airline, flightNumber, departureAirport, arrivalAirport, departureDate, returnDate } = req.body; 

    if (!airline || !flightNumber) {
        return res.status(400).json({ message: 'Airline and flight number are required' });
    }

    const flight = new Flight({
        airline,
        flightNumber, 
        departureAirport,
        arrivalAirport,
        departureDate, 
        returnDate
    });

    const newFlight = await flight.save();
    res.status(201).json(newFlight);
}));

// get all flights 
router.get('/', asyncMiddleware(async (req, res) => {
    const flights = await Flight.find();
    res.status(201).json(flights);
}));

// Specific flight by ID
router.get('/id', asyncMiddleware(async (req, res) =>  {
    const flight = await Flight.findById(req.params.flightNumber);
    if (!flight) {
        return res.status(404).json({ message: 'Cannot find flight number, please try again' });
    }
    res.status(200).json(flight);
}));

router.post('/clear-flight-details', async (req, res) => {
    try {
      await clearSavedFlightDetails();
      res.status(200).send('All flight details have been successfully deleted.');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Export the router
module.exports = router;
