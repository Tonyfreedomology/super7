import { Exercise } from '../types';

// Default exercise duration in seconds
export const DEFAULT_EXERCISE_DURATION = 30;
export const DEFAULT_REST_DURATION = 10;

// Standard 7-minute workout exercises
export const EXERCISES: Exercise[] = [
  {
    id: 'jumpingjacks',
    name: 'Jumping Jacks',
    description: 'Jump while raising your arms and separating your legs',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'wallsit',
    name: 'Wall Sit',
    description: 'Hold a sitting position with your back against a wall',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    description: 'Lower and raise your body using your arms',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'crunches',
    name: 'Abdominal Crunches',
    description: 'Curl your upper body towards your knees',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'stepups',
    name: 'Step-ups',
    description: 'Step up and down from a chair',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'squats',
    name: 'Squats',
    description: 'Lower your body by bending your knees',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'triceps',
    name: 'Tricep Dips',
    description: 'Lower and raise your body using a chair',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'plank',
    name: 'Plank',
    description: 'Hold a push-up position with your body straight',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'highknees',
    name: 'High Knees',
    description: 'Run in place raising your knees high',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'lunges',
    name: 'Lunges',
    description: 'Step forward and lower your body',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'pushuprotation',
    name: 'Push-up with Rotation',
    description: 'Do a push-up, then rotate and extend one arm upward',
    duration: DEFAULT_EXERCISE_DURATION,
  },
  {
    id: 'sideplank',
    name: 'Side Plank',
    description: 'Hold your body sideways off the ground',
    duration: DEFAULT_EXERCISE_DURATION,
  },
];

// The standard 7-minute workout takes approximately 7 minutes
// (12 exercises × 30 seconds each) + (11 rest periods × 10 seconds each) = 360 + 110 = 470 seconds
export const STANDARD_WORKOUT_DURATION = 470; // 7 minutes and 50 seconds
