// Flowssom Settings Store
// All user preferences persisted to AsyncStorage

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../constants/themes';
import { FloatingElementConfig, defaultFloatingElementConfig } from '../constants/environments';
import { TimerDurations, defaultDurations } from '../constants/durations';

interface SettingsState {
  // Appearance
  themeMode: ThemeMode;
  
  // Timer defaults
  durations: TimerDurations;
  
  // Atmosphere
  selectedSoundId: string | null;
  soundVolume: number; // 0-1
  selectedBackgroundId: string | null;
  customBackgroundUri: string | null;
  floatingElements: FloatingElementConfig;
  
  // Break preferences
  preferredBreakTechnique: string;
  autoStartBreak: boolean;
  autoStartNextSession: boolean;
  
  // Notifications
  sessionEndNotification: boolean;
  breakEndNotification: boolean;
  
  // Focus mode
  keepScreenAwake: boolean;
  requestDND: boolean;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setDurations: (durations: TimerDurations) => void;
  setSelectedSound: (soundId: string | null) => void;
  setSoundVolume: (volume: number) => void;
  setSelectedBackground: (backgroundId: string | null) => void;
  setCustomBackground: (uri: string | null) => void;
  setFloatingElements: (config: FloatingElementConfig) => void;
  setPreferredBreakTechnique: (techniqueId: string) => void;
  setAutoStartBreak: (enabled: boolean) => void;
  setAutoStartNextSession: (enabled: boolean) => void;
  setSessionEndNotification: (enabled: boolean) => void;
  setBreakEndNotification: (enabled: boolean) => void;
  setKeepScreenAwake: (enabled: boolean) => void;
  setRequestDND: (enabled: boolean) => void;
  resetAllSettings: () => void;
}

const STORAGE_KEY = '@flowssom_settings';

export const useSettingsStore = create<SettingsState>((set) => ({
  // Defaults
  themeMode: 'dark',
  durations: { ...defaultDurations },
  selectedSoundId: null,
  soundVolume: 0.7,
  selectedBackgroundId: 'deep-space',
  customBackgroundUri: null,
  floatingElements: { ...defaultFloatingElementConfig },
  preferredBreakTechnique: 'box-breathing',
  autoStartBreak: false,
  autoStartNextSession: false,
  sessionEndNotification: true,
  breakEndNotification: true,
  keepScreenAwake: true,
  requestDND: false,

  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
  },

  setDurations: (durations: TimerDurations) => {
    set({ durations });
  },

  setSelectedSound: (soundId: string | null) => {
    set({ selectedSoundId: soundId });
  },

  setSoundVolume: (volume: number) => {
    set({ soundVolume: Math.max(0, Math.min(1, volume)) });
  },

  setSelectedBackground: (backgroundId: string | null) => {
    set({ selectedBackgroundId: backgroundId });
  },

  setCustomBackground: (uri: string | null) => {
    set({ customBackgroundUri: uri });
  },

  setFloatingElements: (config: FloatingElementConfig) => {
    set({ floatingElements: config });
  },

  setPreferredBreakTechnique: (techniqueId: string) => {
    set({ preferredBreakTechnique: techniqueId });
  },

  setAutoStartBreak: (enabled: boolean) => {
    set({ autoStartBreak: enabled });
  },

  setAutoStartNextSession: (enabled: boolean) => {
    set({ autoStartNextSession: enabled });
  },

  setSessionEndNotification: (enabled: boolean) => {
    set({ sessionEndNotification: enabled });
  },

  setBreakEndNotification: (enabled: boolean) => {
    set({ breakEndNotification: enabled });
  },

  setKeepScreenAwake: (enabled: boolean) => {
    set({ keepScreenAwake: enabled });
  },

  setRequestDND: (enabled: boolean) => {
    set({ requestDND: enabled });
  },

  resetAllSettings: () => {
    set({
      themeMode: 'dark',
      durations: { ...defaultDurations },
      selectedSoundId: null,
      soundVolume: 0.7,
      selectedBackgroundId: 'deep-space',
      customBackgroundUri: null,
      floatingElements: { ...defaultFloatingElementConfig },
      preferredBreakTechnique: 'box-breathing',
      autoStartBreak: false,
      autoStartNextSession: false,
      sessionEndNotification: true,
      breakEndNotification: true,
      keepScreenAwake: true,
      requestDND: false,
    });
  },
}));

// Persistence functions
export const saveSettings = async () => {
  const state = useSettingsStore.getState();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadSettings = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      useSettingsStore.setState(parsed);
      return true;
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return false;
};

// Auto-save on changes (debounced in production)
useSettingsStore.subscribe((state) => {
  saveSettings().catch(console.error);
});

export default useSettingsStore;
