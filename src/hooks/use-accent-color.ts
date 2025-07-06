import { useState, useEffect } from 'react';

const DEFAULT_COLOR = "35 100% 65%";

export const useAccentColor = () => {
  const [accentColor, setAccentColor] = useState("");

  useEffect(() => {
    // Get the saved color from localStorage or use the default
    const savedColor = localStorage.getItem("primary-color");
    if (savedColor) {
      setAccentColor(savedColor);
      applyAccentColor(savedColor);
    } else {
      setAccentColor(DEFAULT_COLOR);
      applyAccentColor(DEFAULT_COLOR);
    }
  }, []);

  const applyAccentColor = (color: string) => {
    const root = document.documentElement;
    root.style.setProperty("--primary", color);
    root.style.setProperty("--ring", color);
    root.style.setProperty("--accent", color.replace(/\d+%$/, "75%"));
  };

  const updateAccentColor = (newColor: string) => {
    setAccentColor(newColor);
    applyAccentColor(newColor);
    localStorage.setItem("primary-color", newColor);
  };

  const resetAccentColor = () => {
    localStorage.removeItem("primary-color");
    setAccentColor(DEFAULT_COLOR);
    applyAccentColor(DEFAULT_COLOR);
  };

  return {
    accentColor,
    updateAccentColor,
    resetAccentColor,
  };
};