const express = require('express');
const { translateText } = require('../services/translateServices');
const router = express.Router();

router.post('/translate', async (req, res) => {
  const { text, toLang } = req.query;
  // const { fromLang } = req.query || null;
  // console.log('text, toLang', text, toLang);
  if (!text || !toLang) {
    return res.status(400).send({ error: 'Missing text or language information.' });
  }

  try {
    const { translatedText, fromCache } = await translateText(text, toLang);
    res.send({ translatedText, fromCache });
  } catch (error) {
    res.status(500).send({ error: 'Failed to process translation.', details: error.message });
  }
});

module.exports = router;
