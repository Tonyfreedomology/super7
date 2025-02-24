import React, { createContext, useState, useContext } from 'react';
import { WorkoutPlan, WorkoutStep } from '../types';
import { generateWorkoutPlan } from '../utils/workout';

// Workout state interface
interface WorkoutState {
  workoutPlan: WorkoutPlan | null;
  currentStepIndex: number;
  isActive: boolean;
  isPaused: boolean;
  isComplete: boolean;
  remainingTime: number;
  elapsedTime: number;
}

// Initial workout state
const initialWorkoutState: WorkoutState = {
  workoutPlan: null,
  currentStepIndex: 0,
  isActive: false,
  isPaused: false,
  isComplete: false,
  remainingTime: 0,
  elapsedTime: 0,
};

// Context type definition
type WorkoutContextType = {
  workoutState: WorkoutState;
  createWorkout: (durationMinutes: number) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  skipStep: () => void;
  restartWorkout: () => void;
  endWorkout: () => void;
  updateRemainingTime: (time: number) => void;
  completeStep: () => void;
  getCurrentStep: () => WorkoutStep | null;
};

// Create the context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider component
export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(initialWorkoutState);

  // Create a new workout plan
  const createWorkout = (durationMinutes: number) => {
    const workoutPlan = generateWorkoutPlan(durationMinutes);
    
    setWorkoutState({
      ...initialWorkoutState,
      workoutPlan,
      remainingTime: workoutPlan.steps.length > 0 ? workoutPlan.steps[0].duration : 0,
    });
  };

  // Start the workout
  const startWorkout = () => {
    setWorkoutState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
    }));
  };

  // Pause the workout
  const pauseWorkout = () => {
    setWorkoutState(prev => ({
      ...prev,
      isPaused: true,
    }));
  };

  // Resume the workout
  const resumeWorkout = () => {
    setWorkoutState(prev => ({
      ...prev,
      isPaused: false,
    }));
  };

  // Skip to the next step
  const skipStep = () => {
    if (!workoutState.workoutPlan) return;
    
    const nextStepIndex = workoutState.currentStepIndex + 1;
    
    if (nextStepIndex >= workoutState.workoutPlan.steps.length) {
      // If there's no next step, complete the workout
      setWorkoutState(prev => ({
        ...prev,
        isActive: false,
        isComplete: true,
      }));
      return;
    }
    
    // Move to the next step
    setWorkoutState(prev => ({
      ...prev,
      currentStepIndex: nextStepIndex,
      remainingTime: prev.workoutPlan?.steps[nextStepIndex].duration || 0,
    }));
  };

  // Restart the current workout
  const restartWorkout = () => {
    if (!workoutState.workoutPlan) return;
    
    setWorkoutState(prev => ({
      ...prev,
      currentStepIndex: 0,
      isActive: true,
      isPaused: false,
      isComplete: false,
      remainingTime: prev.workoutPlan?.steps[0].duration || 0,
      elapsedTime: 0,
    }));
  };

  // End the workout early
  const endWorkout = () => {
    setWorkoutState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      isComplete: true,
    }));
  };

  // Update the remaining time for the current step
  const updateRemainingTime = (time: number) => {
    setWorkoutState(prev => ({
      ...prev,
      remainingTime: time,
      elapsedTime: prev.elapsedTime + 1,
    }));
  };

  // Complete the current step and move to the next
  const completeStep = () => {
    skipStep();
  };

  // Get the current step
  const getCurrentStep = (): WorkoutStep | null => {
    if (!workoutState.workoutPlan) return null;
    if (workoutState.currentStepIndex >= workoutState.workoutPlan.steps.length) return null;
    
    return workoutState.workoutPlan.steps[workoutState.currentStepIndex];
  };

  return (
    <WorkoutContext.Provider
      value={{
        workoutState,
        createWorkout,
        startWorkout,
        pauseWorkout,
        resumeWorkout,
        skipStep,
        restartWorkout,
        endWorkout,
        updateRemainingTime,
        completeStep,
        getCurrentStep,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use workout context
export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
