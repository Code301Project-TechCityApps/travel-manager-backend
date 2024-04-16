const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../services/currencyService');
const { getLatestRates } = require('../services/currencyService');
const { clearCurrencyConversions } = require('../services/currencyService');

// Custom amount conversion rate
router.post('/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    console.log('from, to, amount', from, to, amount);
    const result = await convertCurrency(from, to, amount);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Latest 1 to 1 conversion rate 
router.get('/latest', async (req, res) => {
  try {
    const { base } = req.query;
    let { symbols } = req.query;

    console.log('Received base', base);
    console.log('Received symbols', symbols);


    if (!symbols) {
      symbols = "";
    }

    const formattedSymbols = symbols.split(',')
                                    .map(symbol => symbol.trim())
                                    .join(',');
    console.log('Formatted symbols:', formattedSymbols); 

    const result = await getLatestRates(base, formattedSymbols);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Clear database manually
router.delete('/clear-conversions', async (req, res) => {
  try {
    await clearCurrencyConversions();
    res.status(200).send('All currency conversions have been successfully deleted.');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
  
module.exports = router;