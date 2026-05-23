// Flowssom TimerRing Component
// Animated SVG circular progress ring

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withSpring, interpolateColor } from 'react-native-reanimated';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { formatTime } from '../../utils/formatTime';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerRingProps {
  timeRemaining: number;
  totalDuration: number;
  sessionType: 'focus' | 'shortBreak' | 'longBreak';
  isRunning: boolean;
  size?: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  timeRemaining,
  totalDuration,
  sessionType,
  isRunning,
  size = 280,
}) => {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Color interpolation based on progress and session type
  const getRingColor = () => {
    if (sessionType === 'focus') {
      return colors.timerRing;
    } else if (sessionType === 'shortBreak') {
      return colors.accentWarm;
    } else {
      return colors.accentCool;
    }
  };

  const ringColor = getRingColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.timerRingBackground}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress ring */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={withSpring(strokeDashoffset, {
            damping: 15,
            stiffness: 100,
          })}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={[styles.timeText, { color: colors.timerText }]}>
          {formatTime(timeRemaining)}
        </Text>
        <Text style={[styles.labelText, { color: colors.textSecondary }]}>
          {sessionType === 'focus' ? 'Focus' : sessionType === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  labelText: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 1,
  },
});

export default TimerRing;
