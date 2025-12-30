import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("ot-theme") || "light");

  useEffect(() => {
    document.body.classList.toggle("dark", mode === "dark");
    localStorage.setItem("ot-theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () => setMode(prev => (prev === "light" ? "dark" : "light"))
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{typeof children === "function" ? children({ mode }) : children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
