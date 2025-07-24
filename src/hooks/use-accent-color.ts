import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

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
    const parts = color.split(' ');
    if (parts.length === 3) {
      const h = parts[0];
      const s = parts[1];
      const l = parseInt(parts[2].replace('%', ''));
      
      // Set primary color
      root.style.setProperty("--primary", color);
      root.style.setProperty("--ring", color);
      
      // Create theme-aware accent color
      const accentL = Math.max(10, Math.min(90, l + 10));
      root.style.setProperty("--accent", `${h} ${s} ${accentL}%`);
      
      // Create muted accent for better contrast
      const mutedL = Math.max(5, Math.min(95, l - 20));
      root.style.setProperty("--muted", `${h} 30% ${mutedL}%`);
      
      // Adjust foreground colors for better contrast
      const foregroundL = l > 50 ? '10%' : '98%';
      root.style.setProperty("--primary-foreground", `${h} 0% ${foregroundL}`);
    }
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