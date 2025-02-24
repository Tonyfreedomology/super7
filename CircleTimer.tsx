import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { formatTime } from '../utils/workout';

interface CircleTimerProps {
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  size?: number;
  strokeWidth?: number;
  colors?: string[];
  style?: ViewStyle;
  onComplete?: () => void;
  onUpdate?: (remainingTime: number) => void;
}

const CircleTimer: React.FC<CircleTimerProps> = ({
  duration,
  remainingTime,
  isRunning,
  isPaused,
  size = 280,
  strokeWidth = 12,
  colors = [COLORS.success, COLORS.primary, COLORS.warning, COLORS.error],
  style,
  onComplete,
  onUpdate,
}) => {
  // Animation for the timer text
  const textScale = useSharedValue(1);
  
  // Animate the text when it's close to zero
  useEffect(() => {
    if (remainingTime <= 3 && remainingTime > 0 && isRunning && !isPaused) {
      textScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [remainingTime, isRunning, isPaused, textScale]);
  
  // Animated style for the time text
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
    };
  });
  
  // Calculate color transitions based on time
  const colorTransition = (time: number) => {
    const normalizedTime = time / duration;
    
    if (normalizedTime > 0.66) return 0;
    if (normalizedTime > 0.33) return 1;
    if (normalizedTime > 0.15) return 2;
    return 3;
  };
  
  // Format the remaining time
  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
      return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    }
    
    return `${secs}`;
  };
  
  return (
    <View style={[styles.container, style]}>
      <CountdownCircleTimer
        key={`timer-${duration}-${isPaused ? 'paused' : 'running'}`}
        isPlaying={isRunning && !isPaused}
        duration={duration}
        initialRemainingTime={remainingTime}
        colors={colors}
        colorsTime={[duration * 0.66, duration * 0.33, duration * 0.15, 0]}
        strokeWidth={strokeWidth}
        size={size}
        trailColor={COLORS.timerBackground}
        onComplete={onComplete}
        onUpdate={(time) => onUpdate && onUpdate(time)}
      >
        {({ remainingTime: time }) => (
          <Animated.View style={[styles.timeTextContainer, animatedTextStyle]}>
            <Text style={[styles.timeText, time <= 3 && styles.urgentText]}>
              {formatRemainingTime(time)}
            </Text>
          </Animated.View>
        )}
      </CountdownCircleTimer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  urgentText: {
    color: COLORS.error,
  },
});

export default CircleTimer;
