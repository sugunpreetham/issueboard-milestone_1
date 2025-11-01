import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'issueboard_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
