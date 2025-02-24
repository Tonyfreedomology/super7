import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
          elevation: 0, // for Android
          shadowOpacity: 0, // for iOS
          borderBottomWidth: 0, // for iOS
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: COLORS.background,
        },
        // Use fade transition for smoother experience
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Super7 Workout',
          headerRight: () => null,
        }}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          headerShown: false, // Hide header for the workout screen
          gestureEnabled: false, // Prevent swipe back during workout
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
