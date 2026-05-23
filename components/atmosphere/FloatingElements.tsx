// Flowssom FloatingElements Component
// Animated bubbles, particles, or aurora effects using Reanimated

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { ElementType, elementConfigs, getIntensityMultiplier, getSpeedMultiplier } from '../../constants/environments';

const { width, height } = Dimensions.get('window');

interface ElementProps {
  type: ElementType;
  index: number;
  intensity: number;
  speed: number;
  colors: string[];
}

const FloatingElement: React.FC<ElementProps> = ({ type, index, intensity, speed, colors }) => {
  const config = elementConfigs[type];
  
  // Random starting position and size
  const startX = useMemo(() => Math.random() * width, []);
  const startY = useMemo(() => height + Math.random() * 200, []);
  const size = useMemo(() => {
    const range = config.maxSize - config.minSize;
    return config.minSize + (Math.random() * range);
  }, [type]);

  // Animation values
  const yPosition = useSharedValue(startY);
  const xPosition = useSharedValue(startX);
  const opacity = useSharedValue(config.baseOpacity);

  useEffect(() => {
    const duration = 8000 / getSpeedMultiplier(speed);
    const driftAmount = 50 * getIntensityMultiplier(intensity);

    // Vertical movement
    yPosition.value = withRepeat(
      withTiming(startY - height - 200, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Horizontal drift
    xPosition.value = withRepeat(
      withTiming(startX + (Math.random() - 0.5) * driftAmount * 2, {
        duration: duration * 2,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [intensity, speed, startY, startX, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPosition.value },
      { translateY: yPosition.value },
    ],
    opacity: opacity.value,
  }));

  if (type === 'bubbles') {
    return (
      <Animated.View
        style={[
          styles.bubble,
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors[0],
            left: startX,
          },
        ]}
      />
    );
  }

  if (type === 'particles') {
    return (
      <Animated.View
        style={[
          styles.particle,
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors[0],
            left: startX,
          },
        ]}
      />
    );
  }

  // Aurora is handled differently - as waves
  return null;
};

interface FloatingElementsProps {
  elementType?: ElementType;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ elementType }) => {
  const { themeMode, floatingElements } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  
  const type = elementType || floatingElements.type;
  const intensity = floatingElements.intensity;
  const speed = floatingElements.speed;

  // Calculate number of elements based on intensity
  const elementCount = Math.floor(5 + intensity * 3);

  // Get color for elements
  const elementColor = type === 'bubbles' ? colors.bubble : colors.particle;

  return (
    <View style={styles.container}>
      {Array.from({ length: elementCount }).map((_, index) => (
        <FloatingElement
          key={index}
          type={type}
          index={index}
          intensity={intensity}
          speed={speed}
          colors={[elementColor]}
        />
      ))}
      
      {/* Aurora waves rendered separately */}
      {type === 'aurora' && (
        <AuroraWaves intensity={intensity} speed={speed} colors={colors.aurora} />
      )}
    </View>
  );
};

// Aurora Waves Component
const AuroraWaves: React.FC<{ intensity: number; speed: number; colors: string[] }> = ({
  intensity,
  speed,
  colors,
}) => {
  const wave1Y = useSharedValue(0);
  const wave2Y = useSharedValue(0);
  const wave3Y = useSharedValue(0);

  useEffect(() => {
    const duration = 6000 / getSpeedMultiplier(speed);
    
    wave1Y.value = withRepeat(
      withTiming(Math.sin(Date.now() / 1000) * 50 * getIntensityMultiplier(intensity), {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [intensity, speed]);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: wave1Y.value }],
  }));

  return (
    <View style={styles.auroraContainer}>
      <Animated.View
        style={[
          styles.auroraWave,
          wave1Style,
          { backgroundColor: colors[0], opacity: 0.1 * getIntensityMultiplier(intensity) },
        ]}
      />
      <Animated.View
        style={[
          styles.auroraWave,
          { backgroundColor: colors[1], opacity: 0.08 * getIntensityMultiplier(intensity), top: '20%' },
        ]}
      />
      <Animated.View
        style={[
          styles.auroraWave,
          { backgroundColor: colors[2], opacity: 0.06 * getIntensityMultiplier(intensity), top: '40%' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
  },
  auroraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  auroraWave: {
    position: 'absolute',
    width: width * 1.5,
    height: 200,
    left: -width * 0.25,
    borderRadius: 100,
  },
});

export default FloatingElements;
