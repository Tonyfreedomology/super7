import { Audio } from 'expo-av';

// Sound objects
let startSound: Audio.Sound | null = null;
let endSound: Audio.Sound | null = null;
let countdownSound: Audio.Sound | null = null;
let beepSound: Audio.Sound | null = null;
let finishSound: Audio.Sound | null = null;

/**
 * Preload all sound effects for faster playback
 */
export async function loadSounds() {
  try {
    // Unload any existing sounds first to prevent memory leaks
    await unloadSounds();
    
    // Create and load sound objects
    const { sound: start } = await Audio.Sound.createAsync(
      require('../../assets/sounds/start.mp3')
    );
    startSound = start;
    
    const { sound: end } = await Audio.Sound.createAsync(
      require('../../assets/sounds/end.mp3')
    );
    endSound = end;
    
    const { sound: countdown } = await Audio.Sound.createAsync(
      require('../../assets/sounds/countdown.mp3')
    );
    countdownSound = countdown;
    
    const { sound: beep } = await Audio.Sound.createAsync(
      require('../../assets/sounds/beep.mp3')
    );
    beepSound = beep;
    
    const { sound: finish } = await Audio.Sound.createAsync(
      require('../../assets/sounds/finish.mp3')
    );
    finishSound = finish;
    
    // Configure audio mode for playback in silent mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  } catch (error) {
    console.error('Failed to load sounds', error);
  }
}

/**
 * Unload all sounds to free up memory
 */
export async function unloadSounds() {
  try {
    if (startSound) {
      await startSound.unloadAsync();
      startSound = null;
    }
    if (endSound) {
      await endSound.unloadAsync();
      endSound = null;
    }
    if (countdownSound) {
      await countdownSound.unloadAsync();
      countdownSound = null;
    }
    if (beepSound) {
      await beepSound.unloadAsync();
      beepSound = null;
    }
    if (finishSound) {
      await finishSound.unloadAsync();
      finishSound = null;
    }
  } catch (error) {
    console.error('Failed to unload sounds', error);
  }
}

/**
 * Play start exercise sound
 */
export async function playStartSound() {
  try {
    if (startSound) {
      await startSound.setPositionAsync(0);
      await startSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play start sound', error);
  }
}

/**
 * Play end exercise sound
 */
export async function playEndSound() {
  try {
    if (endSound) {
      await endSound.setPositionAsync(0);
      await endSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play end sound', error);
  }
}

/**
 * Play countdown beep (for 3-2-1 countdown)
 */
export async function playCountdownSound() {
  try {
    if (countdownSound) {
      await countdownSound.setPositionAsync(0);
      await countdownSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play countdown sound', error);
  }
}

/**
 * Play single beep sound
 */
export async function playBeepSound() {
  try {
    if (beepSound) {
      await beepSound.setPositionAsync(0);
      await beepSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play beep sound', error);
  }
}

/**
 * Play workout finish sound
 */
export async function playFinishSound() {
  try {
    if (finishSound) {
      await finishSound.setPositionAsync(0);
      await finishSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play finish sound', error);
  }
}
