import { AnalysisResult, FlowchartNode, FlowchartEdge } from './storageService';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

const ANALYSIS_PROMPT = `You are an expert code analyzer. Analyze the provided code.
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

STRICT RULES:
1. Node IDs must be simple strings (e.g., "1", "2", "3").
2. Types must be either "rect" or "diamond".
3. Edge sources and targets must match the Node IDs exactly.
4. Always include a start node and end/return node.
5. Keep labels short (3-5 words) for display clarity.

Code to analyze:`;

const mapGeminiNodeType = (type: string): FlowchartNode['type'] => {
    const normalized = type?.toLowerCase();
    if (normalized === 'diamond') return 'decision';
    return 'process';
};

const transformFlowchart = (flowchart: {
    nodes?: Array<{ id: string; label: string; type?: string }>;
    edges?: Array<{ source: string; target: string; label?: string }>;
}): { nodes: FlowchartNode[]; edges: FlowchartEdge[] } => {
    const nodes: FlowchartNode[] = (flowchart?.nodes || []).map((node, index) => {
        const nodeType = mapGeminiNodeType(node.type);
        let finalType: FlowchartNode['type'] = 'process';
        
        const labelLower = node.label?.toLowerCase() || '';
        if (labelLower.includes('start') || labelLower.includes('begin')) {
            finalType = 'start';
        } else if (labelLower.includes('end') || labelLower.includes('finish') || labelLower.includes('done')) {
            finalType = 'end';
        } else if (labelLower.includes('return') || labelLower.includes('output')) {
            finalType = 'return';
        } else if (labelLower.includes('input') || labelLower.includes('print') || labelLower.includes('read') || labelLower.includes('display')) {
            finalType = 'io';
        } else if (labelLower.includes('for') || labelLower.includes('while') || labelLower.includes('loop')) {
            finalType = 'loop';
        } else if (nodeType === 'decision') {
            finalType = 'decision';
        }
        
        return {
            id: node.id || `N${index + 1}`,
            label: node.label || 'Unknown',
            type: finalType,
        };
    });
    
    const edges: FlowchartEdge[] = (flowchart?.edges || []).map(edge => ({
        from: edge.source,
        to: edge.target,
        label: edge.label,
    }));
    
    return { nodes, edges };
};

export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
    console.log('🚀 EXECUTING AI_ANALYZER (GEMINI NATIVE JSON)');

    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${ANALYSIS_PROMPT}\n\n${code}` }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    responseMimeType: "application/json",
                }
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', errorData);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        console.log('✅ AI Response received natively as JSON.');

        const result = JSON.parse(text);
        
        const { nodes, edges } = transformFlowchart(result.flowchart || {});

        return {
            title: result.title || 'Analysis Result',
            flowchartNodes: nodes,
            flowchartEdges: edges,
            pseudocode: result.pseudocode || [],
            summary: result.summary || [],
            dryRun: result.dryRun || [],
            complexity: result.complexity || {
                time: { best: 'N/A', avg: 'N/A', worst: 'N/A' },
                space: 'N/A',
                warnings: [],
            },
            edgeCases: result.edgeCases || [],
            testCases: result.testCases || [],
        };

    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error('❌ Error in analyzeCode:', error);

        const isTimeout = error.name === 'AbortError' || error.message?.includes('aborted');
        const errorMessage = isTimeout
            ? 'Analysis timed out (60s).'
            : 'An error occurred during AI analysis.';

        return {
            title: 'Analysis Error',
            flowchartNodes: [
                { id: 'N1', label: 'Start', type: 'start' },
                { id: 'N2', label: 'Error', type: 'process' },
            ],
            flowchartEdges: [
                { from: 'N1', to: 'N2' },
            ],
            pseudocode: [errorMessage],
            summary: ['Failed to parse AI response.', `Details: ${error.message}`],
            dryRun: [],
            complexity: {
                time: { best: 'N/A', avg: 'N/A', worst: 'N/A' },
                space: 'N/A',
                warnings: ['Analysis Failed'],
            },
            edgeCases: [],
            testCases: [],
        };
    }
};
