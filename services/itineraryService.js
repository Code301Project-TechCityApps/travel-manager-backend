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

// This checks if the model already exists and avoids recompilation
const Flight = mongoose.models.Flight || mongoose.model('Flight', flightSchema);

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

const getAllFlights = async () => {
  try {
    const flights = await Flight.find();
    return flights;
  } catch (error) {
    console.error('Error getting all flights:', error);
    throw error;
  }
};

const getFlightById = async (flightID) => {
  try { 
    const flight = await Flight.findById(flightID);
    if (!flight) {
      throw new Error('Flight not found.');
    }
    return flight;
  } catch (error) {
    console.error('Error fetching flight by ID:', error);
    throw error;
  }
};

async function clearSavedFlightDetails() {
  try {
    await Flight.deleteMany({});
    console.log('All flight details have been deleted.');
  } catch (error) {
    console.error('Failed to delete flight details:', error);
    throw error;  // Re-throw the error for further handling if needed
  }
}

module.exports = {
  submitFlightDetails,
  getAllFlights,
  getFlightById, 
  clearSavedFlightDetails
};
