// AI Model Setup Guide
// Use this code to configure your AI model in App.js

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { setAIModel } from './src/services/aiAnalyzer';

// Get API key from environment
const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

if (apiKey) {
    const google = createGoogleGenerativeAI({
        apiKey: apiKey,
    });

    // Set the model
    setAIModel(google('gemini-2.5-flash'));
}
