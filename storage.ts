import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key prefixes
const STORAGE_KEY_PREFIX = 'super7:';

/**
 * Save data to AsyncStorage
 * @param key Storage key (will be prefixed)
 * @param data Data to store (will be JSON stringified)
 */
export async function storeData(key: string, data: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

/**
 * Retrieve data from AsyncStorage
 * @param key Storage key (will be prefixed)
 * @returns Parsed data or null if not found
 */
export async function getData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

/**
 * Remove data from AsyncStorage
 * @param key Storage key (will be prefixed)
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}

/**
 * Clear all app data from AsyncStorage
 */
export async function clearAllData(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

/**
 * Save last workout duration to use as default next time
 * @param durationMinutes Duration in minutes
 */
export async function saveLastWorkoutDuration(durationMinutes: number): Promise<void> {
  await storeData('lastWorkoutDuration', durationMinutes);
}

/**
 * Get last workout duration
 * @returns Last workout duration in minutes or null if not found
 */
export async function getLastWorkoutDuration(): Promise<number | null> {
  return getData<number>('lastWorkoutDuration');
}

/**
 * Save workout history (could be expanded in future versions)
 * @param workoutData Workout data to save
 */
export async function saveWorkoutHistory(workoutData: any): Promise<void> {
  try {
    // Get existing history
    const history = await getData<any[]>('workoutHistory') || [];
    
    // Add new workout with timestamp
    const workoutWithTimestamp = {
      ...workoutData,
      timestamp: new Date().toISOString(),
    };
    
    // Add to history (keep most recent 10 workouts)
    const updatedHistory = [workoutWithTimestamp, ...history].slice(0, 10);
    
    // Save updated history
    await storeData('workoutHistory', updatedHistory);
  } catch (error) {
    console.error('Error saving workout history:', error);
    throw error;
  }
}

/**
 * Get workout history
 * @returns Array of workout history items
 */
export async function getWorkoutHistory(): Promise<any[]> {
  return getData<any[]>('workoutHistory') || [];
}
