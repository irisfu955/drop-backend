import { Configuration, OpenAIApi } from "openai"; 

const ApiError = require('../utils/ApiError');
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const endpointUrl = 'https://api.openai.com//v1/chat/completions';

/**
 * This function sends a request to Open AI language model
 * to generate a response to a given prompt (the input question).
 *
 * @param {String} documentText The question to generate a response for.
 * @returns {Promise<Object>} The response from the Open AI API.
 * @throws {Error} If there's an error during the API call.
 */
async function generateExplanation(documentText) {
   
    // Define the request data. The prompt is the input question.
    const requestBody = {
        "model": "gpt-3.5-turbo",
        "message": [{
            "role": "user",
            "content": documentText
        }]
    };
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
  
    // Send the request and return the response.
    try {
        const response = await axios.post(endpointUrl, requestBody, {headers: requestHeaders});
        return response.data.choices[0].message.content;
    } catch (error) {
        throw new ApiError(`Error during Open AI API call: ${error}`);
    }
  }
module.exports = {
    generateExplanation,
}
  