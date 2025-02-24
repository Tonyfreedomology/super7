import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { selectionHaptic } from '../utils/haptics';
import { COLORS } from '../constants/colors';
import { useSettings } from '../context/SettingsContext';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  onPress,
  disabled,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const { settings } = useSettings();
  
  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Handle press and provide haptic feedback
  const handlePress = (e: any) => {
    // Trigger haptic feedback
    if (settings.hapticsEnabled) {
      selectionHaptic();
    }
    
    // Call the original onPress handler
    if (onPress) {
      onPress(e);
    }
  };
  
  // Handle press in animation
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };
  
  // Handle press out animation
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };
  
  // Get styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        baseStyle.borderRadius = 6;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 32;
        baseStyle.borderRadius = 12;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 24;
        baseStyle.borderRadius = 8;
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        };
      default: // primary
        return {
          ...baseStyle,
          backgroundColor: COLORS.primary,
        };
    }
  };
  
  // Get text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
    }
    
    // Variant styles
    switch (variant) {
      case 'outline':
      case 'text':
        return {
          ...baseStyle,
          color: COLORS.primary,
        };
      default: // primary and secondary
        return {
          ...baseStyle,
          color: COLORS.textInverted,
        };
    }
  };
  
  return (
    <AnimatedPressable
      style={[getButtonStyles(), animatedStyle, disabled && styles.disabled, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.textInverted}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
