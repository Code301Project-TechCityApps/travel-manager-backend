const express = require('express');
const router = express.Router();
// const { submitFlightDetails } = require('../services/itineraryServices'); 
const Flight = require("../model")


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
    console.log("hello")
    const { airline,
        flightNum,
        departureAirport,
        arrivalAirport, } = req.body;

    if (!airline || !flightNum) {
        return res.status(400).json({ message: 'Title and status are required' });
    }

    const flight = new Flight({
        airline,
        flightNum,
        departureAirport,
        arrivalAirport,
    });

    const newFlight = await flight.save();
    res.status(201).json(newFlight);
}));

// Get a specific book by ID with error handling


module.exports = router
