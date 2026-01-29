export const darkTheme = {
    background: '#0A0A0F',
    surface: '#1A1A2E',
    primary: '#00FFFF',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    text: '#FFFFFF',
    textMuted: '#9CA3AF',
    border: 'rgba(0, 255, 255, 0.2)',
    cardBg: 'rgba(26, 26, 46, 0.6)',
};

export const lightTheme = {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#0EA5E9',
    secondary: '#7C3AED',
    accent: '#EC4899',
    text: '#1E293B',
    textMuted: '#64748B',
    border: 'rgba(14, 165, 233, 0.2)',
    cardBg: 'rgba(255, 255, 255, 0.8)',
};

export type Theme = typeof darkTheme;
