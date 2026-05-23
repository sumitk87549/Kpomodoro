// Flowssom Stats Calculator Utilities

import { DailyStats } from '../stores/statsStore';

export const calculateTotalFocusMinutes = (stats: DailyStats[]): number => {
  return stats.reduce((total, day) => total + day.focusMinutes, 0);
};

export const calculateTotalSessions = (stats: DailyStats[]): number => {
  return stats.reduce((total, day) => total + day.sessionsCompleted, 0);
};

export const getBestDay = (stats: DailyStats[]): DailyStats | null => {
  if (stats.length === 0) return null;
  
  return stats.reduce((best, current) => 
    current.focusMinutes > best.focusMinutes ? current : best
  );
};

export const getAverageDailyMinutes = (stats: DailyStats[]): number => {
  if (stats.length === 0) return 0;
  const total = calculateTotalFocusMinutes(stats);
  return Math.round(total / stats.length);
};

export const calculateStreakFromData = (stats: DailyStats[]): number => {
  if (stats.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...stats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    
    if (i === 0) {
      // First day must be today or yesterday to start counting
      if (day.date !== today && day.date !== yesterday) {
        break;
      }
      if (day.sessionsCompleted > 0) {
        streak = 1;
      } else {
        break;
      }
    } else {
      const prevDate = sorted[i - 1].date;
      const currentDate = day.date;
      const diffDays = Math.floor(
        (new Date(prevDate).getTime() - new Date(currentDate).getTime()) / 86400000
      );
      
      if (diffDays === 1 && day.sessionsCompleted > 0) {
        streak += 1;
      } else if (diffDays > 1) {
        break;
      }
    }
  }
  
  return streak;
};

export const getWeeklyProgress = (stats: DailyStats[]): number => {
  const total = calculateTotalFocusMinutes(stats);
  // Assuming a goal of 25 minutes × 5 days = 125 minutes per week
  const goal = 125;
  return Math.min(100, Math.round((total / goal) * 100));
};

export const formatHoursFocused = (minutes: number): string => {
  const hours = minutes / 60;
  if (hours < 1) {
    return `${minutes}m`;
  }
  return `${hours.toFixed(1)}h`;
};

export default {
  calculateTotalFocusMinutes,
  calculateTotalSessions,
  getBestDay,
  getAverageDailyMinutes,
  calculateStreakFromData,
  getWeeklyProgress,
  formatHoursFocused,
};
