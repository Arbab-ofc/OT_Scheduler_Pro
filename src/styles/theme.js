import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" },
  h3: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.015em" },
  h4: { fontSize: "1.25rem", fontWeight: 600 }
};

export const buildTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#2563eb" : "#3b82f6"
      },
      secondary: {
        main: mode === "light" ? "#7c3aed" : "#8b5cf6"
      },
      background: {
        default: mode === "light" ? "#f8fafc" : "#0f172a",
        paper: mode === "light" ? "#ffffff" : "#1e293b"
      },
      text: {
        primary: mode === "light" ? "#1e293b" : "#f1f5f9",
        secondary: mode === "light" ? "#64748b" : "#94a3b8"
      },
      error: { main: mode === "light" ? "#ef4444" : "#f87171" },
      warning: { main: mode === "light" ? "#f59e0b" : "#fbbf24" },
      success: { main: mode === "light" ? "#10b981" : "#34d399" },
      divider: mode === "light" ? "#e2e8f0" : "#334155"
    },
    shape: { borderRadius: 8 },
    typography: baseTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            fontWeight: 600
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "medium"
        }
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: "none"
          }
        }
      }
    }
  });
