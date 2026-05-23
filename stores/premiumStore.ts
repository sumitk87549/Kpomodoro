// Flowssom Premium Store
// Dormant premium feature flags - ready for activation at 1k users

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PremiumSource = 'none' | 'subscription' | 'lifetime' | 'promotional';

interface PremiumState {
  isPremium: boolean;
  premiumSource: PremiumSource;
  
  // Feature flags (all false until activated)
  hasBinauralBeats: boolean;
  hasVoiceGuide: boolean;
  hasCustomVideoBackgrounds: boolean;
  hasAnnualSummary: boolean;
  hasAdvancedFloatingElements: boolean;
  hasDataExport: boolean;
  
  // Actions
  checkPremiumStatus: () => Promise<void>;
  setPremium: (source: PremiumSource) => void;
  clearPremium: () => void;
}

const STORAGE_KEY = '@flowssom_premium';

// Configuration flag - change to true at 1k users
export const SHOW_PREMIUM_UPSELL = false;

export const usePremiumStore = create<PremiumState>((set) => ({
  // All defaults are false/free
  isPremium: false,
  premiumSource: 'none',
  hasBinauralBeats: false,
  hasVoiceGuide: false,
  hasCustomVideoBackgrounds: false,
  hasAnnualSummary: false,
  hasAdvancedFloatingElements: false,
  hasDataExport: false,

  checkPremiumStatus: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        set(parsed);
      }
    } catch (e) {
      console.error('Failed to check premium status:', e);
    }
  },

  setPremium: (source: PremiumSource) => {
    const state = {
      isPremium: true,
      premiumSource: source,
      hasBinauralBeats: true,
      hasVoiceGuide: true,
      hasCustomVideoBackgrounds: true,
      hasAnnualSummary: true,
      hasAdvancedFloatingElements: true,
      hasDataExport: true,
    };
    
    set(state);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(console.error);
  },

  clearPremium: () => {
    const state = {
      isPremium: false,
      premiumSource: 'none',
      hasBinauralBeats: false,
      hasVoiceGuide: false,
      hasCustomVideoBackgrounds: false,
      hasAnnualSummary: false,
      hasAdvancedFloatingElements: false,
      hasDataExport: false,
    };
    
    set(state);
    AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
  },
}));

// Auto-load on module init
usePremiumStore.getState().checkPremiumStatus();

export default usePremiumStore;
