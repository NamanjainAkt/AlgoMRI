# OpenRouter Configuration Guide

## ✅ Already Configured!

AlgoMRI is pre-configured to use **OpenRouter** with the **DeepSeek R1** free model.

## How It Works

### Free Tier (Default)
The app uses OpenRouter's free tier by default:
- **Model**: `deepseek/deepseek-r1-0528:free`
- **API Key**: Uses free trial key automatically
- **Cost**: $0 (completely free!)

### Get Your Own API Key (Optional)

If you want to use your own OpenRouter account:

1. **Sign up at OpenRouter**:
   - Go to https://openrouter.ai
   - Create a free account
   - Get your API key from the dashboard

2. **Add your API key**:
   
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_OPENROUTER_KEY=your-api-key-here
   ```

3. **Restart the app**:
   ```bash
   npx expo start -c
   ```
   
   The `-c` flag clears the cache so the new environment variable is loaded.

## Available Free Models

You can change the model in `App.js` (line 34):

```javascript
// Current (Recommended)
setAIModel(openrouter('deepseek/deepseek-r1-0528:free'));

// Other free options:
setAIModel(openrouter('tngtech/deepseek-r1t2-chimera:free'));
setAIModel(openrouter('z-ai/glm-4.5-air:free'));
setAIModel(openrouter('moonshotai/kimi-k2:free'));
setAIModel(openrouter('openai/gpt-oss-120b:free'));
```

## Why DeepSeek R1?

- ✅ **Best reasoning capabilities** for code analysis
- ✅ **Structured JSON output** (perfect for our use case)
- ✅ **Completely free** on OpenRouter
- ✅ **No rate limits** on free tier
- ✅ **High quality** code understanding

## Testing

Run the app and try analyzing this code:

```javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

You should get:
- ✅ Flowchart
- ✅ Pseudocode
- ✅ Dry run with variable tracking
- ✅ Complexity analysis (O(n²))
- ✅ Test cases

## Troubleshooting

### "AI model not configured" error
- The model is configured in `App.js`
- Make sure the import is working: `import { setAIModel } from './src/services/aiService';`

### Rate limit errors
- Free tier has generous limits
- If you hit limits, wait a few minutes or use your own API key

### Model not responding
- Check internet connection
- Try a different free model from the list above
- OpenRouter free tier requires internet access

## Need Help?

- OpenRouter Docs: https://openrouter.ai/docs
- DeepSeek R1 Info: https://openrouter.ai/models/deepseek/deepseek-r1-0528
