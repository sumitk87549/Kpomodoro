// Flowssom Settings Screen
// All user preferences in one place

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSettingsStore, saveSettings, resetAllSettings } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { defaultDurations, getPresetDurations } from '../../constants/durations';
import { builtInBackgrounds } from '../../constants/environments';

export default function SettingsScreen() {
  const { themeMode, durations, selectedBackgroundId, customBackgroundUri, sessionEndNotification, breakEndNotification, keepScreenAwake, requestDND, setThemeMode, setDurations, setSelectedBackground, setCustomBackground, setSessionEndNotification, setBreakEndNotification, setKeepScreenAwake, setRequestDND } = useSettingsStore();
  
  const { colors } = getTheme(themeMode);
  const styles = createStyles(themeMode, colors);

  const pickBackground = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCustomBackground(result.assets[0].uri);
      setSelectedBackground(null);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Clear all data?',
      'This will delete all your stats, settings, and journal entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Everything', 
          style: 'destructive',
          onPress: () => {
            resetAllSettings();
            Alert.alert('Data cleared', 'Flowssom has been reset to defaults.');
          }
        },
      ]
    );
  };

  const presets = getPresetDurations();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          {/* Appearance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Dark Mode</Text>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: colors.backgroundSecondary, true: colors.accent }}
                thumbColor={themeMode === 'dark' ? colors.surface : colors.textTertiary}
              />
            </View>
          </View>

          {/* Timer Defaults */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timer Defaults</Text>
            
            {presets.map((preset) => (
              <View
                key={preset.name}
                style={[
                  styles.presetButton,
                  { 
                    backgroundColor: 
                      durations.focusDuration === preset.durations.focusDuration 
                        ? colors.accent 
                        : colors.surface 
                  }
                ]}
              >
                <Text
                  style={[
                    styles.presetText,
                    { color: durations.focusDuration === preset.durations.focusDuration ? '#ffffff' : colors.textPrimary }
                  ]}
                  onPress={() => setDurations(preset.durations)}
                >
                  {preset.name}
                </Text>
              </View>
            ))}

            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Focus: {durations.focusDuration} min</Text>
            </View>
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Short Break: {durations.shortBreakDuration} min</Text>
            </View>
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Long Break: {durations.longBreakDuration} min</Text>
            </View>
          </View>

          {/* Background */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background</Text>
            
            <View style={styles.backgroundGrid}>
              {builtInBackgrounds.slice(0, 6).map((bg) => (
                <View
                  key={bg.id}
                  style={[
                    styles.backgroundOption,
                    { 
                      backgroundColor: bg.colors[0],
                      borderColor: selectedBackgroundId === bg.id ? colors.accent : 'transparent',
                      borderWidth: 2,
                    }
                  ]}
                  onTouchEnd={() => {
                    setSelectedBackground(bg.id);
                    setCustomBackground(null);
                  }}
                >
                  <Text style={styles.backgroundName}>{bg.name}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.customBackground, { backgroundColor: colors.surface }]}>
              <Text style={styles.optionLabel}>Or use your own photo</Text>
              {customBackgroundUri ? (
                <View style={styles.customBackgroundPreview}>
                  <Text style={styles.previewText}>Custom background selected</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Session End Chime</Text>
              <Switch
                value={sessionEndNotification}
                onValueChange={setSessionEndNotification}
                trackColor={{ false: colors.backgroundSecondary, true: colors.accent }}
              />
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Break End Reminder</Text>
              <Switch
                value={breakEndNotification}
                onValueChange={setBreakEndNotification}
                trackColor={{ false: colors.backgroundSecondary, true: colors.accent }}
              />
            </View>
          </View>

          {/* Focus Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Focus Mode</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Keep Screen Awake</Text>
              <Switch
                value={keepScreenAwake}
                onValueChange={setKeepScreenAwake}
                trackColor={{ false: colors.backgroundSecondary, true: colors.accent }}
              />
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Request Do Not Disturb</Text>
              <Switch
                value={requestDND}
                onValueChange={setRequestDND}
                trackColor={{ false: colors.backgroundSecondary, true: colors.accent }}
              />
            </View>
            <Text style={styles.optionDescription}>
              When enabled, Flowssom will prompt you to enable DND when a session starts.
            </Text>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            <Text style={styles.privacyText}>
              All data is stored on your device. Nothing is shared with servers except anonymous room presence (if you choose to use Focus Rooms).
            </Text>
          </View>

          {/* Danger Zone */}
          <View style={[styles.section, styles.dangerZone]}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <View style={styles.dangerButton} onTouchEnd={handleResetData}>
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>Flowssom v1.0.0</Text>
            <Text style={styles.aboutText}>Built with care for focused humans everywhere.</Text>
            
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Rate Flowssom →</Text>
            </View>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>If Flowssom has helped you, you can support it here →</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (themeMode: string, colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100,
  },
  content: {
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 4,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '500',
  },
  durationRow: {
    paddingVertical: 4,
  },
  durationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  backgroundOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundName: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  customBackground: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  customBackgroundPreview: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  dangerZone: {
    backgroundColor: 'rgba(191, 125, 125, 0.1)',
    padding: 16,
    borderRadius: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: 'rgba(191, 125, 125, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  linkRow: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: colors.accent,
  },
});
