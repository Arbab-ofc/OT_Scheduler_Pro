/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#3b82f6"
        },
        secondary: {
          DEFAULT: "#7c3aed",
          dark: "#8b5cf6"
        },
        accent: {
          DEFAULT: "#10b981",
          dark: "#34d399"
        },
        surface: {
          light: "#ffffff",
          dark: "#1e293b"
        },
        background: {
          light: "#f8fafc",
          dark: "#0f172a"
        },
        text: {
          primary: {
            light: "#1e293b",
            dark: "#f1f5f9"
          },
          secondary: {
            light: "#64748b",
            dark: "#94a3b8"
          }
        },
        border: {
          light: "#e2e8f0",
          dark: "#334155"
        },
        error: "#ef4444",
        warning: "#f59e0b"
      },
      fontFamily: {
        inter: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1)",
        lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
        glow: "0 0 20px rgba(59,130,246,0.3)"
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
        xl: "16px"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 300ms ease-in-out",
        "slide-up": "slide-up 300ms ease-in-out"
      }
    }
  },
  plugins: []
};
