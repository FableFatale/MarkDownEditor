import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeSettings, ThemeContextType, ThemeMode } from '../types/theme';

const defaultTheme: ThemeSettings = {
  mode: 'system',
  primaryColor: '#1976d2',
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  borderRadius: 4,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme.mode === 'system') {
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange();

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  useEffect(() => {
    localStorage.setItem('editorTheme', JSON.stringify(theme));
    document.documentElement.setAttribute('data-theme', 
      theme.mode === 'system' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : theme.mode
    );
  }, [theme]);

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};