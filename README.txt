# Super7 Workout App

Super7 is a minimalist workout app that generates customized workout routines based on the time you have available. It features a premium UI with smooth animations, offline functionality, and a focus on user experience.

## Features

- **Time-Based Workouts**: Enter how many minutes you have, and get a perfectly timed workout
- **Premium Animations**: Smooth, Robinhood-inspired UI with fluid transitions
- **Offline-First**: Works without internet, all content is built-in
- **Sound & Haptics**: Audio and vibration cues guide you through exercises
- **Minimalist Design**: Clean, distraction-free interface focused on the workout

## Technology Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and library ecosystem
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation
- **Reanimated 2**: High-performance animations
- **AsyncStorage**: Local data persistence
- **React Native Countdown Circle Timer**: Animated circular timer
- **Expo AV**: Audio playback
- **Expo Haptics**: Vibration feedback
- **Context API**: State management

## Project Structure

```
super7-app/
├── App.tsx                  # Entry point
├── assets/                  # Static assets (sounds, images)
└── src/
    ├── components/          # Reusable UI components
    ├── screens/             # App screens
    ├── navigation/          # Navigation setup
    ├── context/             # App state management
    ├── utils/               # Utility functions
    ├── hooks/               # Custom React hooks
    ├── constants/           # App constants
    └── types/               # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js (>= 12.x)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/super7-app.git
   cd super7-app
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   expo start
   ```

4. Run on your device:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Press 'a' for Android emulator or 'i' for iOS simulator

## Development

### Adding New Exercises

To add new exercises, modify the `src/constants/exercises.ts` file:

```typescript
export const EXERCISES: Exercise[] = [
  // Existing exercises
  // ...
  
  // New exercise
  {
    id: 'newexercise',
    name: 'New Exercise Name',
    description: 'Description of the exercise',
    duration: DEFAULT_EXERCISE_DURATION,
  },
];
```

### Customizing the UI

The app's color scheme can be modified in `src/constants/colors.ts`.

### Building for Production

To create a production build:

```
expo build:android
# or
expo build:ios
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Scientific 7-Minute Workout (ACSM's Health & Fitness Journal)
- Inspired by Robinhood's premium UI/UX design
