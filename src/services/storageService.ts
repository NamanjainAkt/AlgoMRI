import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FlowchartNode {
    id: string;
    label: string;
    type: 'start' | 'end' | 'process' | 'decision' | 'io' | 'loop' | 'return';
}

export interface FlowchartEdge {
    from: string;
    to: string;
    label?: string;
}

export interface DryRunStep {
    step: number;
    line: string;
    variables: Record<string, any>;
    description: string;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
    isEdgeCase: boolean;
}

export interface AnalysisResult {
    title: string;
    flowchartNodes: FlowchartNode[];
    flowchartEdges: FlowchartEdge[];
    pseudocode: string[];
    summary: string[];
    dryRun: DryRunStep[];
    complexity: {
        time: { best: string; avg: string; worst: string };
        space: string;
        warnings: string[];
    };
    edgeCases: string[];
    testCases: TestCase[];
}

export interface SavedAnalysis {
    id: string;
    timestamp: number;
    title: string;
    code: string;
    result: AnalysisResult;
}

const STORAGE_KEY = '@algomri_history';
const MAX_SAVED_ITEMS = 50;

export const storageService = {
    async saveAnalysis(code: string, result: AnalysisResult): Promise<void> {
        try {
            const history = await this.getHistory();

            const newAnalysis: SavedAnalysis = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                title: result.title,
                code,
                result,
            };

            // Add to beginning of array
            history.unshift(newAnalysis);

            // Limit to MAX_SAVED_ITEMS
            if (history.length > MAX_SAVED_ITEMS) {
                history.splice(MAX_SAVED_ITEMS);
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving analysis:', error);
            throw error;
        }
    },

    async getHistory(): Promise<SavedAnalysis[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting history:', error);
            return [];
        }
    },

    async deleteAnalysis(id: string): Promise<void> {
        try {
            const history = await this.getHistory();
            const filtered = history.filter(item => item.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error deleting analysis:', error);
            throw error;
        }
    },

    async clearHistory(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    },

    async searchHistory(query: string): Promise<SavedAnalysis[]> {
        try {
            const history = await this.getHistory();
            const lowerQuery = query.toLowerCase();
            return history.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.code.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Error searching history:', error);
            return [];
        }
    }
};
