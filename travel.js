'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios').default;
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TRAVEL_KEY = process.env.TRAVEL_KEY;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const transportationSchema = new mongoose.Schema({
  type: String,
  location: String
});
const Transportation = mongoose.model('Transportation', transportationSchema);

app.get('/', (req, res) => {
  res.send('Welcome to the Travel App!');
});

app.get('/api/transportation', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/transportation', {
      params: {
        key: TRAVEL_KEY
      }
    });

    const transportation = new Transportation({
      type: response.data.type,
      location: response.data.location
    });
    await transportation.save();
    res.json(transportation);
  } catch (error) {
    console.error('Error fetching transportation:', error);
    res.status(500).json({ error: 'Error fetching transportation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


