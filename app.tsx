import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsProvider } from './src/context/SettingsContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <SettingsProvider>
            <WorkoutProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </WorkoutProvider>
          </SettingsProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
