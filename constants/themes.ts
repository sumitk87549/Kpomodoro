// Flowssom Theme System
// Every color is chosen to evoke calm, focus, and warmth

export type ThemeMode = 'dark' | 'light';

export interface ColorPalette {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundOverlay: string;
  
  // Surfaces
  surface: string;
  surfaceElevated: string;
  glass: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Accents
  accent: string;
  accentMuted: string;
  accentWarm: string;
  accentCool: string;
  
  // States
  success: string;
  warning: string;
  error: string;
  
  // Timer specific
  timerRing: string;
  timerRingBackground: string;
  timerText: string;
  
  // Floating elements
  bubble: string;
  particle: string;
  aurora: string[];
}

export const darkTheme: ColorPalette = {
  // Deep, calming backgrounds - like a quiet room at night
  background: '#0d0d14',
  backgroundSecondary: '#1a1a2e',
  backgroundOverlay: 'rgba(0, 0, 0, 0.35)',
  
  // Subtle surfaces
  surface: '#161622',
  surfaceElevated: '#1f1f30',
  glass: 'rgba(31, 31, 48, 0.7)',
  
  // Gentle, readable text
  textPrimary: '#f0f0f5',
  textSecondary: '#b8b8c8',
  textTertiary: '#7a7a8c',
  
  // Calming accents
  accent: '#7c9dbf',      // Soft blue - focus
  accentMuted: '#5a7a9a', // Muted blue
  accentWarm: '#d4a574',  // Warm amber - rest
  accentCool: '#7da5a5',  // Cool teal - calm
  
  // Status colors (muted, not alarming)
  success: '#7db89a',
  warning: '#d4c074',
  error: '#bf7d7d',
  
  // Timer ring
  timerRing: '#7c9dbf',
  timerRingBackground: 'rgba(124, 157, 191, 0.15)',
  timerText: '#ffffff',
  
  // Floating elements
  bubble: 'rgba(124, 157, 191, 0.3)',
  particle: 'rgba(255, 255, 255, 0.15)',
  aurora: ['#7c9dbf', '#7da5a5', '#9d7dbf', '#bf7d9d'],
};

export const lightTheme: ColorPalette = {
  // Soft, warm backgrounds - like morning light
  background: '#f5f5f0',
  backgroundSecondary: '#e8e8e3',
  backgroundOverlay: 'rgba(255, 255, 255, 0.35)',
  
  // Clean surfaces
  surface: '#ffffff',
  surfaceElevated: '#fafaf8',
  glass: 'rgba(255, 255, 255, 0.7)',
  
  // Comfortable text
  textPrimary: '#2d2d3a',
  textSecondary: '#5a5a6e',
  textTertiary: '#8a8a9e',
  
  // Soothing accents
  accent: '#5a7a9a',      // Deeper blue - focus
  accentMuted: '#7a9aba', // Soft blue
  accentWarm: '#c49564',  // Warm amber - rest
  accentCool: '#6a9595',  // Cool teal - calm
  
  // Status colors (gentle)
  success: '#6a9a8a',
  warning: '#c4b064',
  error: '#af6d6d',
  
  // Timer ring
  timerRing: '#5a7a9a',
  timerRingBackground: 'rgba(90, 122, 154, 0.15)',
  timerText: '#2d2d3a',
  
  // Floating elements
  bubble: 'rgba(90, 122, 154, 0.3)',
  particle: 'rgba(90, 122, 154, 0.2)',
  aurora: ['#5a7a9a', '#6a9595', '#8a7a9a', '#9a7a8a'],
};

export interface TypographyScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  timer: number;
}

export const typography: TypographyScale = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  timer: 48,
};

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export interface BorderRadiusScale {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export const borderRadius: BorderRadiusScale = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const getTheme = (mode: ThemeMode): { colors: ColorPalette; typography: TypographyScale; spacing: SpacingScale; borderRadius: BorderRadiusScale } => ({
  colors: mode === 'dark' ? darkTheme : lightTheme,
  typography,
  spacing,
  borderRadius,
});

export default {
  darkTheme,
  lightTheme,
  typography,
  spacing,
  borderRadius,
  getTheme,
};
