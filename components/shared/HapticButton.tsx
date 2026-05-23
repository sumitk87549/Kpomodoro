// Flowssom HapticButton Component
// Button with haptic feedback on press

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getTheme, ThemeMode } from '../../constants/themes';

interface HapticButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  themeMode?: ThemeMode;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  themeMode = 'dark',
}) => {
  const { colors } = getTheme(themeMode);

  const handlePress = async () => {
    if (disabled) return;
    
    // Light haptic feedback on every tap
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const variantStyles = {
      primary: {
        backgroundColor: colors.accent,
        paddingVertical: size === 'large' ? 16 : size === 'small' ? 8 : 12,
        paddingHorizontal: size === 'large' ? 40 : size === 'small' ? 20 : 32,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.accent,
        paddingVertical: size === 'large' ? 14 : size === 'small' ? 6 : 10,
        paddingHorizontal: size === 'large' ? 38 : size === 'small' ? 18 : 30,
      },
      tertiary: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
    };

    const sizeStyles = {
      small: { minWidth: 80 },
      medium: { minWidth: 100 },
      large: { minWidth: 140 },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyles = (): TextStyle => {
    const { typography } = getTheme(themeMode);
    
    const baseStyles: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantStyles = {
      primary: { color: themeMode === 'dark' ? '#ffffff' : colors.background },
      secondary: { color: colors.accent },
      tertiary: { color: colors.textSecondary },
    };

    const sizeStyles = {
      small: { fontSize: typography.sm },
      medium: { fontSize: typography.md },
      large: { fontSize: typography.lg },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
    };
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[getButtonStyles(), style]}
    >
      <Text style={[getTextStyles(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default HapticButton;
