// Flowssom Root Layout
// Main app layout with navigation and providers

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useSettingsStore, loadSettings } from '../stores/settingsStore';
import { useStatsStore, loadStats, loadJournal } from '../stores/statsStore';
import { getTheme } from '../constants/themes';

export default function RootLayout() {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);

  // Load persisted settings and stats on mount
  useEffect(() => {
    const loadData = async () => {
      await loadSettings();
      await loadStats();
      await loadJournal();
    };
    
    loadData().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Flowssom' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
