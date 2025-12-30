import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider as OTThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { buildTheme } from "./styles/theme";
import "./styles/globals.css";
import "./styles/animations.css";

const Root = () => {
  return (
    <React.StrictMode>
      <OTThemeProvider>
        {({ mode }) => (
          <ThemeProvider theme={buildTheme(mode)}>
            <CssBaseline />
            <AuthProvider>
              <UserProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <App />
                </BrowserRouter>
              </UserProvider>
            </AuthProvider>
          </ThemeProvider>
        )}
      </OTThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
