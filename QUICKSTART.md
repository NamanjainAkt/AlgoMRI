# Quick Start Guide

## 🎉 AlgoMRI is Ready to Run!

The app is **pre-configured** with OpenRouter's free DeepSeek R1 model. Just run it!

## 🚀 Start the App (1 Command)

```bash
npx expo start
```

Then press:
- **'a'** for Android
- **'i'** for iOS  
- **'w'** for Web

## ✅ That's It!

The AI model is already configured and ready to use for **FREE**!

## 🧪 Test It Out

1. **Open the app**
2. **Paste this code**:

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

3. **Tap "Analyze Code"**
4. **View all 5 analysis types**:
   - 📊 Flowchart
   - 📝 Pseudocode  
   - 🔄 Dry Run
   - ⏱️ Complexity
   - 🧪 Test Cases

## 💡 Features to Try

- **Dark Mode**: Tap sun/moon icon in header
- **Save Analysis**: Automatically saved for offline access
- **Export Flowchart**: Tap download icon to save as PNG
- **Search History**: Find old analyses in History tab
- **Offline Mode**: All saved analyses work without internet

## 🆓 Free AI Model

- **Provider**: OpenRouter
- **Model**: DeepSeek R1 (Free)
- **Cost**: $0
- **Limits**: Generous free tier

Want to use your own API key? See `OPENROUTER_SETUP.md`

## 🐛 Troubleshooting

### Fonts not loading?
```bash
npx expo start -c
```

### Styles not applying?
```bash
npx expo start -c
```

### Need to change the AI model?
Edit `App.js` line 34 - see `OPENROUTER_SETUP.md` for options

## 📱 What You'll See

### Home Screen
- Futuristic glass-effect code editor
- "Analyze Code" button with neon glow
- Dark theme by default

### Result Screen  
- 5 tabs with all analysis types
- Smooth animations
- Export/share options

### History Screen
- All saved analyses (works offline)
- Search functionality
- Swipe to delete

### Settings Screen
- Theme toggle
- Clear history
- App info

## 🎨 UI Highlights

- **Glassmorphism** effects
- **Neon cyan/purple** gradients
- **Futuristic fonts** (Orbitron, Exo 2)
- **Smooth animations**
- **Responsive** on all devices

Enjoy using AlgoMRI! 🚀
