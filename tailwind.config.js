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
        void: {
          DEFAULT: '#0A0A0F',
          light: '#1A1A2E',
        },
        surface: {
          dark: '#1A1A2E',
          light: '#FFFFFF',
        },
        neon: {
          cyan: '#00FFFF',
          purple: '#8B5CF6',
          pink: '#EC4899',
          blue: '#0EA5E9',
        },
        text: {
          dark: '#FFFFFF',
          light: '#1E293B',
          muted: {
            dark: '#9CA3AF',
            light: '#64748B',
          }
        },
        bg: {
          dark: '#0A0A0F',
          light: '#F8FAFC',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron_400Regular', 'Orbitron_700Bold', 'Orbitron_900Black'],
        exo: ['Exo2_400Regular', 'Exo2_600SemiBold', 'Exo2_700Bold'],
        mono: ['SpaceMono_400Regular', 'SpaceMono_700Bold'],
      },
    },
  },
  plugins: [],
}

