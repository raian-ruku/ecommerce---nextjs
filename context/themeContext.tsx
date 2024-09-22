"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  background: string;
  primary: string;
  secondary: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  tempColor: string;
  setTempColor: (color: string) => void;
  font: string;
  setFont: (font: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
};

const defaultTheme: Theme = {
  background: "bg-white",
  primary: "text-blue-600",
  secondary: "text-gray-600",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        try {
          return JSON.parse(savedTheme);
        } catch (error) {
          console.error("Error parsing saved theme:", error);
          return defaultTheme;
        }
      }
    }
    return defaultTheme;
  });

  const [tempColor, setTempColor] = useState(theme.background);
  const [font, setFont] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("font") || "iosevka";
    }
    return "iosevka";
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isDarkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", JSON.stringify(theme));
      localStorage.setItem("font", font);
      localStorage.setItem("isDarkMode", isDarkMode.toString());
    }
  }, [theme, font, isDarkMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.backgroundColor = theme.background.replace("bg-", "");
      document.body.style.fontFamily = font;
      document.body.className = isDarkMode ? "dark" : "light";
    }
  }, [theme, font, isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        tempColor,
        setTempColor,
        font,
        setFont,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
