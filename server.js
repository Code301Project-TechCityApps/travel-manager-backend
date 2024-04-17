'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const currencyRoutes = require('./routes/currencyRoutes');
const translateRoutes = require('./routes/translateRoutes');
const travelRoutes = require('./routes/travelRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/test', (request, response) => {
  response.send('test request received')
})

app.use('/api/currency', currencyRoutes);
app.use('/api/translate', translateRoutes);

app.use('/api/transportation', travelRoutes);



app.listen(PORT, () => console.log(`listening on ${PORT}`));
