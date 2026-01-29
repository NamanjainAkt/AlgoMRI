import { AnalysisResult } from './storageService';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const MODEL_NAME = 'tngtech/deepseek-r1t2-chimera:free';

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
    N1["Start"] --> N2["Process"]
    N2 --> N3{"End?"}
[/FLOWCHART]

STRICT MERMAID RULES (CRITICAL):
- Start with "graph TD"
- Use ONLY generic alphanumeric Node IDs: N1, N2, N3...
- Use double quotes for EVERY label: N1["Start"]
- ESCAPE internal double quotes with backslash: N1["Print \"Hello\""]
- Use ONLY two shapes: Rectangles N1["Step"] and Diamonds N2{"Condition?"}.
- DO NOT use cylinder [()], circle (()), or asymmetric shapes >].
- If the code line is complex, simplify the label text.
- Do not use brackets [] or {} inside the label text unless deeply careful.

Code to analyze:`;

export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
    console.log('🚀 EXECUTING AI_ANALYZER V5 (OPENROUTER/DEEPSEEK)');

    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured.');
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://algomri.ai', // Optional but good practice
                'X-Title': 'AlgoMRI',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        role: 'user',
                        content: `${ANALYSIS_PROMPT}\n\n${code}`,
                    },
                ],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenRouter API Error:', errorData);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || '';

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
        let flowchartData = flowchartMatch ? flowchartMatch[1].trim() : 'graph TD\n  N1["No Flowchart Generated"]';

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
            flowchart: 'graph TD\n  N1["Error Analyzing Code"] --> N2["Logic Error"]',
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
