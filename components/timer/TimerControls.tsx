// Flowssom TimerControls Component
// Start/Pause, Skip, Reset buttons

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { HapticButton } from '../shared/HapticButton';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { useHaptics } from '../../hooks/useHaptics';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onSkip,
}) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  const haptics = useHaptics();

  // Breathing animation for start button on idle
  const scaleAnim = useSharedValue(1);

  React.useEffect(() => {
    if (!isRunning && !isPaused) {
      scaleAnim.value = withRepeat(
        withTiming(1.03, { duration: 1500 }),
        -1,
        true
      );
    } else {
      scaleAnim.value = 1;
    }
  }, [isRunning, isPaused, scaleAnim]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handleStart = async () => {
    await haptics.medium();
    onStart();
  };

  const handlePause = async () => {
    await haptics.light();
    onPause();
  };

  const handleReset = async () => {
    await haptics.light();
    onReset();
  };

  return (
    <View style={styles.container}>
      {/* Main action button */}
      <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
        <HapticButton
          onPress={isRunning ? handlePause : handleStart}
          title={isRunning ? 'Pause' : 'Start'}
          variant="primary"
          size="large"
          themeMode={themeMode}
        />
      </Animated.View>

      {/* Secondary actions */}
      <View style={styles.secondaryButtons}>
        <HapticButton
          onPress={handleReset}
          title="Reset"
          variant="tertiary"
          size="small"
          themeMode={themeMode}
        />
        <HapticButton
          onPress={onSkip}
          title="Skip"
          variant="secondary"
          size="small"
          themeMode={themeMode}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  mainButton: {
    marginBottom: 20,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 24,
  },
});

export default TimerControls;
