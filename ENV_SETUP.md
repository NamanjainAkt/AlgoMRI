# Environment Variables Guide

## How to Use Environment Variables in AlgoMRI

### Quick Setup

1. **Create `.env` file** in the project root (same folder as `App.js`):

```env
EXPO_PUBLIC_OPENROUTER_KEY=your-api-key-here
```

2. **Restart Expo with cache clear**:

```bash
npx expo start -c
```

The `-c` flag clears the cache so environment variables are loaded.

## Important: EXPO_PUBLIC_ Prefix

In Expo, environment variables **must** start with `EXPO_PUBLIC_` to be accessible in your app.

### ✅ Correct:
```env
EXPO_PUBLIC_OPENROUTER_KEY=sk-or-v1-abc123
```

### ❌ Wrong:
```env
OPENROUTER_KEY=sk-or-v1-abc123
OPENROUTER_API_KEY=sk-or-v1-abc123
```

## How It Works

In `App.js`, the code reads the environment variable:

```javascript
const openrouter = createOpenRouter({
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_KEY || 'sk-or-v1-free-trial-key',
});
```

- If `.env` exists with your key → Uses your key
- If no `.env` file → Uses free trial key (default)

## Getting Your API Key

1. Go to https://openrouter.ai
2. Sign up for free
3. Go to "Keys" in dashboard
4. Create new key
5. Copy and paste into `.env` file

## Do You Need an API Key?

**No!** The app works perfectly with the free tier:

- ✅ Uses `sk-or-v1-free-trial-key` by default
- ✅ Access to free models like DeepSeek R1
- ✅ Generous rate limits
- ✅ No credit card required

**When to add your own key:**
- You want higher rate limits
- You want to use paid models
- You want usage analytics in your OpenRouter dashboard

## Example .env File

```env
# OpenRouter API Key (Optional)
# Get your key from: https://openrouter.ai/keys
EXPO_PUBLIC_OPENROUTER_KEY=sk-or-v1-your-actual-key-here

# You can add other environment variables here too
# EXPO_PUBLIC_ANOTHER_VAR=value
```

## Security Notes

1. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Keep your key private**
   - Don't share in screenshots
   - Don't paste in public forums

3. **Rotate keys if exposed**
   - Delete old key in OpenRouter dashboard
   - Generate new key
   - Update `.env` file

## Troubleshooting

### Environment variable not working?

1. **Check the prefix**: Must be `EXPO_PUBLIC_`
2. **Restart with cache clear**: `npx expo start -c`
3. **Check file location**: `.env` must be in project root
4. **Check file name**: Exactly `.env` (not `.env.txt`)

### Still using free tier after adding key?

- Restart the dev server: `Ctrl+C` then `npx expo start -c`
- Check the key is correct (no extra spaces)
- Verify key is active in OpenRouter dashboard

## Testing

To verify your environment variable is loaded:

Add this temporarily to `App.js` after line 30:

```javascript
console.log('API Key:', process.env.EXPO_PUBLIC_OPENROUTER_KEY ? 'Custom key loaded' : 'Using free tier');
```

Check the console output when the app starts.

## Summary

- ✅ **Prefix required**: `EXPO_PUBLIC_OPENROUTER_KEY`
- ✅ **File location**: Project root (same as `App.js`)
- ✅ **Restart needed**: `npx expo start -c`
- ✅ **Optional**: App works without it using free tier
