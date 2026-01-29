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

export type Theme = typeof darkTheme;
