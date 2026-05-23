// Flowssom Timer Store
// Complete timer state machine with Zustand

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

interface TimerState {
  // Current state
  status: TimerStatus;
  sessionType: SessionType;
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
  
  // Cycle tracking
  currentCycle: number;
  completedCycles: number;
  
  // Session history for this run
  sessionsCompleted: number;
  
  // Actions
  setDuration: (duration: number) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  skipSession: () => void;
  completeSession: () => void;
  tick: () => void;
  setSessionType: (type: SessionType) => void;
  setCurrentCycle: (cycle: number) => void;
}

const STORAGE_KEY = '@flowssom_timer_state';

// Helper to get next session type
const getNextSessionType = (
  currentType: SessionType,
  currentCycle: number,
  cyclesBeforeLongBreak: number
): SessionType => {
  if (currentType === 'focus') {
    const newCycle = currentCycle + 1;
    if (newCycle >= cyclesBeforeLongBreak) {
      return 'longBreak';
    }
    return 'shortBreak';
  }
  return 'focus';
};

export const useTimerStore = create<TimerState>((set, get) => ({
  status: 'idle',
  sessionType: 'focus',
  timeRemaining: 25 * 60, // default 25 minutes
  totalDuration: 25 * 60,
  currentCycle: 0,
  completedCycles: 0,
  sessionsCompleted: 0,

  setDuration: (duration: number) => {
    const { sessionType } = get();
    set({
      timeRemaining: duration,
      totalDuration: duration,
    });
  },

  startSession: () => {
    set({ status: 'running' });
  },

  pauseSession: () => {
    set({ status: 'paused' });
  },

  resumeSession: () => {
    set({ status: 'running' });
  },

  resetSession: () => {
    const { totalDuration } = get();
    set({
      status: 'idle',
      timeRemaining: totalDuration,
    });
  },

  skipSession: () => {
    const { sessionType, currentCycle, completedCycles, sessionsCompleted } = get();
    
    // Update completed cycles if we're skipping a focus session
    const newCompletedCycles = sessionType === 'focus' ? completedCycles + 1 : completedCycles;
    const newSessionsCompleted = sessionsCompleted + 1;
    
    set({
      completedCycles: newCompletedCycles,
      sessionsCompleted: newSessionsCompleted,
      status: 'idle',
    });
  },

  completeSession: () => {
    const { sessionType, currentCycle, completedCycles, sessionsCompleted } = get();
    
    // Update cycle tracking
    const newCompletedCycles = sessionType === 'focus' ? completedCycles + 1 : completedCycles;
    const newCurrentCycle = sessionType === 'focus' ? currentCycle + 1 : currentCycle;
    const newSessionsCompleted = sessionsCompleted + 1;
    
    // Reset cycle counter after long break
    const finalCycle = sessionType === 'longBreak' ? 0 : newCurrentCycle;
    
    set({
      completedCycles: newCompletedCycles,
      currentCycle: finalCycle,
      sessionsCompleted: newSessionsCompleted,
      status: 'completed',
    });
  },

  tick: () => {
    const { timeRemaining, status } = get();
    if (status !== 'running') return;
    
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      // Time's up
      get().completeSession();
    }
  },

  setSessionType: (type: SessionType) => {
    set({ sessionType: type });
  },

  setCurrentCycle: (cycle: number) => {
    set({ currentCycle: cycle });
  },
}));

// Persist timer state (optional - for recovering interrupted sessions)
export const persistTimerState = async () => {
  const state = useTimerStore.getState();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
    status: state.status,
    sessionType: state.sessionType,
    timeRemaining: state.timeRemaining,
    totalDuration: state.totalDuration,
    currentCycle: state.currentCycle,
    completedCycles: state.completedCycles,
  }));
};

export const restoreTimerState = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      useTimerStore.setState(parsed);
      return true;
    }
  } catch (e) {
    console.error('Failed to restore timer state:', e);
  }
  return false;
};

export const clearTimerState = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

export default useTimerStore;
