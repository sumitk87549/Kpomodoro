// Flowssom MicroBreakPrompt Component
// Movement and eye relaxation prompts

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Technique } from '../../constants/techniques';
import { getTheme } from '../../constants/themes';
import { useSettingsStore } from '../../stores/settingsStore';

interface MicroBreakPromptProps {
  technique: Technique;
  onComplete?: () => void;
}

export const MicroBreakPrompt: React.FC<MicroBreakPromptProps> = ({ technique, onComplete }) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const fadeAnim = useSharedValue(1);
  
  const prompts = technique.prompts || [];

  useEffect(() => {
    if (prompts.length === 0) return;

    const interval = setInterval(() => {
      // Fade out
      fadeAnim.value = withTiming(0, { duration: 500 });
      
      setTimeout(() => {
        // Change prompt
        setCurrentPromptIndex(prev => {
          const nextIndex = (prev + 1) % prompts.length;
          // Ensure we don't repeat consecutively
          if (nextIndex === prev && prompts.length > 1) {
            return (prev + 2) % prompts.length;
          }
          return nextIndex;
        });
        
        // Fade in
        setTimeout(() => {
          fadeAnim.value = withTiming(1, { duration: 500 });
        }, 100);
      }, 500);
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, [prompts.length, fadeAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  if (technique.id === 'eye-relaxation') {
    return <EyeRelaxationView technique={technique} onComplete={onComplete} />;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.promptContainer, animatedStyle]}>
        <Text style={[styles.promptText, { color: colors.textPrimary }]}>
          {prompts[currentPromptIndex]}
        </Text>
      </Animated.View>
      
      {technique.scientificBasis && (
        <Text style={[styles.scienceNote, { color: colors.textTertiary }]}>
          {technique.scientificBasis}
        </Text>
      )}
    </View>
  );
};

// Separate component for eye relaxation
const EyeRelaxationView: React.FC<{ technique: Technique; onComplete?: () => void }> = ({
  technique,
  onComplete,
}) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  const [secondsRemaining, setSecondsRemaining] = useState(20);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(s => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onComplete]);

  return (
    <View style={styles.eyeContainer}>
      <View style={styles.eyeGraphic}>
        <View style={[styles.eyeOutline, { borderColor: colors.accent }]} />
        <Animated.View 
          style={[
            styles.eyePupil, 
            { backgroundColor: colors.accent }
          ]} 
        />
      </View>
      
      <Text style={[styles.instruction, { color: colors.textPrimary }]}>
        Look at something at least 6 metres away
      </Text>
      
      <Text style={[styles.countdown, { color: colors.accent }]}>
        {secondsRemaining}s
      </Text>
      
      <Text style={[styles.scienceNote, { color: colors.textTertiary }]}>
        {technique.scientificBasis}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  promptContainer: {
    padding: 32,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 32,
  },
  scienceNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 24,
    paddingHorizontal: 32,
  },
  eyeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  eyeGraphic: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  eyeOutline: {
    position: 'absolute',
    width: 100,
    height: 60,
    borderRadius: 50,
    borderWidth: 3,
  },
  eyePupil: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
});

export default MicroBreakPrompt;
