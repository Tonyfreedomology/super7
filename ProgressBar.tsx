import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showPercentage?: boolean;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
  currentStep?: number;
  totalSteps?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = false,
  height = 8,
  backgroundColor = COLORS.timerBackground,
  progressColor = COLORS.primary,
  style,
  currentStep,
  totalSteps,
}) => {
  // Animated width for the progress bar
  const widthAnimation = useSharedValue(0);
  
  // Update animation when progress changes
  React.useEffect(() => {
    widthAnimation.value = withTiming(progress, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, widthAnimation]);
  
  // Animated style for the progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthAnimation.value}%`,
    };
  });
  
  return (
    <View style={[styles.container, style]}>
      {(currentStep !== undefined && totalSteps !== undefined) && (
        <Text style={styles.stepsText}>
          {currentStep} of {totalSteps}
        </Text>
      )}
      
      <View style={[styles.progressBarContainer, { height }, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: progressColor },
            animatedStyle,
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={styles.percentageText}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBarContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    width: '0%',
  },
  stepsText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ProgressBar;
