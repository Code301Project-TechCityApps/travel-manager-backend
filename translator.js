'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios').default;
const app = express();
app.use(cors());
app.use(express.json());
const TRANSLATOR_KEY = process.env.TRANSLATOR_KEY;
const PORT = process.env.PORT || 3000;

let key = TRANSLATOR_KEY;
let endpoint = "https://api.cognitive.microsofttranslator.com";
let location = "centralus";

async function translateText(text, targetLanguages) {
  console.log(text, targetLanguages)
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
                'from': 'en',  // Source language (English)
                'to': targetLanguages.join(',')  // Array of target languages passed dynamically
            },
            data: [{
                'text': text  // Text to be translated
            }],
            responseType: 'json'
        });
        console.log("Response:", response.data);
        console.log("Original Text:");
        console.log(text);
        console.log("\nTranslated Text:");
        // Iterate through each translation in the response and log the translated text
        let translations = response.data.map(translation => {
          return {
              language: translation.to,
              translatedText: translation.translations[0].text
          };
        });
        return translations;
    } catch (error) {
        console.error('Error:', error);
    }
}
 async function translateAndPrint() {
  const text = "Hello, how are you?";
  const targetLanguages = ['fr', 'es', 'de']; // Target languages (French, Spanish, German)
  try {
      const translations = await translateText(text, targetLanguages);
      console.log("The translations", translations);
      // translations.forEach(translation => {
      //     console.log(`${translation.language}: ${translation.translatedText}`);
      // });
    
  } catch (error) {
    console.log("There is an error in the translate and print function");
      // console.error('Translation Error:', error);
  }
}
app.listen(PORT, () => console.log(`listening on ${PORT}`));

translateAndPrint();


