import { useState, useEffect, useRef, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { playBeepSound, playCountdownSound, playStartSound, playEndSound } from '../utils/sound';
import { lightHaptic, mediumHaptic, warningHaptic } from '../utils/haptics';

interface TimerHookProps {
  initialDuration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface TimerHookReturn {
  time: number;
  isRunning: boolean;
  isComplete: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newDuration?: number) => void;
  stop: () => void;
}

export function useTimer({
  initialDuration,
  onComplete,
  autoStart = false,
}: TimerHookProps): TimerHookReturn {
  const [time, setTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettings();
  
  // Calculate progress (0-1)
  const progress = 1 - time / initialDuration;
  
  // Clear the interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Start the timer
  const start = useCallback(() => {
    clearTimer();
    setIsRunning(true);
    setIsComplete(false);
    setTime(initialDuration);
    
    // Play start sound and haptic
    if (settings.soundEnabled) {
      playStartSound();
    }
    if (settings.hapticsEnabled) {
      lightHaptic();
    }
  }, [initialDuration, settings, clearTimer]);
  
  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  // Resume the timer
  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  // Reset the timer
  const reset = useCallback((newDuration?: number) => {
    clearTimer();
    setIsRunning(false);
    setIsComplete(false);
    setTime(newDuration ?? initialDuration);
  }, [initialDuration, clearTimer]);
  
  // Stop the timer
  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsComplete(true);
    setTime(0);
  }, [clearTimer]);
  
  // Handle countdown sounds and haptics
  useEffect(() => {
    if (!isRunning) return;
    
    if (settings.countdownBeeps && time <= 3 && time > 0) {
      // Play countdown sounds
      if (settings.soundEnabled) {
        playCountdownSound();
      }
      
      // Trigger haptic feedback
      if (settings.hapticsEnabled) {
        warningHaptic();
      }
    }
  }, [time, isRunning, settings]);
  
  // Set up the timer interval
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          // Timer is complete
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
          
          // Play end sound and haptic
          if (settings.soundEnabled) {
            playEndSound();
          }
          if (settings.hapticsEnabled) {
            mediumHaptic();
          }
          
          // Call the onComplete callback
          if (onComplete) {
            onComplete();
          }
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearTimer();
  }, [isRunning, onComplete, clearTimer, settings]);
  
  // Auto-start if specified
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => clearTimer();
  }, [autoStart, start, clearTimer]);
  
  return {
    time,
    isRunning,
    isComplete,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}
