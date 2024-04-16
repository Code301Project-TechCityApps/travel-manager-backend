const axios = require('axios');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Set up MongoDB schema and model within the same service file
const translationCacheSchema = new mongoose.Schema({
    originalText: String,
    translatedText: String,
    fromLang: String,
    toLang: String,
    createdAt: { type: Date, default: Date.now, expires: '24h' }  // Documents will expire after 24 hours
});

const TranslationCache = mongoose.model('TranslationCache', translationCacheSchema);

const key = process.env.TRANSLATOR_KEY;
const endpoint = 'https://api.cognitive.microsofttranslator.com';
const location = 'centralus';


//https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es
async function translateText(text, fromLang, toLang) {
  // Check cache first
  const cachedTranslation = await TranslationCache.findOne({ originalText: text, fromLang, toLang });
  if (cachedTranslation) {
    return { translatedText: cachedTranslation.translatedText, fromCache: true };
  }

  // If not in cache, fetch from API
  try {
    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json'
      },
      params: {
        'api-version': '3.0',
        'from': fromLang,
        'to': toLang
      },
      data: [{ 'text': text }],
      responseType: 'json'
    });

    const translatedText = response.data[0].translations[0].text;
    // Cache the new translation
    await new TranslationCache({
      originalText: text,
      translatedText: translatedText,
      fromLang: fromLang,
      toLang: toLang
    }).save();

    return { translatedText, fromCache: false };
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

module.exports = { translateText };
