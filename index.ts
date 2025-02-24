// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds
}

// Workout Step (either an exercise or rest)
export interface WorkoutStep {
  id: string;
  type: 'exercise' | 'rest';
  name: string;
  description?: string;
  duration: number; // in seconds
}

// Complete workout plan
export interface WorkoutPlan {
  totalDuration: number; // in seconds
  steps: WorkoutStep[];
}

// Settings interface
export interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  keepScreenAwake: boolean;
  countdownBeeps: boolean;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Workout: {
    durationMinutes: number;
  };
  Settings: undefined;
};
