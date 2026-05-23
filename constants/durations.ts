// Flowssom Duration Defaults
// Flexible timer settings that persist across sessions

export interface TimerDurations {
  focusDuration: number; // minutes (5-120)
  shortBreakDuration: number; // minutes (1-30)
  longBreakDuration: number; // minutes (5-60)
  cyclesBeforeLongBreak: number; // 1-8
}

export const defaultDurations: TimerDurations = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};

export const durationRanges = {
  focus: { min: 5, max: 120 },
  shortBreak: { min: 1, max: 30 },
  longBreak: { min: 5, max: 60 },
  cycles: { min: 1, max: 8 },
};

export const validateDuration = (
  type: keyof typeof durationRanges,
  value: number
): number => {
  const range = durationRanges[type];
  return Math.min(Math.max(value, range.min), range.max);
};

export const getPresetDurations = (): { name: string; durations: TimerDurations }[] => [
  {
    name: 'Classic Pomodoro',
    durations: {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4,
    },
  },
  {
    name: 'Deep Work',
    durations: {
      focusDuration: 50,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      cyclesBeforeLongBreak: 3,
    },
  },
  {
    name: 'Quick Focus',
    durations: {
      focusDuration: 15,
      shortBreakDuration: 3,
      longBreakDuration: 10,
      cyclesBeforeLongBreak: 4,
    },
  },
  {
    name: 'Ultra Short',
    durations: {
      focusDuration: 10,
      shortBreakDuration: 2,
      longBreakDuration: 5,
      cyclesBeforeLongBreak: 6,
    },
  },
];

export default {
  defaultDurations,
  durationRanges,
  validateDuration,
  getPresetDurations,
};
