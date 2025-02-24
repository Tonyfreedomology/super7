import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';
import Button from '../components/Button';
import TimeInput from '../components/TimeInput';
import { lightHaptic } from '../utils/haptics';
import { useSettings } from '../context/SettingsContext';
import { useWorkout } from '../context/WorkoutContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [durationMinutes, setDurationMinutes] = useState(7);
  const { createWorkout } = useWorkout();
  const { settings } = useSettings();
  
  // Handle start workout button press
  const handleStartWorkout = () => {
    // Create a new workout with the selected duration
    createWorkout(durationMinutes);
    
    // Navigate to the workout screen
    navigation.navigate('Workout', { durationMinutes });
  };
  
  // Handle settings button press
  const handleSettingsPress = () => {
    if (settings.hapticsEnabled) {
      lightHaptic();
    }
    navigation.navigate('Settings');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>Super7</Text>
        <Text style={styles.appTagline}>Workouts that fit your schedule</Text>
      </View>
      
      <View style={styles.content}>
        <TimeInput
          initialValue={durationMinutes}
          min={1}
          max={60}
          onValueChange={setDurationMinutes}
          style={styles.timeInput}
        />
        
        <Button
          title="Start Workout"
          variant="primary"
          size="large"
          fullWidth
          style={styles.startButton}
          onPress={handleStartWorkout}
        />
      </View>
      
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  timeInput: {
    marginBottom: 40,
  },
  startButton: {
    marginBottom: 24,
  },
  settingsButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingsText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default HomeScreen;
