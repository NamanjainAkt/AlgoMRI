# AlgoMRI - Product Requirements Document (PRD)

## 1. Executive Summary

**AlgoMRI** is a futuristic React Native mobile application that converts programming code into visual logic representations, including flowcharts, pseudocode, dry-run visualizations, complexity analysis, and test cases.

**Target Users:**
- Students learning algorithms and data structures
- Developers reviewing code logic
- Technical interviewers preparing for coding challenges
- Educators teaching programming concepts

---

## 2. Core Features

### 2.1 Code → Visual Logic
- **Flowchart Generation**: Visual diagram showing program logic flow with decision diamonds, process rectangles, and start/end ovals
- **Pseudocode Extraction**: Human-readable code representation
- **Step-by-step Summary**: Brief explanation of each logic step

### 2.2 Dry Run Visualizer
- Step-by-step execution tracking
- Variable state table showing value changes at each step
- Loop iteration visualization with iteration counter
- Description for each execution step

### 2.3 Complexity Estimator
- Time Complexity: Best, Average, Worst case (Big-O notation)
- Space Complexity analysis
- Nested loop warnings detection

### 2.4 Edge Case & Bug Hints
- Null/empty input warnings
- Infinite loop detection
- Off-by-one error hints
- Other common bug patterns

### 2.5 Test Case Generator
- Generates 3-5 test cases per analysis
- Mix of normal and edge cases
- Input → Expected output format
- Marked edge cases with flag

---

## 3. Additional Features

### 3.1 Offline Access
- Saves up to 50 recent analyses locally using AsyncStorage
- Works completely offline after first analysis
- Search through saved history by title or code content
- Swipe to delete individual items
- Auto-pruning of oldest items when limit reached

### 3.2 Flowchart Export
- Download as PNG to device gallery
- Share via system share sheet
- High-quality SVG rendering
- Zoom and pan gestures for navigation

### 3.3 Theme System
- Dark mode (default): Minimal dark theme on black background
- Light mode: Clean light theme on white background
- Auto-detects system preference on first launch
- Manual toggle in Settings screen
- Persists across app restarts via AsyncStorage

### 3.4 AI Integration
- Uses Google Gemini (gemini-2.5-flash) by default
- Single AI call returns all 5 analysis types for efficiency
- Configurable via environment variables
- 60-second timeout for analysis requests
- Fallback error display on failure

---

## 4. User Flows

### 4.1 Main Analysis Flow
1. User opens app → Home Screen
2. User pastes code into CodeEditor component
3. User taps "Analyze Code" button (GlowButton)
4. Loading indicator displays while AI processes code
5. App sends code to Gemini API for analysis
6. App navigates to Result Screen with 5 tabs:
   - **Flowchart**: Visual diagram of code logic
   - **Pseudocode**: Human-readable code
   - **Dry Run**: Step-by-step execution with variables
   - **Complexity**: Big-O analysis with warnings
   - **Tests**: Generated test cases
7. Analysis automatically saved to history

### 4.2 History Flow
1. User navigates to History tab
2. User sees list of past analyses (newest first)
3. User can search by title or code content
4. User taps item to view full results
5. User can swipe left to delete items

### 4.3 Export Flow
1. User views flowchart in Result Screen
2. User taps download button in toolbar
3. App captures flowchart as PNG
4. User grants media library permission (first time)
5. Image saved to device gallery with success toast
6. Alternatively, tap share button to open system share sheet

### 4.4 Settings Flow
1. User navigates to Settings tab
2. User can toggle Dark/Light mode
3. User can view storage usage
4. User can clear all history with confirmation
5. User can view app version and info

---

## 5. Screen Structure

| Screen | Purpose | Key Components |
|--------|---------|-----------------|
| **HomeScreen** | Code input + Analyze button | CodeEditor, GlowButton, GlassCard |
| **ResultScreen** | Tabbed results display | FlowchartViewer, DryRunStepper, ComplexityCard, TestCaseCard |
| **HistoryScreen** | Saved analyses list | SearchBar, FlatList, SwipeableRow |
| **SettingsScreen** | Theme & storage management | ToggleSwitch, GlowButton, InfoRows |

### Navigation Structure
```
NativeStackNavigator
├── TabNavigator (Bottom Tabs)
│   ├── HomeTab → HomeScreen
│   ├── HistoryTab → HistoryScreen
│   └── SettingsTab → SettingsScreen
└── ResultScreen (Stack Screen)
```

---

