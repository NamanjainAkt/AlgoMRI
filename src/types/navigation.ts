import type { AnalysisResult } from '../services/storageService';

export type RootStackParamList = {
    Tabs: undefined;
    Result: {
        result: AnalysisResult;
        code: string;
    };
};

export type TabParamList = {
    HomeTab: undefined;
    HistoryTab: undefined;
    SettingsTab: undefined;
};
