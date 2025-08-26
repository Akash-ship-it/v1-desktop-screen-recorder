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
    titleBarStyle: 'hidden',
    frame: false,
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
    
    // Ensure output directory exists
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Check if we have write permissions
      fs.accessSync(outputDir, fs.constants.W_OK);
    } catch (error) {
      log.error('Cannot create or access output directory:', error);
      throw new Error(`Cannot access output directory: ${outputDir}. Please check permissions.`);
    }

    // Generate unique filename
    let filename = `recording-${timestamp}.mp4`;
    let counter = 1;
    
    while (fs.existsSync(path.join(outputDir, filename))) {
      filename = `recording-${timestamp}-${counter}.mp4`;
      counter++;
    }

    currentRecordingPath = path.join(outputDir, filename);
    
    // Log the full path for debugging
    log.info('Recording will be saved to:', currentRecordingPath);

    // Configure ffmpeg command for Windows
    const ffmpegCommand = ffmpeg();
    
    // Set input source (screen capture)
    ffmpegCommand.input(selectedSource.id);
    
    // Set video codec and options
    ffmpegCommand
      .videoCodec('libx264')
      .outputOptions([
        '-preset', 'ultrafast',
        '-crf', quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
        '-r', frameRate.toString(),
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart'
      ]);

    // Add audio input if requested
    if (audio) {
      try {
        // Try to get audio devices
        ffmpegCommand.input('audio=default')
          .audioCodec('aac')
          .audioChannels(2)
          .audioFrequency(48000);
      } catch (error) {
        log.warn('Audio capture not available:', error.message);
      }
    }

    // Set output with proper error handling
    ffmpegCommand.output(currentRecordingPath);
    
    // Add progress callback
    ffmpegCommand.on('progress', (progress) => {
      if (mainWindow) {
        mainWindow.webContents.send('recording-progress', {
          percent: progress.percent || 0,
          timemark: progress.timemark || '00:00:00',
          fps: progress.currentFps || 0
        });
      }
    });

    // Start recording
    try {
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
          startTime: recordingStartTime,
          options: options
        });
      }

      log.info('Recording started successfully:', currentRecordingPath);
      
      // Start the actual recording process
      recordingProcess.run((err, stdout, stderr) => {
        if (err) {
          log.error('FFmpeg error:', err);
          if (mainWindow) {
            mainWindow.webContents.send('recording-error', {
              error: err.message,
              path: currentRecordingPath
            });
          }
        } else {
          log.info('Recording completed successfully:', currentRecordingPath);
          if (mainWindow) {
            mainWindow.webContents.send('recording-completed', {
              path: currentRecordingPath,
              duration: Date.now() - recordingStartTime
            });
          }
        }
      });

    } catch (error) {
      log.error('Error starting recording:', error);
      isRecording = false;
      recordingProcess = null;
      throw error;
    }

  } catch (error) {
    log.error('Error starting recording:', error);
    throw error;
  }
}

function stopRecording() {
  try {
    if (!isRecording || !recordingProcess) {
      log.info('No recording in progress to stop');
      return { success: false, error: 'No recording in progress' };
    }

    log.info('Stopping recording...');

    // Clear timers first
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }

    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    const recordingDuration = Date.now() - recordingStartTime;
    const finalPath = currentRecordingPath;

    // Stop the recording process
    if (recordingProcess && recordingProcess.ffmpegProc) {
      try {
        recordingProcess.ffmpegProc.kill('SIGTERM');
        log.info('FFmpeg process terminated');
      } catch (error) {
        log.warn('Error terminating FFmpeg process:', error);
      }
    }

    // Reset recording state
    isRecording = false;
    recordingProcess = null;
    recordingStartTime = null;

    // Update tray
    updateTray();

    // Check if file was created and has content
    setTimeout(() => {
      try {
        if (fs.existsSync(finalPath)) {
          const stats = fs.statSync(finalPath);
          if (stats.size > 0) {
            log.info('Recording file created successfully:', finalPath, 'Size:', stats.size, 'bytes');
            
            // Notify renderer of successful completion
            if (mainWindow) {
              mainWindow.webContents.send('recording-stopped', {
                path: finalPath,
                duration: recordingDuration,
                size: stats.size,
                success: true
              });
            }
          } else {
            log.warn('Recording file is empty:', finalPath);
            // Try to delete empty file
            fs.unlinkSync(finalPath);
            if (mainWindow) {
              mainWindow.webContents.send('recording-stopped', {
                path: finalPath,
                duration: recordingDuration,
                success: false,
                error: 'Recording file is empty'
              });
            }
          }
        } else {
          log.error('Recording file was not created:', finalPath);
          if (mainWindow) {
            mainWindow.webContents.send('recording-stopped', {
              path: finalPath,
              duration: recordingDuration,
              success: false,
              error: 'Recording file was not created'
            });
          }
        }
      } catch (error) {
        log.error('Error checking recording file:', error);
        if (mainWindow) {
          mainWindow.webContents.send('recording-stopped', {
            path: finalPath,
            duration: recordingDuration,
            success: false,
            error: error.message
          });
        }
      }
    }, 1000); // Wait 1 second for file to be written

    log.info('Recording stopped, duration:', recordingDuration, 'ms');
    return { success: true, path: finalPath, duration: recordingDuration };

  } catch (error) {
    log.error('Error stopping recording:', error);
    return { success: false, error: error.message };
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

  // Toggle Sidebar
  globalShortcut.register('CommandOrControl+B', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toggle-sidebar');
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

// Enhanced IPC handlers
ipcMain.handle('open-recording-folder', async () => {
  try {
    const outputDir = store.get('settings.outputPath') || path.join(app.getPath('videos'), 'Movami Recordings');
    if (fs.existsSync(outputDir)) {
      shell.openPath(outputDir);
      return { success: true };
    } else {
      return { success: false, error: 'Output directory does not exist' };
    }
  } catch (error) {
    log.error('Error opening recording folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recording-info', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }
    
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const createdDate = stats.birthtime;
    
    return {
      success: true,
      info: {
        path: filePath,
        size: fileSize,
        created: createdDate,
        sizeFormatted: formatFileSize(fileSize)
      }
    };
  } catch (error) {
    log.error('Error getting recording info:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-recording', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }
    
    fs.unlinkSync(filePath);
    log.info('Recording deleted:', filePath);
    return { success: true };
  } catch (error) {
    log.error('Error deleting recording:', error);
    return { success: false, error: error.message };
  }
});

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
    log.info('Window minimized via IPC');
  }
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      log.info('Window unmaximized via IPC');
    } else {
      mainWindow.maximize();
      log.info('Window maximized via IPC');
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
    log.info('Window close requested via IPC');
  }
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

// Utility functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateRecordingOptions(options) {
  const errors = [];
  
  if (options.frameRate && (options.frameRate < 1 || options.frameRate > 120)) {
    errors.push('Frame rate must be between 1 and 120 FPS');
  }
  
  if (options.resolution && !['720p', '1080p', '1440p', '4K'].includes(options.resolution)) {
    errors.push('Invalid resolution. Must be 720p, 1080p, 1440p, or 4K');
  }
  
  if (options.quality && !['low', 'medium', 'high', 'ultra'].includes(options.quality)) {
    errors.push('Invalid quality. Must be low, medium, high, or ultra');
  }
  
  return errors;
}

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
