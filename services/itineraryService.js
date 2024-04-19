'use strict';

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  departureAirport: String,
  arrivalAirport: String,
  departureDate: Date,
  returnDate: Date
});

const Flight = mongoose.model('Flight', flightSchema);

// Function to submit flight details
const submitFlightDetails = async (flightDetails) => {
  try {
    // Create a new Flight document
    const newFlight = new Flight(flightDetails);
    
    // Save the new flight document to the database
    await newFlight.save();
    
    // Return the newly created flight document
    return newFlight;
  } catch (error) {
    console.error('Error submitting flight details:', error);
    throw error; // Re-throw the error for handling in the caller
  }
};

module.exports = {
  submitFlightDetails
};