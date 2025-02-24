import { Exercise, WorkoutPlan, WorkoutStep } from '../types';
import { EXERCISES, DEFAULT_REST_DURATION, STANDARD_WORKOUT_DURATION } from '../constants/exercises';

/**
 * Generates a workout plan based on available duration in minutes
 * @param durationMinutes Total workout duration in minutes
 * @returns A workout plan with exercise and rest steps
 */
export function generateWorkoutPlan(durationMinutes: number): WorkoutPlan {
  const totalSeconds = Math.round(durationMinutes * 60);
  
  // Handle special cases
  if (totalSeconds <= 0) {
    return { totalDuration: 0, steps: [] };
  }
  
  // Calculate how many complete circuits we can fit
  const circuitCount = Math.max(1, Math.floor(totalSeconds / STANDARD_WORKOUT_DURATION));
  
  // Calculate if we need to adjust exercise durations to fit the time better
  let exerciseDuration = 30; // Default
  let restDuration = 10; // Default
  
  // If we have more time than a standard circuit but not enough for two,
  // we can extend the exercise duration
  if (circuitCount === 1 && totalSeconds > STANDARD_WORKOUT_DURATION) {
    const extraTime = totalSeconds - STANDARD_WORKOUT_DURATION;
    // Add extra time to exercises proportionally
    const extraPerExercise = Math.floor(extraTime / EXERCISES.length);
    if (extraPerExercise > 0) {
      exerciseDuration += extraPerExercise;
    }
  }
  
  // Create the workout steps
  const steps: WorkoutStep[] = [];
  let currentDuration = 0;
  
  // Build the workout with multiple circuits if necessary
  for (let circuit = 0; circuit < circuitCount; circuit++) {
    // If this isn't the first circuit, consider adding a longer rest between circuits
    if (circuit > 0) {
      const betweenCircuitRest: WorkoutStep = {
        id: `rest-between-circuit-${circuit}`,
        type: 'rest',
        name: 'Circuit Rest',
        duration: 30, // Longer rest between circuits
      };
      steps.push(betweenCircuitRest);
      currentDuration += betweenCircuitRest.duration;
    }
    
    // Add each exercise and rest in the circuit
    EXERCISES.forEach((exercise, index) => {
      // Add the exercise
      const exerciseStep: WorkoutStep = {
        id: `${exercise.id}-${circuit}`,
        type: 'exercise',
        name: exercise.name,
        description: exercise.description,
        duration: exerciseDuration,
      };
      steps.push(exerciseStep);
      currentDuration += exerciseStep.duration;
      
      // Add rest after each exercise (except the last one in the circuit)
      if (index < EXERCISES.length - 1) {
        const restStep: WorkoutStep = {
          id: `rest-${exercise.id}-${circuit}`,
          type: 'rest',
          name: 'Rest',
          duration: restDuration,
        };
        steps.push(restStep);
        currentDuration += restStep.duration;
      }
      
      // If we've exceeded the requested duration, stop adding steps
      if (currentDuration >= totalSeconds) {
        return {
          totalDuration: currentDuration,
          steps: steps,
        };
      }
    });
  }
  
  // If we've gone through all circuits and still have time, add a cooldown
  if (currentDuration < totalSeconds) {
    const remainingTime = totalSeconds - currentDuration;
    if (remainingTime >= 30) {
      const cooldownStep: WorkoutStep = {
        id: 'cooldown',
        type: 'rest',
        name: 'Cooldown',
        duration: remainingTime,
      };
      steps.push(cooldownStep);
      currentDuration += remainingTime;
    }
  }
  
  return {
    totalDuration: currentDuration,
    steps: steps,
  };
}

/**
 * Formats seconds into mm:ss format
 * @param seconds Number of seconds
 * @returns Formatted time string (mm:ss)
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates progress percentage through workout
 * @param currentStepIndex Index of current step
 * @param totalSteps Total number of steps
 * @param stepDuration Duration of current step
 * @param remainingTime Remaining time in current step
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  currentStepIndex: number,
  totalSteps: number,
  stepDuration: number,
  remainingTime: number
): number {
  // Calculate step progress
  const stepProgress = (stepDuration - remainingTime) / stepDuration;
  
  // Calculate overall progress including completed steps
  const overallProgress = (currentStepIndex + stepProgress) / totalSteps;
  
  return overallProgress * 100;
}
