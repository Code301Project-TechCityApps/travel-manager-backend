const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.CURRENCY_API; 
const BASE_URL = 'https://api.currencybeacon.com/v1';


async function convertCurrency(from, to, amount) {
    console.log('from, to, amount', from, to, amount);
  try {
    const response = await axios.get(`${BASE_URL}/convert?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`, {
    });
    return response.data;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

async function getLatestRates(base, symbols) {
    try {
      const response = await axios.get(`${BASE_URL}/latest?api_key=${API_KEY}&base=${base}&symbols=${symbols}`, {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching latest currency rates:', error);
      throw error;
    }
  }
  
module.exports = {
  convertCurrency,
  getLatestRates
};