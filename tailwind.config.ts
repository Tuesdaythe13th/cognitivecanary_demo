import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'sans-serif'],
        serif: ['"Newsreader"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
        display: ['"Newsreader"', 'serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "hsl(var(--input))",
        ring: "#D4F268",
        background: "#0C0A09",
        foreground: "#E7E5E4",
        "stone-black": "#0C0A09",
        "acid-lime": "#D4F268",
        "warm-charcoal": "#1C1917",
        "stone-white": "#E7E5E4",
        primary: {
          DEFAULT: "#D4F268",
          foreground: "#0C0A09",
        },
        secondary: {
          DEFAULT: "#1C1917",
          foreground: "#E7E5E4",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgba(231, 229, 228, 0.6)",
          foreground: "rgba(231, 229, 228, 0.4)",
        },
        accent: {
          DEFAULT: "#D4F268",
          foreground: "#0C0A09",
        },
        popover: {
          DEFAULT: "#1C1917",
          foreground: "#E7E5E4",
        },
        card: {
          DEFAULT: "#1C1917",
          foreground: "#E7E5E4",
        },
      },
      borderRadius: {
        lg: "24px",
        md: "12px",
        sm: "8px",
        full: "9999px",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(200%)", opacity: "0" },
        },
        "bar-grow": {
          from: { width: "0%" },
          to: { width: "var(--bar-width, 100%)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.6" },
          "97%": { opacity: "1" },
        },
        "grid-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
        "tape-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "typewriter-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "data-flow": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(10px)", opacity: "0" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--target-width)" },
        },
        "ring-fill": {
          from: { strokeDashoffset: "var(--circumference)" },
          to: { strokeDashoffset: "var(--target-offset)" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scan-line": "scan-line 3s ease-in-out infinite",
        "bar-grow": "bar-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        "flicker": "flicker 8s ease-in-out infinite",
        "grid-drift": "grid-drift 20s linear infinite",
        "tape-scroll": "tape-scroll 20s linear infinite",
        "typewriter-cursor": "typewriter-cursor 1s step-end infinite",
        "data-flow": "data-flow 2s ease-in-out infinite",
        "progress-fill": "progress-fill 1.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "ring-fill": "ring-fill 1.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "reveal-up": "reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "reveal-left": "reveal-left 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
