const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: {
        type: String,
        required: true,
    },
    flightNum: {
        type: String,
        required: false,
    },
    departureAirport: {
        type: String,
        required: false,

    },

    arrivalAirport: {
        type: String,
        required: false,
    },
});

// Get a specific book by ID with error handling


module.exports =  mongoose.model('Flight', flightSchema);
