export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  borderRadius: number;
  customColors?: {
    background: string;
    text: string;
    border: string;
  };
}

export interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  toggleTheme: () => void;
}