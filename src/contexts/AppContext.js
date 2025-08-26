import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Safely import electron modules only if they exist
let ipcRenderer = null;
let electron = null;

try {
  if (typeof window !== 'undefined' && window.require) {
    electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
  }
} catch (error) {
  console.log('Electron not available in browser environment');
}

// Initial state
const initialState = {
  isRecording: false,
  isPaused: false,
  recordingDuration: 0,
  recordingPath: null,
  countdown: null,
  currentView: 'recorder', // recorder, editor, library, settings
  sidebarOpen: true,
  theme: 'dark',
  settings: {
    theme: 'dark',
    language: 'en',
    outputPath: '',
    quality: 'high',
    frameRate: 30,
    resolution: '1080p',
    audioEnabled: true,
    hotkeys: {
      startStop: 'CommandOrControl+Shift+R',
      pause: 'CommandOrControl+Shift+P',
      showHide: 'CommandOrControl+Shift+H'
    }
  },
  recordingOptions: {
    source: 'screen',
    audio: true,
    video: true,
    quality: 'high',
    frameRate: 30,
    resolution: '1080p',
    countdown: 0
  },
  recordings: [],
  selectedRecording: null,
  screens: [],
  windows: [],
  loading: {
    screens: false,
    windows: false,
    recording: false
  },
  error: null
};

