// Flowssom BackgroundCanvas Component
// Background with overlay and optional custom image

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { builtInBackgrounds } from '../../constants/environments';

interface BackgroundCanvasProps {
  children?: React.ReactNode;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ children }) => {
  const { themeMode, selectedBackgroundId, customBackgroundUri } = useSettingsStore();
  const { colors } = getTheme(themeMode);

  // Get background source
  const getBackgroundSource = () => {
    if (customBackgroundUri) {
      return { uri: customBackgroundUri };
    }
    
    if (selectedBackgroundId) {
      // In production, these would be actual bundled images
      // For now, using placeholder colors
      const bg = builtInBackgrounds.find(b => b.id === selectedBackgroundId);
      if (bg) {
        return null; // Will use gradient
      }
    }
    return null;
  };

  const bgSource = getBackgroundSource();

  // Get gradient colors
  const getGradientColors = () => {
    if (selectedBackgroundId) {
      const bg = builtInBackgrounds.find(b => b.id === selectedBackgroundId);
      if (bg) {
        return bg.colors;
      }
    }
    return [colors.background, colors.backgroundSecondary];
  };

  const gradientColors = getGradientColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom image background */}
      {bgSource && (
        <Image
          source={bgSource}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* Gradient overlay for built-in backgrounds */}
      {!bgSource && (
        <View style={[
          styles.gradientBackground,
          { backgroundColor: gradientColors[0] }
        ]} />
      )}

      {/* Dark overlay for text readability */}
      <View style={[styles.overlay, { backgroundColor: colors.backgroundOverlay }]} />

      {/* Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BackgroundCanvas;
