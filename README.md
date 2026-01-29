# AlgoMRI - Code Analysis & Logic Visualization Platform

A futuristic React Native app that converts code into visual logic, dry runs, complexity analysis, and test cases.

## Features

1. **Code → Visual Logic**: Flowchart + Pseudocode + Step Summary
2. **Dry Run Visualizer**: Variable tracking with loop iteration tables
3. **Complexity Estimator**: Big-O (best/avg/worst) + nested loop warnings
4. **Edge Case Hints**: Null/empty, infinite loop, off-by-one warnings
5. **Test Case Generator**: 3-5 test cases (normal + edge)

## Setup

### 1. Install Dependencies

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure AI Model

Before running the app, you need to configure an AI model. Edit `src/services/aiService.ts`:

```typescript
import { setAIModel } from './src/services/aiService';
import { createOpenAI } from '@ai-sdk/openai'; // or any other provider

// Example with OpenAI
const openai = createOpenAI({
  apiKey: 'your-api-key-here'
});

setAIModel(openai('gpt-4'));
```

Or use any other Vercel AI SDK compatible provider:
- OpenAI
- Anthropic
- Google Gemini
- Mistral
- etc.

### 3. Run the App

```bash
# Start the development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web
npx expo start --web
```

## Project Structure

```
AlgoMRI/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── CodeEditor.tsx
│   │   ├── FlowchartViewer.tsx
│   │   ├── DryRunStepper.tsx
│   │   ├── ComplexityCard.tsx
│   │   ├── TestCaseCard.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GlowButton.tsx
│   │   └── Header.tsx
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # Business logic
│   │   ├── aiService.ts   # AI integration
│   │   └── storageService.ts  # Offline storage
│   ├── context/           # React context
│   │   └── ThemeContext.tsx
│   └── constants/         # App constants
│       └── themes.ts
├── assets/
│   └── mermaid_template.html
├── App.js                 # Main app entry
├── tailwind.config.js     # TailwindCSS config
├── global.css             # Global styles
└── metro.config.js        # Metro bundler config
```

## Features in Detail

### Offline Access
- Saves up to 50 most recent analyses
- Works completely offline after first analysis
- Search through saved history
- Swipe to delete individual items

### Flowchart Export
- Download as PNG to device gallery
- Share via system share sheet
- High-quality rendering

### Light/Dark Theme
- Auto-detects system preference
- Manual toggle in header
- Persists across app restarts
- Futuristic color scheme

## Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **Styling**: NativeWind 4 (TailwindCSS)
- **AI**: Vercel AI SDK
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Fonts**: Orbitron, Exo 2, Space Mono
- **Animations**: React Native Reanimated

## Configuration

### Theme Colors

Edit `src/constants/themes.ts` to customize colors:

```typescript
export const darkTheme = {
  background: '#0A0A0F',
  primary: '#00FFFF',    // Neon cyan
  secondary: '#8B5CF6',  // Purple
  // ...
};
```

### Storage Limit

Edit `src/services/storageService.ts`:

```typescript
const MAX_SAVED_ITEMS = 50; // Change this number
```

## Troubleshooting

### Fonts not loading
Clear cache and restart:
```bash
npx expo start -c
```

### NativeWind styles not applying
Rebuild the app:
```bash
npx expo start -c
```

### AI model not working
Make sure you've configured the model in `aiService.ts` using `setAIModel()`.

## License

MIT
