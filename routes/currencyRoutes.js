const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../services/currencyService');

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

router.get('/latest', async (req, res) => {
    console.log('request.query', req.query);
    try {
      const { base, symbols } = req.query; // Expecting 'symbols' as a comma-separated string
      const symbolArray = symbols.split(','); // Convert symbols string back to array
      const result = await getLatestRates(base, symbolArray);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;