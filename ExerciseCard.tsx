import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WorkoutStep } from '../types';
import { COLORS } from '../constants/colors';

interface ExerciseCardProps {
  step: WorkoutStep;
  isActive: boolean;
  style?: ViewStyle;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  step, 
  isActive,
  style 
}) => {
  // Animation for card scale
  const scale = useSharedValue(1);
  
  // Animated style for the card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Get the background color based on step type
  const getBackgroundColor = () => {
    return step.type === 'exercise' ? COLORS.exerciseBackground : COLORS.restBackground;
  };
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor() },
        animatedStyle,
        style
      ]}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <Text style={styles.typeLabel}>
        {step.type === 'exercise' ? 'EXERCISE' : 'REST'}
      </Text>
      
      <Text style={styles.nameText}>{step.name}</Text>
      
      {step.description && (
        <Text style={styles.descriptionText}>{step.description}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textInverted,
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});

export default ExerciseCard;
