// Flowssom Timer Screen (Main)
// The core focus experience

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { BackgroundCanvas } from '../../components/atmosphere/BackgroundCanvas';
import { FloatingElements } from '../../components/atmosphere/FloatingElements';
import { TimerRing } from '../../components/timer/TimerRing';
import { TimerControls } from '../../components/timer/TimerControls';
import { useTimer } from '../../hooks/useTimer';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';

export default function TimerScreen() {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  
  const {
    status,
    sessionType,
    timeRemaining,
    totalDuration,
    isRunning,
    isPaused,
    startSession,
    pauseSession,
    resetSession,
    skipSession,
  } = useTimer();

  return (
    <BackgroundCanvas>
      <FloatingElements />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Timer Ring */}
          <View style={styles.timerContainer}>
            <TimerRing
              timeRemaining={timeRemaining}
              totalDuration={totalDuration}
              sessionType={sessionType}
              isRunning={isRunning}
            />
          </View>

          {/* Controls */}
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={startSession}
            onPause={pauseSession}
            onReset={resetSession}
            onSkip={skipSession}
          />
        </View>
      </SafeAreaView>
    </BackgroundCanvas>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  timerContainer: {
    marginBottom: 40,
  },
});
