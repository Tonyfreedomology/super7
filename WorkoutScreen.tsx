import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, BackHandler, StatusBar, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';
import CircleTimer from '../components/CircleTimer';
import ExerciseCard from '../components/ExerciseCard';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { useWorkout } from '../context/WorkoutContext';
import { useSettings } from '../context/SettingsContext';
import { useTimer } from '../hooks/useTimer';
import { formatTime, calculateProgress } from '../utils/workout';
import { loadSounds, unloadSounds, playStartSound, playFinishSound } from '../utils/sound';
import { mediumHaptic, successHaptic } from '../utils/haptics';

type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;
type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'Workout'>;

interface WorkoutScreenProps {
  navigation: WorkoutScreenNavigationProp;
  route: WorkoutScreenRouteProp;
}

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ navigation, route }) => {
  // Keep screen awake during workout
  useKeepAwake();
  
  // Get the workout duration from the route params
  const { durationMinutes } = route.params;
  
  // Get workout state and functions
  const {
    workoutState,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    completeStep,
    skipStep,
    getCurrentStep,
    endWorkout,
  } = useWorkout();
  
  // Get settings
  const { settings } = useSettings();
  
  // Local state for the current step
  const [currentStep, setCurrentStep] = useState(getCurrentStep());
  
  // Animation scale for actions container
  const actionsScale = useSharedValue(1);
  
  // Set up the timer
  const {
    time: remainingTime,
    isRunning,
    isComplete,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
  } = useTimer({
    initialDuration: currentStep?.duration || 0,
    onComplete: handleStepComplete,
    autoStart: false,
  });
  
  // Calculate the overall workout progress
  const calculateWorkoutProgress = (): number => {
    if (!workoutState.workoutPlan) return 0;
    
    return calculateProgress(
      workoutState.currentStepIndex,
      workoutState.workoutPlan.steps.length,
      currentStep?.duration || 0,
      remainingTime,
    );
  };
  
  // Handle step completion
  function handleStepComplete() {
    // Complete the current step and move to the next
    completeStep();
  }
  
  // Handle workout completion
  const handleWorkoutComplete = () => {
    if (settings.soundEnabled) {
      playFinishSound();
    }
    
    if (settings.hapticsEnabled) {
      successHaptic();
    }
  };
  
  // Start the workout
  const handleStartWorkout = () => {
    startWorkout();
    start();
    
    // Animate actions container
    actionsScale.value = withTiming(0.9, { duration: 200 }, () => {
      actionsScale.value = withTiming(1, { duration: 200 });
    });
  };
  
  // Pause the workout
  const handlePauseWorkout = () => {
    pauseWorkout();
    pause();
  };
  
  // Resume the workout
  const handleResumeWorkout = () => {
    resumeWorkout();
    resume();
  };
  
  // Skip to the next step
  const handleSkipStep = () => {
    skipStep();
    // The timer will reset in the useEffect below
  };
  
  // End the workout and go back
  const handleEndWorkout = () => {
    endWorkout();
    stop();
    navigation.goBack();
  };
  
  // Load sounds on mount
  useEffect(() => {
    if (settings.soundEnabled) {
      loadSounds();
    }
    
    return () => {
      if (settings.soundEnabled) {
        unloadSounds();
      }
    };
  }, [settings.soundEnabled]);
  
  // Update the current step when the workout state changes
  useEffect(() => {
    const newCurrentStep = getCurrentStep();
    setCurrentStep(newCurrentStep);
    
    // Reset the timer with the new step duration
    if (newCurrentStep) {
      reset(newCurrentStep.duration);
      
      if (workoutState.isActive && !workoutState.isPaused) {
        start();
      }
    } else if (workoutState.isComplete) {
      // Workout is complete
      handleWorkoutComplete();
    }
  }, [workoutState.currentStepIndex, workoutState.isComplete]);
  
  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Show confirmation dialog if workout is active
      if (workoutState.isActive && !workoutState.isComplete) {
        handlePauseWorkout();
        // Return true to prevent default back behavior
        return true;
      }
      return false;
    });
    
    return () => backHandler.remove();
  }, [workoutState.isActive, workoutState.isComplete]);
  
  // Animated style for actions container
  const animatedActionsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: actionsScale.value }],
    };
  });
  
  // Render the workout content
  const renderWorkoutContent = () => {
    if (!currentStep) {
      return (
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Workout Complete!</Text>
          <Text style={styles.completedMessage}>
            Great job! You completed a {durationMinutes}-minute workout.
          </Text>
          <Button
            title="Back to Home"
            variant="primary"
            size="large"
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          />
        </View>
      );
    }
    
    return (
      <View style={styles.workoutContainer}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={calculateWorkoutProgress()}
            currentStep={workoutState.currentStepIndex + 1}
            totalSteps={workoutState.workoutPlan?.steps.length || 0}
          />
        </View>
        
        {/* Exercise card */}
        <ExerciseCard
          step={currentStep}
          isActive={workoutState.isActive && !workoutState.isPaused}
          style={styles.exerciseCard}
        />
        
        {/* Timer */}
        <View style={styles.timerContainer}>
          <CircleTimer
            duration={currentStep.duration}
            remainingTime={remainingTime}
            isRunning={isRunning}
            isPaused={workoutState.isPaused}
            size={260}
            strokeWidth={16}
            onComplete={completeStep}
          />
        </View>
        
        {/* Workout controls */}
        <Animated.View style={[styles.actionsContainer, animatedActionsStyle]}>
          {!workoutState.isActive ? (
            <Button
              title="Start"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleStartWorkout}
            />
          ) : (
            <>
              {workoutState.isPaused ? (
                <Button
                  title="Resume"
                  variant="primary"
                  size="large"
                  fullWidth
                  onPress={handleResumeWorkout}
                />
              ) : (
                <Button
                  title="Pause"
                  variant="outline"
                  size="large"
                  fullWidth
                  onPress={handlePauseWorkout}
                />
              )}
              
              <View style={styles.secondaryActionsContainer}>
                <Button
                  title="Skip"
                  variant="text"
                  size="medium"
                  style={styles.secondaryButton}
                  onPress={handleSkipStep}
                />
                
                <Button
                  title="End Workout"
                  variant="text"
                  size="medium"
                  style={styles.secondaryButton}
                  onPress={handleEndWorkout}
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (workoutState.isActive && !workoutState.isComplete) {
            handlePauseWorkout();
          } else {
            navigation.goBack();
          }
        }}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      {renderWorkoutContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  workoutContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  exerciseCard: {
    marginBottom: 32,
    alignSelf: 'stretch',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  actionsContainer: {
    marginTop: 'auto',
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 16,
    textAlign: 'center',
  },
  completedMessage: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  doneButton: {
    marginTop: 24,
    minWidth: 240,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default WorkoutScreen;
