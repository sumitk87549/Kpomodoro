// Flowssom Stats Store
// Local statistics management with gentle streaks

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyStats {
  date: string; // ISO date string (YYYY-MM-DD)
  focusMinutes: number;
  sessionsCompleted: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  sessionId?: string;
}

interface StatsState {
  // Today's stats
  todayFocusMinutes: number;
  todaySessionsCompleted: number;
  
  // Weekly data (last 7 days)
  weeklyStats: DailyStats[];
  
  // All-time totals
  allTimeSessions: number;
  allTimeFocusMinutes: number;
  
  // Streak tracking
  currentStreak: number;
  lastSessionDate: string | null;
  streakGracePeriod: boolean; // true if within 24h grace period
  
  // Session journal
  journalEntries: JournalEntry[];
  
  // Actions
  addSession: (durationMinutes: number) => void;
  addJournalEntry: (text: string) => void;
  getWeekData: () => DailyStats[];
  resetAllStats: () => void;
}

const STATS_STORAGE_KEY = '@flowssom_stats';
const JOURNAL_STORAGE_KEY = '@flowssom_journal';

const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Initialize with empty week data
const initializeWeekData = (): DailyStats[] => {
  const today = new Date();
  const week: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    week.push({
      date: date.toISOString().split('T')[0],
      focusMinutes: 0,
      sessionsCompleted: 0,
    });
  }
  
  return week;
};

export const useStatsStore = create<StatsState>((set, get) => ({
  todayFocusMinutes: 0,
  todaySessionsCompleted: 0,
  weeklyStats: initializeWeekData(),
  allTimeSessions: 0,
  allTimeFocusMinutes: 0,
  currentStreak: 0,
  lastSessionDate: null,
  streakGracePeriod: false,
  journalEntries: [],

  addSession: (durationMinutes: number) => {
    const today = getTodayDateString();
    const state = get();
    
    // Update today's stats
    const newTodayMinutes = state.todayFocusMinutes + durationMinutes;
    const newTodaySessions = state.todaySessionsCompleted + 1;
    
    // Update weekly stats
    const newWeeklyStats = state.weeklyStats.map(day => {
      if (day.date === today) {
        return {
          ...day,
          focusMinutes: day.focusMinutes + durationMinutes,
          sessionsCompleted: day.sessionsCompleted + 1,
        };
      }
      return day;
    });
    
    // Calculate streak
    let newStreak = state.currentStreak;
    let newGracePeriod = false;
    
    if (state.lastSessionDate) {
      const lastDate = new Date(state.lastSessionDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Same day, streak continues
        newGracePeriod = true;
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak += 1;
        newGracePeriod = true;
      } else if (diffDays === 2) {
        // Within grace period (missed one day)
        newGracePeriod = true;
        // Streak doesn't reset on first missed day
      } else {
        // More than 2 days, reset streak but start fresh
        newStreak = 1;
        newGracePeriod = true;
      }
    } else {
      // First session ever
      newStreak = 1;
      newGracePeriod = true;
    }
    
    set({
      todayFocusMinutes: newTodayMinutes,
      todaySessionsCompleted: newTodaySessions,
      weeklyStats: newWeeklyStats,
      allTimeSessions: state.allTimeSessions + 1,
      allTimeFocusMinutes: state.allTimeFocusMinutes + durationMinutes,
      currentStreak: newStreak,
      lastSessionDate: today,
      streakGracePeriod: newGracePeriod,
    });
  },

  addJournalEntry: (text: string) => {
    const newEntry: JournalEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      text,
    };
    
    set((state) => ({
      journalEntries: [newEntry, ...state.journalEntries],
    }));
  },

  getWeekData: () => {
    return get().weeklyStats;
  },

  resetAllStats: () => {
    set({
      todayFocusMinutes: 0,
      todaySessionsCompleted: 0,
      weeklyStats: initializeWeekData(),
      allTimeSessions: 0,
      allTimeFocusMinutes: 0,
      currentStreak: 0,
      lastSessionDate: null,
      streakGracePeriod: false,
      journalEntries: [],
    });
  },
}));

// Persistence functions
export const saveStats = async () => {
  const state = useStatsStore.getState();
  await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify({
    todayFocusMinutes: state.todayFocusMinutes,
    todaySessionsCompleted: state.todaySessionsCompleted,
    weeklyStats: state.weeklyStats,
    allTimeSessions: state.allTimeSessions,
    allTimeFocusMinutes: state.allTimeFocusMinutes,
    currentStreak: state.currentStreak,
    lastSessionDate: state.lastSessionDate,
    streakGracePeriod: state.streakGracePeriod,
  }));
};

export const saveJournal = async () => {
  const state = useStatsStore.getState();
  await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(state.journalEntries));
};

export const loadStats = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Refresh week data to include today
      const today = getTodayDateString();
      let weeklyStats = parsed.weeklyStats || initializeWeekData();
      
      // Check if we need to shift the week
      const lastDayInData = weeklyStats[weeklyStats.length - 1]?.date;
      if (lastDayInData && lastDayInData !== today) {
        weeklyStats = initializeWeekData();
      }
      
      useStatsStore.setState({
        ...parsed,
        weeklyStats,
        // Recalculate today's stats from weekly data
        todayFocusMinutes: weeklyStats.find(d => d.date === today)?.focusMinutes || 0,
        todaySessionsCompleted: weeklyStats.find(d => d.date === today)?.sessionsCompleted || 0,
      });
      return true;
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return false;
};

export const loadJournal = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      useStatsStore.setState({ journalEntries: parsed });
      return true;
    }
  } catch (e) {
    console.error('Failed to load journal:', e);
  }
  return false;
};

// Auto-save on changes
useStatsStore.subscribe((state) => {
  saveStats().catch(console.error);
});

// Separate subscription for journal
useStatsStore.subscribe((state) => {
  saveJournal().catch(console.error);
}, (state) => state.journalEntries);

export default useStatsStore;
