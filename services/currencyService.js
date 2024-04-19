const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');


const API_KEY = process.env.CURRENCY_API; 
const BASE_URL = 'https://api.currencybeacon.com/v1';

const CurrencyConversionSchema = new mongoose.Schema({
    from: String,
    to: [String],
    amount: Number,
    result: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now, expires: 86400 }  // 86400 seconds = 24 hours
  });
  
  const CurrencyConversion = mongoose.model('CurrencyConversion', CurrencyConversionSchema);
  

async function convertCurrency(from, to, amount) {
    console.log('from, to, amount', from, to, amount);
  try {
    const response = await axios.get(`${BASE_URL}/convert?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`, {
    });
    // store to mongoDB, erase after 24 hours
    const newConversion = new CurrencyConversion({
        from, to, amount, result: response.data
    });
    await newConversion.save();
    return response.data;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

async function getLatestRates(base, symbols) {
    try {
        console.log('getLatestRates called with base:', base, 'and symbols:', symbols);  // Verify input to function
        
        const response = await axios.get(`${BASE_URL}/latest?api_key=${API_KEY}&base=${base}&symbols=${symbols}`);
        console.log('API Response:', response.data);  // Logs the API response data

        // Store in mongoDB
        const symbolArray = symbols.split(',');
        const newRate = new CurrencyConversion({
            from: base, 
            to: symbolArray,
            result: response.data
        });
        await newRate.save();

        return response.data;
    } catch (error) {
        console.error('Error fetching latest currency rates:', error);
        throw error;
    }
}

// http://localhost:3000/api/clear-conversions
async function clearCurrencyConversions() {
    try {
      await CurrencyConversion.deleteMany({});
      console.log('All currency conversions have been deleted.');
    } catch (error) {
      console.error('Failed to delete currency conversions:', error);
      throw error;  // Re-throw the error for further handling if needed
    }
  }
// exports
module.exports = {
  convertCurrency,
  getLatestRates,
  clearCurrencyConversions
};