import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useSettings } from '../context/SettingsContext';
import { lightHaptic } from '../utils/haptics';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  
  // Handle toggle changes
  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    if (settings.hapticsEnabled) {
      lightHaptic();
    }
    updateSettings({ [key]: value });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {/* Sound toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds during your workout
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => handleToggle('soundEnabled', value)}
              trackColor={{ false: '#E1E8FF', true: COLORS.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E1E8FF"
            />
          </View>
          
          {/* Haptic toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>
                Vibrate phone during transitions
              </Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(value) => handleToggle('hapticsEnabled', value)}
              trackColor={{ false: '#E1E8FF', true: COLORS.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E1E8FF"
            />
          </View>
          
          {/* Keep screen awake toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Keep Screen Awake</Text>
              <Text style={styles.settingDescription}>
                Prevent screen from sleeping during workout
              </Text>
            </View>
            <Switch
              value={settings.keepScreenAwake}
              onValueChange={(value) => handleToggle('keepScreenAwake', value)}
              trackColor={{ false: '#E1E8FF', true: COLORS.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E1E8FF"
            />
          </View>
          
          {/* Countdown beeps toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Countdown Beeps</Text>
              <Text style={styles.settingDescription}>
                Play beeps during the last 3 seconds
              </Text>
            </View>
            <Switch
              value={settings.countdownBeeps}
              onValueChange={(value) => handleToggle('countdownBeeps', value)}
              trackColor={{ false: '#E1E8FF', true: COLORS.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E1E8FF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Super7 Workout</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              A minimalist workout app that adapts to your schedule.
              Super7 generates the perfect workout based on the time you have available.
            </Text>
            
            <View style={styles.creditContainer}>
              <Text style={styles.creditText}>
                Based on the scientific seven-minute workout routine.
              </Text>
              <Text style={styles.creditText}>
                No equipment needed, just you and your determination.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  aboutContainer: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  creditContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  creditText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
});

export default SettingsScreen;
