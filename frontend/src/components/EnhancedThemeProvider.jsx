import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Enhanced Theme System with multiple theme options
 */

// Theme definitions
const THEMES = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#a78bfa',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      info: '#22d3ee',
      background: '#111827',
      surface: '#1f2937',
      text: '#f3f4f6',
      textSecondary: '#d1d5db',
      border: '#374151',
    },
  },
  auto: {
    name: 'Auto (System)',
    colors: null, // Uses system preference
  },
};

// High contrast theme for accessibility
const HIGH_CONTRAST = {
  name: 'High Contrast',
  colors: {
    primary: '#0000ff',
    secondary: '#ff0000',
    success: '#008000',
    error: '#ff0000',
    warning: '#000000',
    info: '#0000ff',
    background: '#ffffff',
    surface: '#000000',
    text: '#000000',
    textSecondary: '#000000',
    border: '#000000',
  },
};

const EnhancedThemeContext = createContext();

export const EnhancedThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('auto');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // small, normal, large
  const [colorScheme, setColorScheme] = useState('auto'); // auto, light, dark
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedContrast = localStorage.getItem('highContrast');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedColorScheme = localStorage.getItem('colorScheme');

    if (savedTheme) setTheme(savedTheme);
    if (savedContrast) setHighContrast(JSON.parse(savedContrast));
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedColorScheme) setColorScheme(savedColorScheme);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply color scheme
    let isDark = colorScheme === 'dark';
    if (colorScheme === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    root.style.setProperty('--font-size-scale', {
      small: '0.875',
      normal: '1',
      large: '1.25',
    }[fontSize]);

    // Apply reduce motion
    if (reduceMotion) {
      root.style.setProperty('--motion-safe', '0s');
    } else {
      root.style.setProperty('--motion-safe', '0.3s');
    }

    // Save preferences
    localStorage.setItem('highContrast', JSON.stringify(highContrast));
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme, highContrast, fontSize, reduceMotion]);

  // Listen to system color scheme changes
  useEffect(() => {
    if (colorScheme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // Trigger re-render by updating a state (theme auto-updates based on system)
      setTheme((t) => t);
    };

    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [colorScheme]);

  // Detect system reduce-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (e) => setReduceMotion(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  const cycleFontSize = useCallback(() => {
    setFontSize((prev) => {
      if (prev === 'small') return 'normal';
      if (prev === 'normal') return 'large';
      return 'small';
    });
  }, []);

  const currentTheme =
    colorScheme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.dark
        : THEMES.light
      : THEMES[colorScheme];

  const value = {
    theme: currentTheme,
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    cycleFontSize,
    reduceMotion,
    setReduceMotion,
    isDark: document.documentElement.classList.contains('dark'),
  };

  return (
    <EnhancedThemeContext.Provider value={value}>
      {children}
    </EnhancedThemeContext.Provider>
  );
};

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within EnhancedThemeProvider');
  }
  return context;
};
