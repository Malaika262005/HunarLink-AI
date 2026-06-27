"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});
const THEMES = ["light", "dark", "brand"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // page load pe saved theme lagao
  useEffect(() => {
    const saved = localStorage.getItem("hunarlink-theme");
    const initial = THEMES.includes(saved) ? saved : "light";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  const applyTheme = (t) => {
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(t);
  };

  const changeTheme = (t) => {
    if (!THEMES.includes(t)) return;
    applyTheme(t);
    setTheme(t);
    localStorage.setItem("hunarlink-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);