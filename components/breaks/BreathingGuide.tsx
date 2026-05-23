// Flowssom BreathingGuide Component
// Box breathing and physiological sigh implementations

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Technique } from '../../constants/techniques';
import { getTheme } from '../../constants/themes';
import { useSettingsStore } from '../../stores/settingsStore';

interface BreathingGuideProps {
  technique: Technique;
  onComplete?: () => void;
}

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ technique, onComplete }) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  
  const scale = useSharedValue(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = React.useState(0);
  const [cycleCount, setCycleCount] = React.useState(1);

  const phases = technique.phases || [];
  const totalCycles = technique.cycles || 1;

  useEffect(() => {
    if (phases.length === 0) return;

    let isMounted = true;
    const runPhase = async () => {
      const phase = phases[currentPhaseIndex];
      
      // Animate circle
      const targetScale = phase.expand ? 1.5 : 1;
      scale.value = withTiming(targetScale, { 
        duration: phase.duration * 1000,
        easing: Easing.inOut(Easing.sin),
      });

      // Wait for phase duration
      await new Promise(resolve => setTimeout(resolve, phase.duration * 1000));
      
      if (!isMounted) return;

      // Move to next phase
      const nextIndex = (currentPhaseIndex + 1) % phases.length;
      
      if (nextIndex === 0) {
        // Completed a full cycle
        if (cycleCount >= totalCycles) {
          onComplete?.();
          return;
        }
        setCycleCount(c => c + 1);
      }
      
      setCurrentPhaseIndex(nextIndex);
    };

    runPhase();

    return () => {
      isMounted = false;
    };
  }, [currentPhaseIndex, phases, totalCycles, cycleCount, scale, onComplete]);

  const currentPhase = phases[currentPhaseIndex];

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            animatedCircleStyle,
            {
              backgroundColor: colors.accent,
              borderColor: colors.accentMuted,
            },
          ]}
        />
      </View>

      <Text style={[styles.instruction, { color: colors.textPrimary }]}>
        {currentPhase?.instruction || 'Breathe...'}
      </Text>

      <Text style={[styles.cycleCount, { color: colors.textSecondary }]}>
        Cycle {cycleCount} of {totalCycles}
      </Text>

      {technique.scientificBasis && (
        <Text style={[styles.scienceNote, { color: colors.textTertiary }]}>
          {technique.scientificBasis}
        </Text>
      )}
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
  circleContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    opacity: 0.8,
  },
  instruction: {
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
  },
  cycleCount: {
    fontSize: 16,
    marginBottom: 24,
  },
  scienceNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 32,
  },
});

export default BreathingGuide;
