import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1'
});

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available Gemini Models:');
    models.forEach(m => console.log(m.name, '-', m.description));
  } catch (err) {
    console.error('Error listing models:', err);
  }
}

listModels();
