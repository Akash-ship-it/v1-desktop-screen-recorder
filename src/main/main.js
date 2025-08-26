const { app, BrowserWindow, ipcMain, screen, desktopCapturer, globalShortcut, Tray, Menu, nativeImage, dialog, shell } = require('electron');
const { enable } = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const Store = require('electron-store');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Configure ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Configure logging
log.transports.file.level = 'info';
log.transports.console.level = 'info';

// Initialize store
const store = new Store();

// Global variables
let mainWindow;
let tray;
let isRecording = false;
let recordingProcess = null;
let recordingStartTime = null;
let recordingTimer = null;
let countdownTimer = null;
let currentRecordingPath = null;
let audioStreams = [];
let videoStreams = [];

// Enable remote module
enable(require('@electron/remote/main'));

// Auto updater configuration
autoUpdater.logger = log;
autoUpdater.autoDownload = false;

function createWindow() {
  // Get primary display info
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1400, width * 0.9),
    height: Math.min(900, height * 0.9),
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    },
    // icon: path.join(__dirname, '../../assets/icon.png'),
    show: false,
    titleBarStyle: 'default',
    frame: true,
    transparent: false,
    resizable: true,
    maximizable: true,
    fullscreenable: true
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createTray() {
  // Create a simple tray icon or use a default one
  const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isRecording ? 'Stop Recording' : 'Start Recording',
      click: () => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    },
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Movami Screen Recorder');
  
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Screen recording functions
async function startRecording(options = {}) {
  try {
    if (isRecording) {
      log.info('Recording already in progress');
      return;
    }

    const {
      source = 'screen',
      audio = true,
      video = true,
      quality = 'high',
      frameRate = 30,
      resolution = '1080p',
      outputPath = null,
      countdown = 0
    } = options;

    // Set countdown if specified
    if (countdown > 0) {
      await startCountdown(countdown);
    }

    // Get screen sources
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    if (sources.length === 0) {
      throw new Error('No screen sources available');
    }

    // Select source based on options
    let selectedSource = sources[0];
    if (source === 'window' && options.windowId) {
      selectedSource = sources.find(s => s.id === options.windowId) || sources[0];
    }

    // Generate output path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = outputPath || path.join(app.getPath('videos'), 'Movami Recordings');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    currentRecordingPath = path.join(outputDir, `recording-${timestamp}.mp4`);

    // Configure ffmpeg command
    const ffmpegCommand = ffmpeg()
      .input(selectedSource.id)
      .inputFormat('avfoundation')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-preset', 'ultrafast',
        '-crf', quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
        '-r', frameRate.toString(),
        '-pix_fmt', 'yuv420p'
      ]);

    // Add audio input if requested
    if (audio) {
      ffmpegCommand.input('default')
        .inputFormat('avfoundation');
    }

    // Set output
    ffmpegCommand.output(currentRecordingPath);

    // Start recording
    recordingProcess = ffmpegCommand;
    recordingStartTime = Date.now();
    isRecording = true;

    // Start recording timer
    startRecordingTimer();

    // Update tray
    updateTray();

    // Notify renderer
    if (mainWindow) {
      mainWindow.webContents.send('recording-started', {
        path: currentRecordingPath,
        startTime: recordingStartTime
      });
    }

    log.info('Recording started:', currentRecordingPath);

  } catch (error) {
    log.error('Error starting recording:', error);
    throw error;
  }
}

function stopRecording() {
  try {
    if (!isRecording || !recordingProcess) {
      return;
    }

    // Stop the recording process
    if (recordingProcess && recordingProcess.ffmpegProc) {
      recordingProcess.ffmpegProc.kill('SIGTERM');
    }

    // Clear timers
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }

    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    const recordingDuration = Date.now() - recordingStartTime;
    isRecording = false;
    recordingProcess = null;
    recordingStartTime = null;

    // Update tray
    updateTray();

    // Notify renderer
    if (mainWindow) {
      mainWindow.webContents.send('recording-stopped', {
        path: currentRecordingPath,
        duration: recordingDuration
      });
    }

    log.info('Recording stopped:', currentRecordingPath);

  } catch (error) {
    log.error('Error stopping recording:', error);
  }
}

function startCountdown(seconds) {
  return new Promise((resolve) => {
    let count = seconds;
    
    countdownTimer = setInterval(() => {
      if (mainWindow) {
        mainWindow.webContents.send('countdown', count);
      }
      
      count--;
      
      if (count < 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        resolve();
      }
    }, 1000);
  });
}

function startRecordingTimer() {
  recordingTimer = setInterval(() => {
    if (isRecording && recordingStartTime) {
      const duration = Date.now() - recordingStartTime;
      if (mainWindow) {
        mainWindow.webContents.send('recording-timer', duration);
      }
    }
  }, 1000);
}

function updateTray() {
  if (tray) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: isRecording ? 'Stop Recording' : 'Start Recording',
        click: () => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }
      },
      {
        label: 'Show App',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);
    
    tray.setContextMenu(contextMenu);
  }
}

// Global shortcuts
function registerGlobalShortcuts() {
  // Start/Stop recording
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  // Pause/Resume recording
  globalShortcut.register('CommandOrControl+Shift+P', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toggle-pause');
    }
  });

  // Show/Hide app
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

// IPC handlers
ipcMain.handle('get-screens', async () => {
  const displays = screen.getAllDisplays();
  return displays.map((display, index) => ({
    id: index,
    bounds: display.bounds,
    workArea: display.workArea,
    scaleFactor: display.scaleFactor,
    rotation: display.rotation,
    internal: display.internal,
    primary: display.id === screen.getPrimaryDisplay().id
  }));
});

ipcMain.handle('get-windows', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['window'],
    thumbnailSize: { width: 300, height: 200 }
  });
  
  return sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL()
  }));
});

ipcMain.handle('start-recording', async (event, options) => {
  try {
    await startRecording(options);
    return { success: true };
  } catch (error) {
    log.error('Error in start-recording handler:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-recording', async () => {
  try {
    stopRecording();
    return { success: true };
  } catch (error) {
    log.error('Error in stop-recording handler:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-settings', () => {
  return store.get('settings', {
    theme: 'dark',
    language: 'en',
    outputPath: path.join(app.getPath('videos'), 'Movami Recordings'),
    quality: 'high',
    frameRate: 30,
    resolution: '1080p',
    audioEnabled: true,
    hotkeys: {
      startStop: 'CommandOrControl+Shift+R',
      pause: 'CommandOrControl+Shift+P',
      showHide: 'CommandOrControl+Shift+H'
    }
  });
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  return { success: true };
});

ipcMain.handle('select-output-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Output Directory'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('open-file', async (event, filePath) => {
  if (fs.existsSync(filePath)) {
    shell.openPath(filePath);
    return { success: true };
  }
  return { success: false, error: 'File not found' };
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcuts();
  
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (isRecording) {
    stopRecording();
  }
});

// Auto updater events
autoUpdater.on('update-available', () => {
  log.info('Update available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  log.error('Auto updater error:', err);
});