## 6. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React Native (Expo) | SDK 51 |
| Language | TypeScript | 5.3.3 |
| Styling | NativeWind (TailwindCSS) | 4.0.1 |
| AI | Google Gemini API | gemini-2.5-flash |
| Navigation | React Navigation | v6 |
| - Native Stack | @react-navigation/native-stack | 6.9.x |
| - Bottom Tabs | @react-navigation/bottom-tabs | 6.5.x |
| Storage | @react-native-async-storage | 1.23.1 |
| Animations | React Native Reanimated | 3.10.1 |
| Graphics | React Native SVG | 15.2.0 |
| Gestures | React Native Gesture Handler | 2.16.1 |
| Fonts | @expo-google-fonts | 0.4.2 |
| - Headers | Orbitron | - |
| - Body | Exo 2 | - |
| - Code | Space Mono | - |
| View Capture | react-native-view-shot | 3.8.0 |
| Media Library | expo-media-library | 16.0.5 |
| Sharing | expo-sharing | 12.0.1 |
| Linear Gradient | expo-linear-gradient | 13.0.2 |
| Blur | expo-blur | 13.0.3 |

---

## 7. UI/UX Design

### Color Palette

**Dark Theme:**
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#000000` | Screen backgrounds |
| Surface | `#111111` | Cards, headers |
| Primary | `#FFFFFF` | Main text |
| Secondary | `#888888` | Secondary text |
| Accent | `#0070F3` | Interactive elements |
| Text | `#EDEDED` | Body text |
| Text Muted | `#A1A1A1` | Placeholder, hints |
| Border | `#333333` | Dividers, borders |

**Light Theme:**
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#FFFFFF` | Screen backgrounds |
| Surface | `#FAFAFA` | Cards, headers |
| Primary | `#000000` | Main text |
| Secondary | `#666666` | Secondary text |
| Accent | `#0070F3` | Interactive elements |
| Text | `#000000` | Body text |
| Text Muted | `#666666` | Placeholder, hints |
| Border | `#EAEAEA` | Dividers, borders |

### Typography
| Element | Font | Weight | Size |
|---------|------|--------|------|
| App Title | Orbitron | 900 | 32px |
| Section Headers | Exo 2 | 700 | 18px |
| Body Text | Exo 2 | 400 | 14px |
| Code | Space Mono | 400 | 13px |
| Button Text | Exo 2 | 600 | 16px |

### Node Colors (Flowchart)
| Node Type | Dark BG | Dark Border | Light BG | Light Border |
|-----------|---------|-------------|----------|---------------|
| Start/End | `#6EE7B7` | `#34D399` | `#D1FAE5` | `#10B981` |
| Process | `#93C5FD` | `#60A5FA` | `#DBEAFE` | `#3B82F6` |
| Decision | `#FDBA74` | `#FB923C` | `#FFEDD5` | `#F97316` |
| I/O | `#C4B5FD` | `#A78BFA` | `#EDE9FE` | `#8B5CF6` |
| Loop | `#FDA4AF` | `#F472B6` | `#FFE4E6` | `#EC4899` |
| Return | `#FCA5A5` | `#F87171` | `#FEE2E2` | `#EF4444` |

### Component Style
- **Glassmorphism**: Cards with `rgba(17, 17, 17, 0.7)` background and blur effect
- **Glow Buttons**: Gradient background with animated press effect
- **Tab Bar**: Bottom tabs with active/inactive tint colors
- **Transitions**: Smooth screen transitions via React Navigation

---

## 8. Data Models

### FlowchartNode
```typescript
interface FlowchartNode {
    id: string;
    label: string;
    type: 'start' | 'end' | 'process' | 'decision' | 'io' | 'loop' | 'return';
}
```

### FlowchartEdge
```typescript
interface FlowchartEdge {
    from: string;
    to: string;
    label?: string;
}
```

### DryRunStep
```typescript
interface DryRunStep {
    step: number;
    line: string;
    variables: Record<string, any>;
    description: string;
}
```

### TestCase
```typescript
interface TestCase {
    input: string;
    expectedOutput: string;
    isEdgeCase: boolean;
}
```

### Complexity
```typescript
interface Complexity {
    time: { best: string; avg: string; worst: string };
    space: string;
    warnings: string[];
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
    title: string;
    flowchartNodes: FlowchartNode[];
    flowchartEdges: FlowchartEdge[];
    pseudocode: string[];
    summary: string[];
    dryRun: DryRunStep[];
    complexity: Complexity;
    edgeCases: string[];
    testCases: TestCase[];
}
```

### SavedAnalysis
```typescript
interface SavedAnalysis {
    id: string;
    timestamp: number;
    title: string;
    code: string;
    result: AnalysisResult;
}
```

---

## 9. API Integration

### Google Gemini API

**Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "contents": [{
    "parts": [{
      "text": "<prompt_with_code>"
    }]
  }],
  "generationConfig": {
    "temperature": 0.1,
    "responseMimeType": "application/json"
  }
}
```

**Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "<json_response>"
      }]
    }
  }]
}
```

### Environment Variables
| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini API key |

---

## 10. Non-Functional Requirements

### Performance
- Analysis timeout: 60 seconds
- Initial load: < 3 seconds
- Flowchart render: < 1 second

