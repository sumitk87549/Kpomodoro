// Flowssom Stats Screen
// Gentle reflection on focus progress

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { useStatsStore } from '../../stores/statsStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { formatMinutes } from '../../utils/formatTime';

export default function StatsScreen() {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  
  const {
    todayFocusMinutes,
    todaySessionsCompleted,
    weeklyStats,
    allTimeSessions,
    allTimeFocusMinutes,
    currentStreak,
    streakGracePeriod,
    journalEntries,
  } = useStatsStore();

  const styles = createStyles(themeMode, colors);

  // Get max minutes for chart scaling
  const maxMinutes = Math.max(...weeklyStats.map(d => d.focusMinutes), 60);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Your focus, reflected.</Text>

          {/* Today Card */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={styles.cardLabel}>Today</Text>
            <Text style={styles.bigNumber}>{formatMinutes(todayFocusMinutes)}</Text>
            <Text style={styles.cardSubtext}>
              {todaySessionsCompleted} session{todaySessionsCompleted !== 1 ? 's' : ''} completed
            </Text>
          </View>

          {/* Week Chart */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={styles.cardLabel}>This Week</Text>
            <View style={styles.chartContainer}>
              {weeklyStats.map((day, index) => {
                const barHeight = day.focusMinutes > 0 
                  ? (day.focusMinutes / maxMinutes) * 120 
                  : 4;
                const isToday = index === weeklyStats.length - 1;
                
                return (
                  <View key={day.date} style={styles.barWrapper}>
                    <View style={[
                      styles.bar,
                      { 
                        height: barHeight,
                        backgroundColor: isToday ? colors.accent : colors.accentMuted,
                      }
                    ]} />
                    <Text style={[
                      styles.dayLabel,
                      { color: isToday ? colors.textPrimary : colors.textTertiary }
                    ]}>
                      {getDayName(day.date)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Streak Card */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={styles.cardLabel}>Gentle Streak</Text>
            <View style={styles.streakRow}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakUnit}>days</Text>
            </View>
            {!streakGracePeriod && currentStreak === 0 ? (
              <Text style={styles.streakMessage}>
                Your streak is resting. Start a session today.
              </Text>
            ) : (
              <Text style={styles.streakMessage}>
                Keep going, one session at a time.
              </Text>
            )}
          </View>

          {/* All-time Stats */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={styles.cardLabel}>All Time</Text>
            <View style={styles.allTimeRow}>
              <View style={styles.allTimeStat}>
                <Text style={styles.allTimeNumber}>{allTimeSessions}</Text>
                <Text style={styles.allTimeLabel}>sessions</Text>
              </View>
              <View style={styles.allTimeDivider} />
              <View style={styles.allTimeStat}>
                <Text style={styles.allTimeNumber}>{formatMinutes(allTimeFocusMinutes)}</Text>
                <Text style={styles.allTimeLabel}>of focus</Text>
              </View>
            </View>
          </View>

          {/* Session Journal */}
          {journalEntries.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={styles.cardLabel}>Session Journal</Text>
              <Text style={styles.journalNote}>Private — only on your device</Text>
              
              {journalEntries.slice(0, 5).map((entry) => (
                <View key={entry.id} style={styles.journalEntry}>
                  <Text style={styles.journalDate}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.journalText}>{entry.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const createStyles = (themeMode: string, colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  content: {
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.textPrimary,
  },
  cardSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.textPrimary,
  },
  streakUnit: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  streakMessage: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  allTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  allTimeStat: {
    alignItems: 'center',
  },
  allTimeNumber: {
    fontSize: 36,
    fontWeight: '200',
    color: colors.textPrimary,
  },
  allTimeLabel: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 4,
  },
  allTimeDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.backgroundSecondary,
  },
  journalNote: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  journalEntry: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  journalDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  journalText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
