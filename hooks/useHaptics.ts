// Flowssom useHaptics Hook
// Haptic feedback utilities

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useHaptics = () => {
  // Check if haptics are available (not available on web)
  const isAvailable = Platform.OS !== 'web';

  const light = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const medium = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const heavy = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const success = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const error = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const warning = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  const selection = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      // Ignore haptic errors
    }
  }, [isAvailable]);

  return {
    isAvailable,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
  };
};

export default useHaptics;
