import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "background": "#0F0F13",
        "surface": "#131317",
        "surface-dim": "#131317",
        "surface-container-lowest": "#0e0e12",
        "surface-container-low": "#1b1b1f",
        "surface-container": "#1f1f23",
        "surface-container-high": "#2a292e",
        "surface-container-highest": "#353439",
        "surface-bright": "#39393d",
        "primary": "#c4c0ff",
        "primary-container": "#8781ff",
        "on-primary": "#2000a4",
        "on-primary-container": "#1b0091",
        "secondary": "#41eec2",
        "secondary-container": "#00d1a7",
        "on-secondary": "#00382b",
        "tertiary": "#0be298",
        "on-tertiary": "#003823",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "outline": "#918fa1",
        "outline-variant": "#464555",
        "on-surface": "#e4e1e7",
        "on-surface-variant": "#c7c4d8",
        "on-background": "#e4e1e7",
        "inverse-primary": "#4f44e2",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        "display-sm": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "numeral-lg": ["28px", { lineHeight: "32px", fontWeight: "700" }],
        "headline": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "title": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 8px rgba(196,192,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(196,192,255,0.6)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        shake: 'shake 0.4s ease-in-out',
        confetti: 'confetti 0.8s ease-out forwards',
        glowPulse: 'glowPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
