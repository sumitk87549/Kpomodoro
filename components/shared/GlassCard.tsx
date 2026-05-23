// Flowssom GlassCard Component
// Frosted glass effect card for break experiences and overlays

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number; // Blur intensity 0-100
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style,
  intensity = 50 
}) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);

  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint={themeMode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[
        styles.content,
        { backgroundColor: colors.glass }
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  content: {
    padding: 20,
  },
});

export default GlassCard;
