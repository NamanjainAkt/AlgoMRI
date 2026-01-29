/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        surface: {
          light: '#FAFAFA',
          dark: '#111111',
        },
        border: {
          light: '#EAEAEA',
          dark: '#333333',
        },
        primary: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        secondary: {
          light: '#666666',
          dark: '#888888',
        },
        accent: {
          blue: '#0070F3',
          purple: '#7928CA',
          pink: '#FF0080',
          orange: '#F5A623',
          cyan: '#50E3C2',
        },
        success: '#0070F3',
        warning: '#F5A623',
        error: '#EE0000',
      },
      fontFamily: {
        mono: ['SpaceMono_400Regular', 'SpaceMono_700Bold'],
      },
    },
  },
  plugins: [],
}