// Action types
const ACTIONS = {
  SET_RECORDING_STATUS: 'SET_RECORDING_STATUS',
  SET_PAUSED_STATUS: 'SET_PAUSED_STATUS',
  SET_RECORDING_DURATION: 'SET_RECORDING_DURATION',
  SET_RECORDING_PATH: 'SET_RECORDING_PATH',
  SET_COUNTDOWN: 'SET_COUNTDOWN',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_RECORDING_OPTIONS: 'UPDATE_RECORDING_OPTIONS',
  SET_RECORDINGS: 'SET_RECORDINGS',
  SET_SELECTED_RECORDING: 'SET_SELECTED_RECORDING',
  SET_SCREENS: 'SET_SCREENS',
  SET_WINDOWS: 'SET_WINDOWS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_RECORDING_STATUS:
      return { ...state, isRecording: action.payload };
    
    case ACTIONS.SET_PAUSED_STATUS:
      return { ...state, isPaused: action.payload };
    
    case ACTIONS.SET_RECORDING_DURATION:
      return { ...state, recordingDuration: action.payload };
    
    case ACTIONS.SET_RECORDING_PATH:
      return { ...state, recordingPath: action.payload };
    
    case ACTIONS.SET_COUNTDOWN:
      return { ...state, countdown: action.payload };
    
    case ACTIONS.SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload };
    
    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    case ACTIONS.UPDATE_RECORDING_OPTIONS:
      return { ...state, recordingOptions: { ...state.recordingOptions, ...action.payload } };
    
    case ACTIONS.SET_RECORDINGS:
      return { ...state, recordings: action.payload };
    
    case ACTIONS.SET_SELECTED_RECORDING:
      return { ...state, selectedRecording: action.payload };
    
    case ACTIONS.SET_SCREENS:
      return { ...state, screens: action.payload };
    
    case ACTIONS.SET_WINDOWS:
      return { ...state, windows: action.payload };
    
    case ACTIONS.SET_LOADING:
      return { ...state, loading: { ...state.loading, ...action.payload } };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions object
  const actions = {
    setRecordingStatus: (status) => dispatch({ type: ACTIONS.SET_RECORDING_STATUS, payload: status }),
    setPausedStatus: (status) => dispatch({ type: ACTIONS.SET_PAUSED_STATUS, payload: status }),
    setRecordingDuration: (duration) => dispatch({ type: ACTIONS.SET_RECORDING_DURATION, payload: duration }),
    setRecordingPath: (path) => dispatch({ type: ACTIONS.SET_RECORDING_PATH, payload: path }),
    setCountdown: (countdown) => dispatch({ type: ACTIONS.SET_COUNTDOWN, payload: countdown }),
    setCurrentView: (view) => dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: view }),
    toggleSidebar: () => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR }),
    setTheme: (theme) => dispatch({ type: ACTIONS.SET_THEME, payload: theme }),
    updateSettings: (settings) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings }),
    updateRecordingOptions: (options) => dispatch({ type: ACTIONS.UPDATE_RECORDING_OPTIONS, payload: options }),
    setRecordings: (recordings) => dispatch({ type: ACTIONS.SET_RECORDINGS, payload: recordings }),
    setSelectedRecording: (recording) => dispatch({ type: ACTIONS.SET_SELECTED_RECORDING, payload: recording }),
    setScreens: (screens) => dispatch({ type: ACTIONS.SET_SCREENS, payload: screens }),
    setWindows: (windows) => dispatch({ type: ACTIONS.SET_WINDOWS, payload: windows }),
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),

    // Electron-specific actions
    startRecording: async (options = {}) => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        actions.setLoading({ recording: true });
        const result = await ipcRenderer.invoke('start-recording', options);
        actions.setLoading({ recording: false });
        return result;
      } catch (error) {
        actions.setLoading({ recording: false });
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    stopRecording: async () => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        const result = await ipcRenderer.invoke('stop-recording');
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    getScreens: async () => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ screens: true });
        const screens = await ipcRenderer.invoke('get-screens');
        actions.setScreens(screens);
        actions.setLoading({ screens: false });
        return screens;
      } catch (error) {
        actions.setLoading({ screens: false });
        actions.setError(error.message);
        return [];
      }
    },

    getWindows: async () => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ windows: true });
        const windows = await ipcRenderer.invoke('get-windows');
        actions.setWindows(windows);
        actions.setLoading({ windows: false });
        return windows;
      } catch (error) {
        actions.setLoading({ windows: false });
        actions.setError(error.message);
        return [];
      }
    },

    getSettings: async () => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return state.settings;
      }
      
      try {
        const settings = await ipcRenderer.invoke('get-settings');
        actions.updateSettings(settings);
        return settings;
      } catch (error) {
        actions.setError(error.message);
        return state.settings;
      }
    },

    saveSettings: async (settings) => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        actions.updateSettings(settings);
        return { success: true };
      }
      
      try {
        const result = await ipcRenderer.invoke('save-settings', settings);
        if (result.success) {
          actions.updateSettings(settings);
        }
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    selectOutputPath: async () => {
      if (!ipcRenderer) {
        console.log('Electron not available');
        return null;
      }
      
      try {
        const path = await ipcRenderer.invoke('select-output-path');
        if (path) {
          actions.updateSettings({ outputPath: path });
        }
        return path;
      } catch (error) {
        actions.setError(error.message);
        return null;
      }
    }
  };

  // Listen for IPC events from main process
  useEffect(() => {
    if (!ipcRenderer) return;

    const handleRecordingStarted = (event, data) => {
      actions.setRecordingStatus(true);
      actions.setRecordingPath(data.path);
      actions.setRecordingDuration(0);
    };

    const handleRecordingStopped = (event, data) => {
      actions.setRecordingStatus(false);
      actions.setRecordingPath(null);
      actions.setRecordingDuration(0);
    };

    const handleRecordingTimer = (event, duration) => {
      actions.setRecordingDuration(duration);
    };

    const handleCountdown = (event, count) => {
      actions.setCountdown(count);
    };

    const handleTogglePause = () => {
      actions.setPausedStatus(!state.isPaused);
    };

    // Add event listeners
    ipcRenderer.on('recording-started', handleRecordingStarted);
    ipcRenderer.on('recording-stopped', handleRecordingStopped);
    ipcRenderer.on('recording-timer', handleRecordingTimer);
    ipcRenderer.on('countdown', handleCountdown);
    ipcRenderer.on('toggle-pause', handleTogglePause);

    // Cleanup
    return () => {
      ipcRenderer.removeListener('recording-started', handleRecordingStarted);
      ipcRenderer.removeListener('recording-stopped', handleRecordingStopped);
      ipcRenderer.removeListener('recording-timer', handleRecordingTimer);
      ipcRenderer.removeListener('countdown', handleCountdown);
      ipcRenderer.removeListener('toggle-pause', handleTogglePause);
    };
  }, [state.isPaused]);

  // Load initial settings
  useEffect(() => {
    actions.getSettings();
  }, []);

  return (
    <AppContext.Provider value={{ ...state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