### Storage
- Maximum saved analyses: 50 (configurable)
- Auto-pruning when limit reached
- AsyncStorage for persistence

### Compatibility
- Minimum Android SDK: 24 (Android 7.0)
- iOS: 13.0+
- React Native: 0.74.5

### Accessibility
- Minimum touch target: 44x44 points
- Color contrast ratios meet WCAG AA
- Screen reader compatible labels

---

## 11. Project Structure

```
AlgoMRI/
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx          # Code input with syntax-friendly styling
│   │   ├── FlowchartViewer.tsx     # SVG flowchart with zoom/pan
│   │   ├── DryRunStepper.tsx       # Step navigation + variable table
│   │   ├── ComplexityCard.tsx      # Big-O badges + warnings
│   │   ├── TestCaseCard.tsx        # Test cases display
│   │   ├── GlassCard.tsx           # Glassmorphism wrapper
│   │   ├── GlowButton.tsx         # Animated gradient button
│   │   ├── Header.tsx              # App header with gradient
│   │   └── FlowchartViewer/
│   │       └── FlowchartViewer.tsx # Main viewer component
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Code input + Analyze
│   │   ├── ResultScreen.tsx        # Tabbed results view
│   │   ├── HistoryScreen.tsx       # Saved analyses
│   │   └── SettingsScreen.tsx       # Theme + storage
│   ├── services/
│   │   ├── aiAnalyzer.ts          # Gemini API integration
│   │   └── storageService.ts       # AsyncStorage wrapper
│   ├── context/
│   │   └── ThemeContext.tsx        # Theme management
│   ├── constants/
│   │   └── themes.ts               # Color definitions
│   ├── types/
│   │   └── navigation.ts           # TypeScript types
│   └── utils/
│       └── layoutEngine.ts         # Flowchart layout algorithm
├── assets/
│   └── (icons, splash, fonts)
├── App.js                          # Main entry + navigation
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel + Reanimated plugin
├── tailwind.config.js              # NativeWind configuration
├── global.css                      # Tailwind directives
├── package.json                    # Dependencies
└── .env                           # Environment variables
```

---

## 12. Error Handling

### AI Analysis Errors
- **Timeout (60s)**: Display "Analysis timed out" message
- **API Error**: Display error details with retry option
- **Parse Error**: Display "Failed to parse AI response" with details

### Storage Errors
- **Read Failure**: Return empty array, log error
- **Write Failure**: Throw error to caller
- **Permission Denied**: Prompt user to grant permissions

### Network Errors
- **No Connection**: Show offline message, allow cached results
- **Slow Connection**: Show loading indicator with timeout

---

## 13. Future Enhancements (Out of Scope)

- [ ] Multiple programming language support
- [ ] Code syntax highlighting
- [ ] Multiple AI model providers
- [ ] Export to PDF
- [ ] Collaborative features
- [ ] Code comparison side-by-side
- [ ] Algorithm library with common algorithms
- [ ] Video tutorial integration
- [ ] Dark/Light mode for flowcharts separately

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| App launches without crash | 99%+ |
| Analysis completes successfully | 95%+ |
| User satisfaction rating | 4.5+ stars |
| Average analysis time | < 30 seconds |
| Offline functionality usage | 40%+ of sessions |

---

## 15. Appendix

### A. Sample AI Prompt
```
You are an expert code analyzer. Analyze the provided code.
Your output must be a valid JSON object strictly matching this exact structure:
{
  "title": "Algorithm Name",
  "flowchart": {
    "nodes": [
      { "id": "1", "label": "Start Process", "type": "rect" },
      { "id": "2", "label": "Condition?", "type": "diamond" }
    ],
    "edges": [
      { "source": "1", "target": "2", "label": "Next" }
    ]
  },
  "pseudocode": ["line 1", "line 2"],
  "summary": ["step 1", "step 2"],
  "dryRun": [{"step": 1, "line": "code", "variables": {}, "description": "desc"}],
  "complexity": {"time": {"best": "O(1)", "avg": "O(1)", "worst": "O(1)"}, "space": "O(1)", "warnings": []},
  "edgeCases": ["case"],
  "testCases": [{"input": "in", "expectedOutput": "out", "isEdgeCase": false}]
}
```

### B. Theme Constants Reference
```typescript
// src/constants/themes.ts
export const darkTheme = {
    background: '#000000',
    surface: '#111111',
    primary: '#FFFFFF',
    secondary: '#888888',
    accent: '#0070F3',
    text: '#EDEDED',
    textMuted: '#A1A1A1',
    border: '#333333',
    cardBg: 'rgba(17, 17, 17, 0.7)',
};

export const lightTheme = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    primary: '#000000',
    secondary: '#666666',
    accent: '#0070F3',
    text: '#000000',
    textMuted: '#666666',
    border: '#EAEAEA',
    cardBg: 'rgba(255, 255, 255, 0.8)',
};
```

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Author:** AlgoMRI Development Team
