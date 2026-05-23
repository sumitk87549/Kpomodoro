// Flowssom useTimer Hook
// Timer logic with interval management

import { useEffect, useCallback } from 'react';
import { useTimerStore, TimerStatus, SessionType } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useStatsStore } from '../stores/statsStore';
import * as KeepAwake from 'expo-keep-awake';

export const useTimer = () => {
  const {
    status,
    sessionType,
    timeRemaining,
    totalDuration,
    currentCycle,
    sessionsCompleted,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    tick,
    setDuration,
    completeSession,
  } = useTimerStore();

  const { keepScreenAwake, autoStartBreak, autoStartNextSession } = useSettingsStore();
  const addSession = useStatsStore((state) => state.addSession);

  // Keep screen awake during focus sessions
  useEffect(() => {
    if (status === 'running' && keepScreenAwake && sessionType === 'focus') {
      KeepAwake.activateAsync().catch(console.error);
    } else {
      KeepAwake.deactivateAsync().catch(console.error);
    }

    return () => {
      KeepAwake.deactivateAsync().catch(console.error);
    };
  }, [status, keepScreenAwake, sessionType]);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tick]);

  // Handle session completion
  useEffect(() => {
    if (status === 'completed') {
      // Record stats for focus sessions
      if (sessionType === 'focus') {
        const durationMinutes = Math.round(totalDuration / 60);
        addSession(durationMinutes);
      }
    }
  }, [status, sessionType, totalDuration, addSession]);

  const handleStart = useCallback(() => {
    if (status === 'idle' || status === 'paused') {
      startSession();
    }
  }, [status, startSession]);

  const handlePause = useCallback(() => {
    if (status === 'running') {
      pauseSession();
    }
  }, [status, pauseSession]);

  const handleReset = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const handleSkip = useCallback(() => {
    // Skip logic handled in store
  }, []);

  const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;

  return {
    // State
    status,
    sessionType,
    timeRemaining,
    totalDuration,
    progress,
    currentCycle,
    sessionsCompleted,
    
    // Actions
    startSession: handleStart,
    pauseSession: handlePause,
    resumeSession,
    resetSession: handleReset,
    skipSession: handleSkip,
    setDuration,
    
    // Derived
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isIdle: status === 'idle',
    isCompleted: status === 'completed',
  };
};

export default useTimer;
