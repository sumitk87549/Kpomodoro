// Flowssom Environment System
// Backgrounds, sounds, and floating element configurations

export type ElementType = 'bubbles' | 'particles' | 'aurora';

export interface FloatingElementConfig {
  type: ElementType;
  intensity: number; // 1-5
  speed: number; // 1-5
}

export interface SoundOption {
  id: string;
  name: string;
  category: 'nature' | 'ambient' | 'white-noise' | 'binaural';
  duration: number; // in seconds for looping reference
  isPremium: boolean;
}

export interface BackgroundOption {
  id: string;
  name: string;
  type: 'built-in' | 'custom';
  source?: any; // Image source or URI
  colors: string[]; // Dominant colors for UI adaptation
  isPremium: boolean;
}

export const soundOptions: SoundOption[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'nature',
    duration: 30,
    isPremium: false,
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    category: 'nature',
    duration: 45,
    isPremium: false,
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    category: 'nature',
    duration: 20,
    isPremium: false,
  },
  {
    id: 'wind',
    name: 'Soft Wind',
    category: 'nature',
    duration: 35,
    isPremium: false,
  },
  {
    id: 'cafe',
    name: 'Distant Cafe',
    category: 'ambient',
    duration: 60,
    isPremium: false,
  },
  {
    id: 'fireplace',
    name: 'Crackling Fire',
    category: 'nature',
    duration: 40,
    isPremium: false,
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'white-noise',
    duration: 30,
    isPremium: false,
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    category: 'white-noise',
    duration: 30,
    isPremium: false,
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    category: 'white-noise',
    duration: 30,
    isPremium: false,
  },
  // Premium binaural beats
  {
    id: 'alpha-10hz',
    name: 'Alpha Focus (10Hz)',
    category: 'binaural',
    duration: 60,
    isPremium: true,
  },
  {
    id: 'theta-6hz',
    name: 'Theta Creativity (6Hz)',
    category: 'binaural',
    duration: 60,
    isPremium: true,
  },
  {
    id: 'delta-2hz',
    name: 'Delta Rest (2Hz)',
    category: 'binaural',
    duration: 60,
    isPremium: true,
  },
];

export const builtInBackgrounds: BackgroundOption[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    type: 'built-in',
    colors: ['#0d0d14', '#1a1a2e', '#2d2d44'],
    isPremium: false,
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    type: 'built-in',
    colors: ['#1a2e1a', '#2d442d', '#3d5a3d'],
    isPremium: false,
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    type: 'built-in',
    colors: ['#0a1628', '#1a2f4d', '#2d4a6e'],
    isPremium: false,
  },
  {
    id: 'twilight',
    name: 'Twilight Sky',
    type: 'built-in',
    colors: ['#1a0a28', '#2f1a4d', '#4a2d6e'],
    isPremium: false,
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    type: 'built-in',
    colors: ['#2e2416', '#443622', '#5a4830'],
    isPremium: false,
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    type: 'built-in',
    colors: ['#0a1a14', '#1a3d2e', '#2d5a44'],
    isPremium: false,
  },
  // Premium backgrounds
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    type: 'built-in',
    colors: ['#0a1a28', '#1a4d3d', '#2d6e5a'],
    isPremium: true,
  },
  {
    id: 'volcanic',
    name: 'Volcanic Glow',
    type: 'built-in',
    colors: ['#1a0a0a', '#2e1a1a', '#442d2d'],
    isPremium: true,
  },
];

export const defaultFloatingElementConfig: FloatingElementConfig = {
  type: 'bubbles',
  intensity: 3,
  speed: 2,
};

export const elementConfigs = {
  bubbles: {
    minSize: 20,
    maxSize: 80,
    baseOpacity: 0.3,
    driftSpeed: 0.5,
  },
  particles: {
    minSize: 2,
    maxSize: 6,
    baseOpacity: 0.4,
    driftSpeed: 0.3,
  },
  aurora: {
    waveWidth: 200,
    waveHeight: 100,
    baseOpacity: 0.15,
    driftSpeed: 0.2,
  },
};

export const getIntensityMultiplier = (intensity: number): number => {
  // Intensity 1-5 maps to multiplier 0.5-2.5
  return 0.5 + (intensity - 1) * 0.5;
};

export const getSpeedMultiplier = (speed: number): number => {
  // Speed 1-5 maps to multiplier 0.5-2.0
  return 0.5 + (speed - 1) * 0.375;
};

export default {
  soundOptions,
  builtInBackgrounds,
  defaultFloatingElementConfig,
  elementConfigs,
  getIntensityMultiplier,
  getSpeedMultiplier,
};
