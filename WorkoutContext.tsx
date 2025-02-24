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
  createWorkout: (
