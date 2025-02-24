import { Easing } from 'react-native-reanimated';

// Standard animation durations
export const DURATIONS = {
  veryFast: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Animation easing presets
export const EASINGS = {
  // Standard easings
  linear: Easing.linear,
  
  // Accelerate from 0
  easeIn: Easing.in(Easing.ease),
  easeInQuad: Easing.in(Easing.quad),
  easeInCubic: Easing.in(Easing.cubic),
  
  // Decelerate to 0
  easeOut: Easing.out(Easing.ease),
  easeOutQuad: Easing.out(Easing.quad),
  easeOutCubic: Easing.out(Easing.cubic),
  
  // Accelerate from 0, decelerate to 0
  easeInOut: Easing.inOut(Easing.ease),
  easeInOutQuad: Easing.inOut(Easing.quad),
  easeInOutCubic: Easing.inOut(Easing.cubic),
  
  // Custom bezier curves
  // Similar to iOS default animation curve
  iosBounce: Easing.bezier(0.17, 0.67, 0.23, 0.99),
  
  // Robinhood-like smooth animation
  smoothOut: Easing.bezier(0.25, 0.1, 0.25, 1),
};

// Animation configurations for common UI elements
export const ANIMATIONS = {
  // Button press
  buttonScale: {
    pressIn: {
      toValue: 0.96,
      duration: DURATIONS.veryFast,
      easing: EASINGS.easeOutQuad,
    },
    pressOut: {
      toValue: 1,
      duration: DURATIONS.fast,
      easing: EASINGS.smoothOut,
    },
  },
  
  // Screen transitions
  fadeIn: {
    from: 0,
    to: 1,
    duration: DURATIONS.normal,
    easing: EASINGS.easeOut,
  },
  
  fadeOut: {
    from: 1,
    to: 0,
    duration: DURATIONS.normal,
    easing: EASINGS.easeIn,
  },
  
  // Timer countdown emphasis
  timerEmphasis: {
    scale: {
      from: 1,
      to: 1.2,
      duration: DURATIONS.fast,
      easing: EASINGS.iosBounce,
    },
  },
  
  // Success animation
  success: {
    scale: {
      values: [1, 1.2, 1],
      durations: [DURATIONS.fast, DURATIONS.fast],
      easing: EASINGS.iosBounce,
    },
  },
};
