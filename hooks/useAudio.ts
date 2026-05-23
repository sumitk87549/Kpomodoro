// Flowssom useAudio Hook
// Audio playback management for ambient sounds

import { useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettingsStore } from '../stores/settingsStore';
import { soundOptions } from '../constants/environments';

export const useAudio = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const { selectedSoundId, soundVolume } = useSettingsStore();

  const loadSound = useCallback(async (soundId: string) => {
    // Stop any existing sound
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Find sound config
    const soundConfig = soundOptions.find(s => s.id === soundId);
    if (!soundConfig) return;

    try {
      // In production, these would be bundled assets
      // For now, using placeholder paths
      const soundPath = require(`../assets/sounds/${soundId}.mp3`);
      
      const { sound } = await Audio.Sound.createAsync(
        soundPath,
        {
          isLooping: true,
          volume: soundVolume,
        }
      );
      
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to load sound:', error);
    }
  }, [soundVolume]);

  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      // Fade out effect
      await soundRef.current.setVolumeAsync(0.5);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    if (soundRef.current && soundRef.current.isLoadedAsync) {
      await soundRef.current.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  }, []);

  const togglePlayback = useCallback(async (isPlaying: boolean) => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      await soundRef.current.playAsync();
    } else {
      await soundRef.current.pauseAsync();
    }
  }, []);

  // Effect to handle sound changes
  useEffect(() => {
    if (selectedSoundId) {
      loadSound(selectedSoundId);
    } else {
      unloadSound();
    }

    return () => {
      unloadSound();
    };
  }, [selectedSoundId, loadSound, unloadSound]);

  // Effect to handle volume changes
  useEffect(() => {
    setVolume(soundVolume);
  }, [soundVolume, setVolume]);

  return {
    isPlaying: soundRef.current !== null,
    isLoading: false,
    currentSoundId: selectedSoundId,
    loadSound,
    unloadSound,
    setVolume,
    togglePlayback,
  };
};

export default useAudio;
