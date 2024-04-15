'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URL)

app.get('/test', (request, response) => {
  response.send('test request received')
})


app.listen(PORT, () => console.log(`listening on ${PORT}`));
