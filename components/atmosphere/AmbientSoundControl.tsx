// Flowssom AmbientSoundControl Component
// Sound selection and volume control

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HapticButton } from '../shared/HapticButton';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePremiumStore } from '../../stores/premiumStore';
import { getTheme } from '../../constants/themes';
import { soundOptions } from '../../constants/environments';

interface AmbientSoundControlProps {
  onDismiss?: () => void;
}

export const AmbientSoundControl: React.FC<AmbientSoundControlProps> = ({ onDismiss }) => {
  const { themeMode, selectedSoundId, setSelectedSound, soundVolume, setSoundVolume } = useSettingsStore();
  const { hasBinauralBeats } = usePremiumStore();
  const { colors } = getTheme(themeMode);

  const filteredSounds = soundOptions.filter(sound => {
    if (sound.category === 'binaural' && !hasBinauralBeats) return false;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Ambient Sound</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.soundList}
      >
        {filteredSounds.map((sound) => (
          <HapticButton
            key={sound.id}
            onPress={() => setSelectedSound(selectedSoundId === sound.id ? null : sound.id)}
            title={sound.name}
            variant={selectedSoundId === sound.id ? 'primary' : 'secondary'}
            size="small"
            themeMode={themeMode}
            style={styles.soundButton}
          />
        ))}
      </ScrollView>

      <View style={styles.volumeRow}>
        <Text style={[styles.volumeLabel, { color: colors.textSecondary }]}>Volume</Text>
        <View style={styles.volumeSlider}>
          <View style={[styles.volumeTrack, { backgroundColor: colors.backgroundSecondary }]}>
            <View 
              style={[
                styles.volumeFill, 
                { 
                  width: `${soundVolume * 100}%`,
                  backgroundColor: colors.accent 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  soundList: {
    gap: 8,
    paddingRight: 20,
  },
  soundButton: {
    marginRight: 8,
  },
  volumeRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  volumeSlider: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  volumeTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default AmbientSoundControl;
