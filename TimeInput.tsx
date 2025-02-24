import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface TimeInputProps {
  initialValue?: number; // in minutes
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  style?: ViewStyle;
}

const TimeInput: React.FC<TimeInputProps> = ({
  initialValue = 7,
  min = 1,
  max = 60,
  step = 1,
  onValueChange,
  style,
}) => {
  const [minutes, setMinutes] = useState(initialValue.toString());
  const fontSize = useSharedValue(32);
  
  // Animated style for text input
  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      fontSize: fontSize.value,
    };
  });
  
  // Ensure minutes are within min and max range
  const validateMinutes = (value: string): string => {
    const numberValue = parseInt(value, 10);
    
    if (isNaN(numberValue)) {
      return min.toString();
    }
    
    if (numberValue < min) {
      return min.toString();
    }
    
    if (numberValue > max) {
      return max.toString();
    }
    
    return numberValue.toString();
  };
  
  // Handle text input change
  const handleChange = (text: string) => {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    setMinutes(numericText || '');
  };
  
  // Handle text input blur
  const handleBlur = () => {
    const validatedValue = validateMinutes(minutes);
    setMinutes(validatedValue);
    
    if (onValueChange) {
      onValueChange(parseInt(validatedValue, 10));
    }
  };
  
  // Increase minutes by step
  const increaseMinutes = () => {
    const currentValue = parseInt(minutes, 10) || 0;
    const newValue = Math.min(currentValue + step, max);
    setMinutes(newValue.toString());
    
    if (onValueChange) {
      onValueChange(newValue);
    }
    
    // Animate text size
    fontSize.value = withTiming(38, { duration: 100 }, () => {
      fontSize.value = withTiming(32, { duration: 100 });
    });
  };
  
  // Decrease minutes by step
  const decreaseMinutes = () => {
    const currentValue = parseInt(minutes, 10) || 0;
    const newValue = Math.max(currentValue - step, min);
    setMinutes(newValue.toString());
    
    if (onValueChange) {
      onValueChange(newValue);
    }
    
    // Animate text size
    fontSize.value = withTiming(26, { duration: 100 }, () => {
      fontSize.value = withTiming(32, { duration: 100 });
    });
  };
  
  // Initial value change
  useEffect(() => {
    if (onValueChange) {
      onValueChange(initialValue);
    }
  }, [initialValue, onValueChange]);
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>I have</Text>
      
      <View style={styles.inputContainer}>
        <Animated.Text 
          style={[styles.button, styles.decrementButton]} 
          onPress={decreaseMinutes}
        >
          -
        </Animated.Text>
        
        <View style={styles.minutesContainer}>
          <Animated.TextInput
            style={[styles.input, animatedInputStyle]}
            value={minutes}
            onChangeText={handleChange}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={styles.minutesLabel}>
            minute{parseInt(minutes, 10) !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <Animated.Text 
          style={[styles.button, styles.incrementButton]} 
          onPress={increaseMinutes}
        >
          +
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 56,
    borderRadius: 30,
    backgroundColor: COLORS.card,
  },
  decrementButton: {
    marginRight: 16,
  },
  incrementButton: {
    marginLeft: 16,
  },
  minutesContainer: {
    alignItems: 'center',
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    minWidth: 80,
  },
  minutesLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default TimeInput;
