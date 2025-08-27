import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Safely import electron modules only if they exist
let ipcInvoke = null;
let ipcOn = null;

try {
  if (typeof window !== 'undefined' && window.api) {
    ipcInvoke = window.api.invoke;
    ipcOn = window.api.on;
  }
} catch (error) {
  console.log('Electron preload bridge not available in browser environment');
}

// Initial state
const initialState = {
  isRecording: false,
  isPaused: false,
  recordingDuration: 0,
  recordingPath: null,
  lastCompletedPath: null,
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
    countdown: 0,
    // new options
    preferredCodec: 'auto',
    professionalCodec: true,
    systemAudioDevice: undefined,
    microphoneDevice: undefined,
    separateAudioTracks: false,
    webcamEnabled: false,
    webcamDevice: undefined,
    webcamScale: 0.25,
    webcamPosition: 'top-right'
  },
  recordings: [],
  selectedRecording: null,
  recentRecordings: [],
  projects: [],
  screens: [],
  windows: [],
  loading: {
    screens: false,
    windows: false,
    recording: false
  },
  error: null,
  recordingProgress: null,
  successMessage: null
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
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_RECORDING_PROGRESS: 'SET_RECORDING_PROGRESS',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_SUCCESS_MESSAGE: 'CLEAR_SUCCESS_MESSAGE'
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
    
    case ACTIONS.SET_RECORDING_PROGRESS:
      return { ...state, recordingProgress: action.payload };
    
    case ACTIONS.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    
    case ACTIONS.CLEAR_SUCCESS_MESSAGE:
      return { ...state, successMessage: null };
    
    case 'SET_LAST_COMPLETED_PATH':
      return { ...state, lastCompletedPath: action.payload };
    
    case 'SET_RECENT_RECORDINGS':
      return { ...state, recentRecordings: action.payload };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    
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
    setRecordingProgress: (progress) => dispatch({ type: ACTIONS.SET_RECORDING_PROGRESS, payload: progress }),
    setSuccessMessage: (message) => dispatch({ type: ACTIONS.SET_SUCCESS_MESSAGE, payload: message }),
    clearSuccessMessage: () => dispatch({ type: ACTIONS.CLEAR_SUCCESS_MESSAGE }),
    setLastCompletedPath: (p) => dispatch({ type: 'SET_LAST_COMPLETED_PATH', payload: p }),
    setRecentRecordings: (list) => dispatch({ type: 'SET_RECENT_RECORDINGS', payload: list }),
    setProjects: (list) => dispatch({ type: 'SET_PROJECTS', payload: list }),

    // Electron-specific actions
    startRecording: async (options = {}) => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        actions.setLoading({ recording: true });
        const result = await ipcInvoke('start-recording', options);
        actions.setLoading({ recording: false });
        return result;
      } catch (error) {
        actions.setLoading({ recording: false });
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    stopRecording: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        const result = await ipcInvoke('stop-recording');
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },
    pauseRecording: async () => {
      if (!ipcInvoke) return { success: false, error: 'Electron not available' };
      try {
        return await ipcInvoke('pause-recording');
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    resumeRecording: async (options = {}) => {
      if (!ipcInvoke) return { success: false, error: 'Electron not available' };
      try {
        return await ipcInvoke('resume-recording', options);
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    finalizeRecording: async () => {
      if (!ipcInvoke) return { success: false, error: 'Electron not available' };
      try {
        return await ipcInvoke('finalize-recording');
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    getScreens: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ screens: true });
        const screens = await ipcInvoke('get-screens');
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
      if (!ipcInvoke) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ windows: true });
        const windows = await ipcInvoke('get-windows');
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
      if (!ipcInvoke) {
        console.log('Electron not available');
        return state.settings;
      }
      
      try {
        const settings = await ipcInvoke('get-settings');
        actions.updateSettings(settings);
        return settings;
      } catch (error) {
        actions.setError(error.message);
        return state.settings;
      }
    },

    saveSettings: async (settings) => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        actions.updateSettings(settings);
        return { success: true };
      }
      
      try {
        const result = await ipcInvoke('save-settings', settings);
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
      if (!ipcInvoke) {
        console.log('Electron not available');
        return null;
      }
      
      try {
        const path = await ipcInvoke('select-output-path');
        if (path) {
          actions.updateSettings({ outputPath: path });
        }
        return path;
      } catch (error) {
        actions.setError(error.message);
        return null;
      }
    },

    refreshScreens: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ screens: true });
        const screens = await ipcInvoke('get-screens');
        actions.setScreens(screens);
        actions.setLoading({ screens: false });
        return screens;
      } catch (error) {
        actions.setLoading({ screens: false });
        actions.setError(error.message);
        return [];
      }
    },

    refreshWindows: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return [];
      }
      
      try {
        actions.setLoading({ windows: true });
        const windows = await ipcInvoke('get-windows');
        actions.setWindows(windows);
        actions.setLoading({ windows: false });
        return windows;
      } catch (error) {
        actions.setLoading({ windows: false });
        actions.setError(error.message);
        return [];
      }
    },

    openRecordingFolder: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        const result = await ipcInvoke('open-recording-folder');
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    getRecordingInfo: async (filePath) => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        const result = await ipcInvoke('get-recording-info', filePath);
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    listAudioDevices: async () => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      try {
        return await ipcInvoke('list-audio-devices');
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    deleteRecording: async (filePath) => {
      if (!ipcInvoke) {
        console.log('Electron not available');
        return { success: false, error: 'Electron not available' };
      }
      
      try {
        const result = await ipcInvoke('delete-recording', filePath);
        if (result.success) {
          // Remove from recordings list
          const updatedRecordings = state.recordings.filter(r => r.path !== filePath);
          actions.setRecordings(updatedRecordings);
        }
        return result;
      } catch (error) {
        actions.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    openFile: async (filePath) => {
      if (!ipcInvoke) return { success: false, error: 'Electron not available' };
      try {
        return await ipcInvoke('open-file', filePath);
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    ,
    getRecentRecordings: async () => {
      if (!ipcInvoke) return [];
      try { const list = await ipcInvoke('get-recent-recordings'); actions.setRecentRecordings(list); return list; } catch { return []; }
    },
    getProjects: async () => {
      if (!ipcInvoke) return [];
      try { const list = await ipcInvoke('get-projects'); actions.setProjects(list); return list; } catch { return []; }
    },
    saveProject: async (project) => {
      if (!ipcInvoke) return { success: false, error: 'Electron not available' };
      try { return await ipcInvoke('save-project', project); } catch (e) { return { success: false, error: e.message }; }
    }
  };

  // Listen for IPC events from main process
  useEffect(() => {
    if (!ipcOn) return;

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

    const handleToggleSidebar = () => {
      actions.toggleSidebar();
    };

    const handleRecordingProgress = (event, data) => {
      // Update recording progress
      actions.setRecordingProgress(data);
    };

    const handleRecordingError = (event, data) => {
      actions.setError(`Recording error: ${data.error}`);
      actions.setRecordingStatus(false);
    };

    const handleRecordingCompleted = (event, data) => {
      actions.setRecordingStatus(false);
      actions.setRecordingPath(data.path);
      actions.setRecordingDuration(data.duration);
      actions.setLastCompletedPath(data.path);
      
      // Add to recordings list
      const newRecording = {
        id: Date.now().toString(),
        path: data.path,
        duration: data.duration,
        created: new Date().toISOString(),
        size: 0 // Will be updated when accessed
      };
      
      actions.setRecordings([...state.recordings, newRecording]);
      
      // Show success message
      actions.setSuccessMessage(`Recording completed successfully! Saved to: ${data.path}`);
    };

    // Add event listeners
    const offs = [];
    offs.push(ipcOn('recording-started', handleRecordingStarted));
    offs.push(ipcOn('recording-stopped', handleRecordingStopped));
    offs.push(ipcOn('recording-timer', handleRecordingTimer));
    offs.push(ipcOn('recording-progress', handleRecordingProgress));
    offs.push(ipcOn('recording-error', handleRecordingError));
    offs.push(ipcOn('recording-completed', handleRecordingCompleted));
    offs.push(ipcOn('countdown', handleCountdown));
    offs.push(ipcOn('toggle-pause', handleTogglePause));
    offs.push(ipcOn('toggle-sidebar', handleToggleSidebar));

    // Cleanup
    return () => {
      offs.forEach(off => { try { if (typeof off === 'function') off(); } catch {} });
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
