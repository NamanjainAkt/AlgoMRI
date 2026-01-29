# Troubleshooting AI & Flowchart Errors

If you are still seeing `TypeError` (zod) or `SyntaxError` (JSON) after the latest updates, your app is likely running a **cached version** of the old code.

Follow these steps to force a refresh:

## 1. Clear the Expo Cache
Stop your terminal (Ctrl+C) and run:
```bash
npx expo start --clear
```

## 2. Clear your Mobile Device
Even if you clear the terminal, your phone/emulator might cache the JS bundle.
1. Force close the **Expo Go** app.
2. Long-press the `AlgoMRI` project in the Expo Go list.
3. Select **"Clear cache"** or **"Forget project"**.
4. Open the project again.

## 3. Verify the Update
When you click **"Analyze Code"**, check your terminal logs. You MUST see this line:
`LOG 🚀 FORCING NEW BUNDLE: EXECUTING AI_ANALYZER V3`

### If you see "V3":
✅ You are running the newest code.
✅ JSON errors are fixed by our new `[JSON]` / `[FLOWCHART]` tag system.
✅ Zod errors are fixed (the code no longer uses Zod).

### If you DO NOT see "V3":
❌ You are still running old code from the cache.
❌ Please repeat steps 1 and 2 until the "V3" log appears.

## Key Changes
- **New File**: `src/services/aiAnalyzer.ts` (Renamed from `aiService.ts`)
- **Extraction Method**: Tag-based. We no longer put Mermaid code inside JSON.
- **Model**: `gemini-2.5-flash`
