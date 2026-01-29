import { generateText } from 'ai';
import { AnalysisResult } from './storageService';

// Model will be configured later by user
let aiModel: any = null;

export const setAIModel = (model: any) => {
    aiModel = model;
};

const ANALYSIS_PROMPT = `You are an expert code analyzer. Analyze the following code.
Your response must contain two distinct sections:

1. A JSON block for the structured data.
2. A separate FLOWCHART block for the Mermaid.js syntax.

Example Format:
[JSON]
{
  "title": "Algorithm Name",
  "pseudocode": ["line 1", "line 2"],
  "summary": ["step 1", "step 2"],
  "dryRun": [{"step": 1, "line": "code", "variables": {}, "description": "desc"}],
  "complexity": {"time": {"best": "O(1)", "avg": "O(1)", "worst": "O(1)"}, "space": "O(1)", "warnings": []},
  "edgeCases": ["case"],
  "testCases": [{"input": "in", "expectedOutput": "out", "isEdgeCase": false}]
}
[/JSON]

[FLOWCHART]
graph TD
    A["Start"] --> B["Process"]
    B --> C{"End?"}
[/FLOWCHART]

STRICT MERMAID RULES (CRITICAL):
- Start with "graph TD"
- Use ONLY generic alphanumeric Node IDs: N1, N2, N3... (Do NOT use A, B, or descriptive IDs).
- Use double quotes for EVERY label: N1["Start"]
- ESCAPE internal double quotes with backslash: N1["Print \"Hello\""]
- Use ONLY two shapes: Rectangles N1["Step"] and Diamonds N2{"Condition?"}.
- DO NOT use cylinder [()], circle (()), or asymmetric shapes >].
- If the code line is complex, simplify the label text.
- Do not use brackets [] or {} inside the label text unless deeply careful.

Code to analyze:`;

export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
    console.log('🚀 FORCING NEW BUNDLE: EXECUTING AI_ANALYZER V4 (STRICT MERMAID)');

    if (!aiModel) {
        throw new Error('AI model not configured.');
    }

    try {
        const { text } = await generateText({
            model: aiModel,
            prompt: `${ANALYSIS_PROMPT}\n\n${code}`,
            temperature: 0.1,
        });

        console.log('✅ AI Response received and extraction starting...');

        // Extract JSON section
        const jsonMatch = text.match(/\[JSON\]([\s\S]*?)\[\/JSON\]/);
        // Extract Flowchart section
        const flowchartMatch = text.match(/\[FLOWCHART\]([\s\S]*?)\[\/FLOWCHART\]/);

        if (!jsonMatch) {
            console.error('Raw AI text failed JSON search:', text);
            throw new Error('Could not find [JSON] section in AI response');
        }

        const jsonData = JSON.parse(jsonMatch[1].trim());
        let flowchartData = flowchartMatch ? flowchartMatch[1].trim() : 'graph TD\n  A["No Flowchart Generated"]';

        // Sanitize flowchart - remove markdown tags if any
        flowchartData = flowchartData.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();

        const result: AnalysisResult = {
            ...jsonData,
            flowchart: flowchartData
        };

        return result;
    } catch (error) {
        console.error('❌ Error in aiAnalyzer:', error);

        // Fallback Result
        return {
            title: 'Analysis Error',
            flowchart: 'graph TD\n  A["Error Analyzing Code"] --> B["Logic Error"]',
            pseudocode: ['An error occurred during AI analysis.'],
            summary: ['Failed to parse AI response.'],
            dryRun: [],
            complexity: {
                time: { best: 'N/A', avg: 'N/A', worst: 'N/A' },
                space: 'N/A',
                warnings: ['Extraction failed'],
            },
            edgeCases: [],
            testCases: [],
        };
    }
};
