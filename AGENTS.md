# AlgoMRI - Agent Instructions

React Native + Expo app for AI-powered code analysis with visual flowcharts.

## Build/Run Commands

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator/device
npm run ios            # Run on iOS simulator/device (macOS only)
npm run web            # Run in web browser

# Build (see eas.json for EAS build profiles)
npx eas build --platform android --profile preview
```

## Tech Stack

- **Framework**: React Native 0.74.5 + Expo SDK 51
- **Language**: TypeScript 5.3.3
- **Styling**: NativeWind (Tailwind CSS) + StyleSheet
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Animation**: React Native Reanimated 3
- **UI**: Custom glassmorphism components, @expo/vector-icons
- **Storage**: @react-native-async-storage/async-storage

## Code Style

### Formatting
- 4 spaces indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 (soft)

### Imports
```typescript
// 1. React imports
import React from 'react';
import { useState } from 'react';

// 2. React Native imports
import { View, Text, StyleSheet } from 'react-native';

// 3. Third-party libraries
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

// 4. Local imports (absolute from src/)
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import type { RootStackParamList } from '../types/navigation';
```

### Naming Conventions
- Components: PascalCase (e.g., `GlassCard.tsx`)
- Functions/Variables: camelCase (e.g., `handleAnalyze`)
- Constants: UPPER_SNAKE_CASE for true constants (e.g., `API_URL`)
- Types/Interfaces: PascalCase with descriptive names
- Files: Match default export name (e.g., `HomeScreen.tsx` exports `HomeScreen`)
- Hooks: Prefix with `use` (e.g., `useTheme()`)

### Component Structure
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ComponentNameProps {
    title: string;
    onPress?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
    title,
    onPress,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
    },
});
```

### TypeScript Guidelines
- Always define prop interfaces for components
- Use `type` for unions/aliases, `interface` for object shapes
- Prefer explicit return types on exported functions
- Use `React.ReactNode` for children types
- Navigation types defined in `src/types/navigation.ts`

### Error Handling
```typescript
try {
    const result = await analyzeCode(code);
    navigation.navigate('Result', { result });
} catch (error) {
    console.error('Analysis error:', error);
    Alert.alert('Error', 'Failed to analyze code. Please try again.');
} finally {
    setIsLoading(false);
}
```

### Theme Usage
Always use the theme context for colors:
```typescript
const { theme, isDark, toggleTheme } = useTheme();
// Access: theme.background, theme.text, theme.primary, etc.
```

### Animation Pattern
```typescript
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

<Animated.View entering={FadeInUp.duration(400).delay(200)}>
    {children}
</Animated.View>
```

### File Organization
```
src/
  components/     # Reusable UI components
  screens/        # Screen components (use Screen suffix)
  context/        # React Context providers
  services/       # API and storage services
  types/          # TypeScript type definitions
  constants/      # Constants (themes, config)
  hooks/          # Custom React hooks
  utils/          # Utility functions
```

### API Keys & Environment
- Use `process.env.EXPO_PUBLIC_*` for public env vars
- Never commit API keys to git
- Check `.env.example` for required variables

### Testing
No test framework configured yet. When adding tests:
- Use Jest (comes with Expo)
- Place tests next to source files: `Component.test.tsx`
- Run single test: `npm test -- Component.test.tsx`

### Important Notes
- Flowchart logic uses Dagre for layout
- AI analysis via Gemini API (native JSON mode)
- Supports dark/light theme switching
- Uses React Native Gesture Handler for gestures
