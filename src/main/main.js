const { app, BrowserWindow, ipcMain, screen, desktopCapturer, globalShortcut, Tray, Menu, nativeImage, dialog, shell } = require('electron');
const { enable } = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const Store = require('electron-store');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const TEST_MODE = process.env.TEST_MODE === '1';
let testServer = null;

// Advanced video processing utilities for professional recording
class ProfessionalVideoProcessor {
  
  // Create cursor highlight effect with glow
  static createCursorHighlight(options = {}) {
    const {
      glowRadius = 20,
      glowColor = 'yellow',
      glowOpacity = 0.6,
      pulseEffect = true
    } = options;
    
    if (pulseEffect) {
      return `geq=lum='if(gt(random(0),0.98),255,lum(X,Y))':cb='if(gt(random(0),0.98),128,cb(X,Y))':cr='if(gt(random(0),0.98),128,cr(X,Y))'`;
    }
    
    return `boxblur=${glowRadius}:1`;
  }
  
  // Create professional overlay graphics
  static createProfessionalOverlay(screenWidth, screenHeight, options = {}) {
    const {
      brandName = 'MOVAMI',
      position = 'top-right',
      style = 'modern',
      opacity = 0.7,
      fontSize = null,
      backgroundColor = null,
      textColor = 'white'
    } = options;
    
    const autoFontSize = fontSize || Math.floor(screenHeight * 0.025);
    let x, y;
    
    // Position calculations
    switch(position) {
      case 'top-right':
        x = screenWidth - 200;
        y = 30;
        break;
      case 'top-left':
        x = 30;
        y = 30;
        break;
      case 'bottom-right':
        x = screenWidth - 200;
        y = screenHeight - 60;
        break;
      case 'bottom-left':
        x = 30;
        y = screenHeight - 60;
        break;
      default:
        x = screenWidth - 200;
        y = 30;
    }
    
    let overlayFilter = '';
    
    // Add background box if specified
    if (backgroundColor) {
      overlayFilter += `drawbox=x=${x-10}:y=${y-5}:w=180:h=${autoFontSize+10}:color=${backgroundColor}@0.8:t=fill,`;
    }
    
    // Add text overlay
    overlayFilter += `drawtext=text='${brandName}':fontsize=${autoFontSize}:fontcolor=${textColor}@${opacity}:x=${x}:y=${y}`;
    
    // Add professional styling based on style
    if (style === 'modern') {
      overlayFilter += `:fontfile='arial.ttf':box=1:boxcolor=black@0.3:boxborderw=5`;
    } else if (style === 'minimal') {
      overlayFilter += `:fontfile='arial.ttf'`;
    } else if (style === 'bold') {
      overlayFilter += `:fontfile='arial.ttf':box=1:boxcolor=blue@0.5:boxborderw=3`;
    }
    
    return overlayFilter;
  }
  
  // Create smooth zoom effect for presentations
  static createSmoothZoom(startTime, endTime, zoomFactor = 1.2) {
    const duration = endTime - startTime;
    return `zoompan=z='if(between(t,${startTime},${endTime}),zoom+0.001,1)':d=${duration * 25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
  }
  
  // Create professional color grading
  static createColorGrading(preset = 'presentation') {
    const presets = {
      'presentation': 'eq=brightness=0.02:saturation=1.1:gamma=0.95:contrast=1.05',
      'webinar': 'eq=brightness=0.05:saturation=1.05:gamma=0.9:contrast=1.1',
      'demo': 'eq=brightness=0.03:saturation=1.15:gamma=1.0:contrast=1.08',
      'tutorial': 'eq=brightness=0.01:saturation=1.08:gamma=0.98:contrast=1.03'
    };
    
    return presets[preset] || presets['presentation'];
  }
  
  // Create motion blur for smooth movement
  static createMotionBlur() {
    return 'mblur=radius=2:passes=1';
  }
  
  // Create professional audio processing chain
  static createAudioProcessingChain(preset = 'presentation') {
    const presets = {
      'presentation': [
        'highpass=f=80',           // Remove low rumble
        'lowpass=f=12000',         // Remove harsh highs
        'compand=attacks=0.3:decays=0.8:points=-90/-90|-60/-20|-30/-10|-20/-8|-5/-5|20/20', // Professional compression
        'volume=1.1',              // Slight boost
        'dynaudnorm=f=75:g=25:s=12' // Dynamic range normalization
      ],
      'webinar': [
        'highpass=f=100',
        'lowpass=f=10000',
        'compand=attacks=0.1:decays=1.0:points=-90/-90|-60/-25|-30/-12|-20/-8|-5/-5|20/20',
        'volume=1.2',
        'dynaudnorm=f=50:g=30:s=15'
      ],
      'demo': [
        'highpass=f=60',
        'lowpass=f=15000',
        'compand=attacks=0.2:decays=0.6:points=-90/-90|-60/-18|-30/-8|-20/-6|-5/-4|20/20',
        'volume=1.05',
        'dynaudnorm=f=100:g=20:s=10'
      ]
    };
    
    const chain = presets[preset] || presets['presentation'];
    return chain.join(',');
  }
  
  // Create click effect overlay for cursor clicks
  static createClickEffect(options = {}) {
    const {
      effectColor = 'yellow',
      effectSize = 30,
      fadeDuration = 0.5
    } = options;
    
    // This would need mouse click detection - placeholder for concept
    return `drawtext=text='●':fontsize=${effectSize}:fontcolor=${effectColor}@0.8:x=(mouse_x-${effectSize/2}):y=(mouse_y-${effectSize/2})`;
  }
  
  // Create professional transition effects
  static createTransitionEffect(type = 'fade', duration = 1.0) {
    const transitions = {
      'fade': `fade=t=in:st=0:d=${duration}`,
      'slide': `slide=direction=right:duration=${duration}`,
      'wipe': `wipe=direction=right:duration=${duration}`,
      'dissolve': `dissolve=duration=${duration}`
    };
    
    return transitions[type] || transitions['fade'];
  }
  
  // Create recording indicator overlay
  static createRecordingIndicator(screenWidth, screenHeight) {
    const x = screenWidth - 120;
    const y = screenHeight - 40;
    
    return `drawtext=text='● REC':fontsize=18:fontcolor=red@0.9:x=${x}:y=${y}:fontfile='arial.ttf':box=1:boxcolor=black@0.7:boxborderw=3`;
  }
  
  // Combine multiple filters into a professional filter chain
  static buildProfessionalFilterChain(screenWidth, screenHeight, options = {}) {
    const {
      preset = 'presentation',
      showWatermark = true,
      showRecordingIndicator = false,
      colorGrading = true,
      smoothMotion = true,
      cursorHighlight = true,
      customFilters = []
    } = options;
    
    let filters = [];
    
    // Add noise reduction first
    if (preset === 'ultra' || preset === 'high') {
      filters.push('hqdn3d=2:1:2:1');
    }
    
    // Add color grading
    if (colorGrading) {
      filters.push(this.createColorGrading(preset));
    }
    
    // Add smooth motion
    if (smoothMotion) {
      filters.push('minterpolate=fps=60:scd=none');
    }
    
    // Add cursor highlighting
    if (cursorHighlight) {
      // Simplified cursor enhancement
      filters.push('eq=brightness=0.02:saturation=1.05');
    }
    
    // Add watermark
    if (showWatermark) {
      filters.push(this.createProfessionalOverlay(screenWidth, screenHeight, {
        brandName: 'MOVAMI',
        position: 'top-right',
        style: 'modern'
      }));
    }
    
    // Add recording indicator
    if (showRecordingIndicator) {
      filters.push(this.createRecordingIndicator(screenWidth, screenHeight));
    }
    
    // Add any custom filters
    if (customFilters.length > 0) {
      filters = filters.concat(customFilters);
    }
    
    return filters.join(',');
  }
}

// Export the processor for use in main recording function
module.exports = { ProfessionalVideoProcessor };

// Integration example for the main recording function:
function createProfessionalRecordingConfig(screenWidth, screenHeight, options = {}) {
  const {
    preset = 'presentation',
    quality = 'high',
    audioPreset = 'presentation',
    customBranding = null
  } = options;
  
  // Build video filter chain
  const videoFilters = ProfessionalVideoProcessor.buildProfessionalFilterChain(
    screenWidth, 
    screenHeight, 
    {
      preset,
      showWatermark: true,
      colorGrading: true,
      smoothMotion: quality === 'ultra',
      cursorHighlight: true
    }
  );
  
  // Build audio processing chain
  const audioFilters = ProfessionalVideoProcessor.createAudioProcessingChain(audioPreset);
  
  // Professional encoding settings based on quality
  const encodingSettings = {
    'ultra': {
      preset: 'veryslow',
      crf: 15,
      profile: 'high',
      level: '4.2',
      tune: 'film'
    },
    'high': {
      preset: 'slow',
      crf: 18,
      profile: 'high',
      level: '4.1',
      tune: 'film'
    },
    'medium': {
      preset: 'medium',
      crf: 23,
      profile: 'main',
      level: '4.0',
      tune: 'film'
    }
  };
  
  const settings = encodingSettings[quality] || encodingSettings['high'];
  
  return {
    videoFilters,
    audioFilters,
    encoding: settings,
    professional: true
  };
}

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
let currentRecordingPath = null; // Final output path (for single-segment), or target for merged output
let segmentPaths = []; // For segmented recording
let segmentCounter = 0;
let audioStreams = [];
let videoStreams = [];
let exportProcess = null;
// Persisted collections
function pushRecentRecording(rec) {
  try {
    const list = store.get('recentRecordings', []);
    list.unshift(rec);
    const limited = list.slice(0, 15);
    store.set('recentRecordings', limited);
  } catch (e) {
    log.warn('Failed to persist recent recording:', e.message);
  }
}

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
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
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
  if (TEST_MODE) {
    mainWindow.loadURL('about:blank');
  } else {
    mainWindow.loadURL(startUrl);
  }

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

// Add this helper function to get available audio devices
async function getAudioDevices() {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const ffmpeg = spawn(ffmpegStatic, ['-f', 'dshow', '-list_devices', 'true', '-i', 'dummy']);
    
    let output = '';
    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    ffmpeg.on('close', () => {
      const audioDevices = [];
      const lines = output.split('\n');
      let inAudioSection = false;
      
      for (const line of lines) {
        if (line.includes('[dshow @') && line.includes('DirectShow audio devices')) {
          inAudioSection = true;
          continue;
        }
        if (line.includes('[dshow @') && line.includes('DirectShow video devices')) {
          inAudioSection = false;
          continue;
        }
        if (inAudioSection && line.includes('"')) {
          const match = line.match(/"([^"]+)"/);
          if (match) {
            audioDevices.push(match[1]);
          }
        }
      }
      
      resolve(audioDevices);
    });
  });
}

// Helper to get available video devices (Windows dshow)
async function getVideoDevices() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') return resolve([]);
    const { spawn } = require('child_process');
    const ffmpegProc = spawn(ffmpegStatic, ['-f', 'dshow', '-list_devices', 'true', '-i', 'dummy']);
    let output = '';
    ffmpegProc.stderr.on('data', (data) => { output += data.toString(); });
    ffmpegProc.on('close', () => {
      const videoDevices = [];
      const lines = output.split('\n');
      let inVideo = false;
      for (const line of lines) {
        if (line.includes('DirectShow video devices')) { inVideo = true; continue; }
        if (line.includes('DirectShow audio devices')) { inVideo = false; continue; }
        if (inVideo && line.includes('"')) {
          const m = line.match(/"([^"]+)"/);
          if (m) videoDevices.push(m[1]);
        }
      }
      resolve(videoDevices);
    });
  });
}

// Enhanced professional recording function with Movami-style features
async function startRecording(options = {}) {
  try {
    if (isRecording) {
      log.info('Recording already in progress');
      return;
    }

    if (TEST_MODE) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputDir = options.outputPath || path.join(app.getPath('videos'), 'Movami Recordings');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      currentRecordingPath = path.join(outputDir, `test-${timestamp}.mp4`);
      try { fs.writeFileSync(currentRecordingPath, Buffer.from('TEST_RECORDING')); } catch {}
      recordingStartTime = Date.now();
      isRecording = true;
      if (mainWindow) {
        mainWindow.webContents.send('recording-started', { path: currentRecordingPath, startTime: recordingStartTime, type: 'test' });
        setTimeout(() => {
          if (mainWindow) mainWindow.webContents.send('recording-progress', { percent: 50, timemark: '00:00:01', fps: 30, type: 'test' });
        }, 200);
      }
      return;
    }

    const {
      source = 'screen',
      selectedWindow = null,
      selectedArea = null,
      selectedScreen = null,
      audio = true,
      video = true,
      quality = 'high',
      frameRate = 30,
      resolution = '1080p',
      outputPath = null,
      countdown = 0,
      // New professional options
      showCursor = true,
      addWatermark = true,
      brandingOverlay = true,
      smoothTransitions = true,
      professionalCodec = true,
      audioEnhancement = true,
      recordingBorder = true,
      timestampOverlay = false,
      speakerOverlay = false,
      cursorHighlight = true,
      preferredCodec = 'auto' // auto | h264 | hevc | vp9
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

    // Generate output path with professional naming
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = outputPath || path.join(app.getPath('videos'), 'Movami Recordings');
    
    // Ensure output directory exists
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.accessSync(outputDir, fs.constants.W_OK);
    } catch (error) {
      log.error('Cannot create or access output directory:', error);
      throw new Error(`Cannot access output directory: ${outputDir}. Please check permissions.`);
    }

    // Generate unique filename with professional naming
    let filename = `presentation-${timestamp}.mp4`;
    let counter = 1;
    
    while (fs.existsSync(path.join(outputDir, filename))) {
      filename = `presentation-${timestamp}-${counter}.mp4`;
      counter++;
    }

    currentRecordingPath = path.join(outputDir, filename);
    segmentPaths = [];
    segmentCounter = 0;
    log.info('Professional recording will be saved to:', currentRecordingPath);

    // Get display dimensions (use selectedScreen if provided)
    const targetDisplay = (selectedScreen != null && screen.getAllDisplays()[selectedScreen]) || screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight, x: screenX = 0, y: screenY = 0 } = targetDisplay.bounds;
    const scaleFactor = targetDisplay.scaleFactor || 1;
    const actualWidth = Math.floor(screenWidth * scaleFactor);
    const actualHeight = Math.floor(screenHeight * scaleFactor);

    log.info(`Professional capture: ${actualWidth}x${actualHeight}, scale: ${scaleFactor}`);

    // Configure enhanced ffmpeg command
    const ffmpegCommand = ffmpeg();
    
    // Enhanced video input configuration per OS honoring source selection
    if (process.platform === 'win32') {
      const baseOpts = ['-framerate', frameRate.toString(), '-draw_mouse', showCursor ? '1' : '0'];
      if (source === 'window' && selectedWindow) {
        // Map selectedWindow id to a name using desktopCapturer
        const sources = await desktopCapturer.getSources({ types: ['window'] });
        const match = sources.find(s => s.id === selectedWindow);
        const windowTitle = match ? match.name : 'Program Manager';
        ffmpegCommand.input(`title=${windowTitle}`)
        .inputFormat('gdigrab')
          .inputOptions(baseOpts);
    } else {
        // screen or area
        const videoSize = selectedArea ? `${selectedArea.width}x${selectedArea.height}` : `${actualWidth}x${actualHeight}`;
        const offsetX = selectedArea ? Math.max(0, selectedArea.x - screenX) : 0;
        const offsetY = selectedArea ? Math.max(0, selectedArea.y - screenY) : 0;
        ffmpegCommand.input('desktop')
          .inputFormat('gdigrab')
          .inputOptions([...baseOpts, '-video_size', videoSize, '-offset_x', String(offsetX), '-offset_y', String(offsetY)]);
      }
    } else if (process.platform === 'darwin') {
      // macOS (window capture unsupported via avfoundation; fallback to screen/area)
      const videoSize = selectedArea ? `${selectedArea.width}x${selectedArea.height}` : `${screenWidth}x${screenHeight}`;
      ffmpegCommand.input('0:')
        .inputFormat('avfoundation')
        .inputOptions([
          '-framerate', frameRate.toString(),
          '-video_size', videoSize,
          '-capture_cursor', showCursor ? 'true' : 'false',
          '-capture_mouse_clicks', cursorHighlight ? 'true' : 'false'
        ]);
      // Note: cropping to area would require an additional scale/crop filter; omitted for stability
    } else if (process.platform === 'linux') {
      // Linux X11 default :0.0
      const displayEnv = process.env.DISPLAY || ':0.0';
      const offset = selectedArea ? `${Math.max(0, selectedArea.x - screenX)},${Math.max(0, selectedArea.y - screenY)}` : '0,0';
      const videoSize = selectedArea ? `${selectedArea.width}x${selectedArea.height}` : `${screenWidth}x${screenHeight}`;
      ffmpegCommand.input(`${displayEnv}+${offset}`)
        .inputFormat('x11grab')
        .inputOptions(['-framerate', frameRate.toString(), '-video_size', videoSize]);
    }

    // Optional webcam PiP (Windows)
    let webcamAdded = false;
    const webcamEnabled = options.webcamEnabled === true;
    const webcamDevice = options.webcamDevice;
    if (webcamEnabled && process.platform === 'win32' && webcamDevice) {
      try {
        const vids = await getVideoDevices();
        if (vids.includes(webcamDevice)) {
          ffmpegCommand.input(`video=${webcamDevice}`).inputFormat('dshow');
          webcamAdded = true;
        }
      } catch (e) {
        log.warn('Webcam not available:', e.message);
      }
    }

    // Enhanced audio configuration (device selection + potential dual inputs)
    let didAddSys = false;
    let didAddMic = false;
    const sysDev = options.systemAudioDevice;
    const micDev = options.microphoneDevice;
    const separateTracks = options.separateAudioTracks === true;

    if (audio && process.platform === 'win32') {
      try {
        const audioDevices = await getAudioDevices();
        const pick = (name) => (name && audioDevices.includes(name)) ? name : (audioDevices[0] || null);
        const sys = pick(sysDev);
        const mic = pick(micDev);
        if (sys) {
          ffmpegCommand.input(`audio=${sys}`).inputFormat('dshow');
          didAddSys = true;
        }
        if (mic && (!sys || mic !== sys)) {
          ffmpegCommand.input(`audio=${mic}`).inputFormat('dshow');
          didAddMic = true;
        }
      } catch (error) {
        log.warn('Enhanced audio not available:', error.message);
      }
    }
    if (audio && process.platform === 'linux') {
      const sys = sysDev || 'default';
      ffmpegCommand.input(sys).inputFormat('pulse');
      didAddSys = true;
      if (micDev && micDev !== sys) {
        ffmpegCommand.input(micDev).inputFormat('pulse');
        didAddMic = true;
      }
    }
    
    // Professional video encoding options
    const baseOutputOptions = [
      // High-quality encoding preset
      '-preset', professionalCodec ? 'slow' : 'medium',
      '-crf', quality === 'ultra' ? '15' : quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
      '-r', frameRate.toString(),
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      // Professional color space and gamma
      '-colorspace', 'bt709',
      '-color_primaries', 'bt709',
      '-color_trc', 'bt709',
      '-color_range', 'tv'
    ];

    // Create professional filter chain
    let videoFilters = [];
    
    // Add subtle noise reduction for cleaner look
    if (quality === 'ultra' || quality === 'high') {
      videoFilters.push('hqdn3d=2:1:2:1');
    }
    
    // Add cursor highlighting effect
    if (cursorHighlight && showCursor) {
      // Simplified enhancement only; heavy cursor effects removed for stability
      videoFilters.push('eq=brightness=0.03:saturation=1.06');
    }
    
    // Add professional border/frame
    if (recordingBorder) {
      const borderColor = '0x333333';
      const borderWidth = 4;
      videoFilters.push(`pad=width=${actualWidth + borderWidth * 2}:height=${actualHeight + borderWidth * 2}:x=${borderWidth}:y=${borderWidth}:color=${borderColor}`);
    }
    
    // Add watermark/branding overlay
    if (addWatermark || brandingOverlay) {
      // Create watermark text overlay using a safe generic font reference
      const watermarkText = 'MOVAMI';
      const fontsize = Math.floor(actualHeight * 0.025);
      const fontcolor = 'white@0.7';
      const x = actualWidth - 150;
      const y = 30;
      videoFilters.push(`drawtext=text='${watermarkText}':fontsize=${fontsize}:fontcolor=${fontcolor}:x=${x}:y=${y}`);
    }
    
    // Add timestamp overlay if requested
    if (timestampOverlay) {
      videoFilters.push(`drawtext=text='%{localtime}':fontsize=20:fontcolor=white@0.8:x=10:y=10:fontfile='arial.ttf'`);
    }
    
    // Add smooth scaling with high-quality algorithm
    const resolutionMap = {
      '720p': '1280x720',
      '1080p': '1920x1080',
      '1440p': '2560x1440',
      '4K': '3840x2160'
    };
    
    if (resolution && resolution !== 'original' && resolutionMap[resolution]) {
      const targetRes = resolutionMap[resolution];
      if (targetRes !== `${screenWidth}x${screenHeight}`) {
        // Use high-quality scaling algorithm
        videoFilters.push(`scale=${targetRes}:flags=lanczos`);
      }
    }
    
    // Apply video filters if any (when not using PiP overlay)
    if (videoFilters.length > 0 && !webcamAdded) {
      baseOutputOptions.push('-vf', videoFilters.join(','));
    }
    
    // Enhanced audio processing (single-track mode only; for separate tracks we avoid a global -af)
    const outputAudioOptions = [];
    if (audio && audioEnhancement && !(didAddSys && didAddMic && separateTracks)) {
      baseOutputOptions.push('-af', 'highpass=f=100,lowpass=f=8000,volume=1.2,dynaudnorm=f=75:g=25');
    }

    // Hardware encoder auto-detect (basic)
    const pickNvenc = () => {
      try {
        const { spawnSync } = require('child_process');
        const res = spawnSync(ffmpegStatic, ['-hide_banner', '-h', 'encoder=h264_nvenc']);
        return res.status === 0;
      } catch (_) { return false; }
    };
    const useNvenc = process.platform === 'win32' && pickNvenc() && professionalCodec && (preferredCodec === 'auto' || preferredCodec === 'h264');

    if (useNvenc) {
      ffmpegCommand
        .videoCodec('h264_nvenc')
        .outputOptions([
          ...baseOutputOptions,
          '-rc', 'vbr',
          '-cq', quality === 'ultra' ? '17' : quality === 'high' ? '19' : quality === 'medium' ? '23' : '28',
          '-b:v', quality === 'ultra' ? '18000k' : quality === 'high' ? '12000k' : '8000k',
          '-maxrate', quality === 'ultra' ? '28000k' : quality === 'high' ? '18000k' : '12000k',
          '-bufsize', quality === 'ultra' ? '36000k' : quality === 'high' ? '24000k' : '16000k',
          '-preset', 'p5'
        ]);
    } else {
    ffmpegCommand
      .videoCodec('libx264')
      .outputOptions(baseOutputOptions);
    }

    // Build audio mapping/mixing
    if (audio) {
      if (didAddSys && didAddMic) {
        if (separateTracks) {
          // Map video (0:v), system (1:a), mic (2:a)
          ffmpegCommand.outputOptions(['-map', '0:v']);
          ffmpegCommand.outputOptions(['-map', '1:a']);
          ffmpegCommand.outputOptions(['-map', '2:a']);
          ffmpegCommand.outputOptions(['-c:a', 'aac']);
        } else {
          // Mix two audio inputs into one track
          ffmpegCommand.outputOptions([
            '-filter_complex', '[1:a]volume=1.0[a0];[2:a]volume=1.0[a1];[a0][a1]amix=inputs=2:normalize=1[aout]',
            '-map', '0:v',
            '-map', '[aout]',
            '-c:a', 'aac'
          ]);
        }
      } else if (didAddSys || didAddMic) {
        // Single audio input
        ffmpegCommand.outputOptions(['-map', '0:v']);
        ffmpegCommand.outputOptions(['-map', didAddSys ? '1:a' : '1:a']);
        ffmpegCommand.outputOptions(['-c:a', 'aac']);
      }
    }

    // Webcam PiP overlay via complex filter
    if (webcamAdded) {
      const camScale = Math.max(0.1, Math.min(0.5, Number(options.webcamScale || 0.25)));
      const pos = options.webcamPosition || 'top-right';
      const pad = 20;
      let overlayXY = `main_w-w-${pad}:${pad}`; // top-right default
      if (pos === 'top-left') overlayXY = `${pad}:${pad}`;
      if (pos === 'bottom-right') overlayXY = `main_w-w-${pad}:main_h-h-${pad}`;
      if (pos === 'bottom-left') overlayXY = `${pad}:main_h-h-${pad}`;

      // Build minimal complex filter; append EQ/denoise after overlay if present
      const filters = [];
      filters.push({ filter: 'scale2ref', options: `w=iw:h=ih`, inputs: '0:v', outputs: ['base','ref'] });
      filters.push({ filter: 'scale', options: `iw*${camScale}:-1`, inputs: '1:v', outputs: 'cam' });
      filters.push({ filter: 'overlay', options: overlayXY, inputs: ['base','cam'], outputs: 'v0' });
      if (videoFilters.length > 0) {
        // Apply combined filters as a single comma-joined chain on v0
        filters.push({ filter: videoFilters.join(','), inputs: 'v0', outputs: 'vout' });
      } else {
        filters.push({ filter: 'null', inputs: 'v0', outputs: 'vout' });
      }
      ffmpegCommand.complexFilter(filters, 'vout');
      ffmpegCommand.outputOptions(['-map', '[vout]']);
    }

    // Output to a segment file (segmented recording enables pause/resume)
    const segmentFile = path.join(outputDir, `segment-${timestamp}-${segmentCounter}.mp4`);
    segmentPaths.push(segmentFile);
    ffmpegCommand.output(segmentFile);
    
    // Enhanced error handling
    ffmpegCommand.on('error', (err) => {
      if (isManualStop && (err.message.includes('SIGTERM') || err.message.includes('killed'))) {
        log.info('Professional recording stopped manually');
        return;
      }
      
      log.error('Professional recording FFmpeg error:', err);
      isRecording = false;
      recordingProcess = null;
      
      if (mainWindow) {
        mainWindow.webContents.send('recording-error', {
          error: `Professional recording failed: ${err.message}`,
          path: currentRecordingPath
        });
      }
    });

    ffmpegCommand.on('end', () => {
      log.info('Professional recording completed successfully:', currentRecordingPath);
      
      if (!isManualStop) {
        isRecording = false;
        recordingProcess = null;
        
        if (mainWindow) {
          mainWindow.webContents.send('recording-completed', {
            path: currentRecordingPath,
            duration: Date.now() - recordingStartTime,
            type: 'professional'
          });
        }

        // Persist to recent list
        try {
          const rec = {
            id: Date.now().toString(),
            path: currentRecordingPath,
            duration: Date.now() - recordingStartTime,
            created: new Date().toISOString()
          };
          pushRecentRecording(rec);
        } catch {}
      }
    });
    
    // Enhanced progress tracking
    ffmpegCommand.on('progress', (progress) => {
      if (mainWindow) {
        mainWindow.webContents.send('recording-progress', {
          percent: progress.percent || 0,
          timemark: progress.timemark || '00:00:00',
          fps: progress.currentFps || 0,
          quality: progress.currentKbps ? `${Math.round(progress.currentKbps)}kbps` : 'N/A',
          type: 'professional'
        });
      }
    });

    // Start professional recording
    try {
      recordingProcess = ffmpegCommand;
      recordingStartTime = Date.now();
      isRecording = true;

      startRecordingTimer();
      updateTray();

      if (mainWindow) {
        mainWindow.webContents.send('recording-started', {
          path: currentRecordingPath,
          startTime: recordingStartTime,
          options: options,
          type: 'professional'
        });
      }

      log.info('Starting professional FFmpeg recording process...');
      recordingProcess.run();

    } catch (error) {
      log.error('Error starting professional recording:', error);
      isRecording = false;
      recordingProcess = null;
      throw error;
    }

  } catch (error) {
    log.error('Error starting professional recording:', error);
    throw error;
  }
}

// Enhanced IPC handler for professional recording
ipcMain.handle('start-professional-recording', async (event, options) => {
  try {
    // Set professional defaults
    const professionalOptions = {
      quality: 'high',
      frameRate: 30,
      resolution: '1080p',
      audioEnhancement: true,
      professionalCodec: true,
      showCursor: true,
      cursorHighlight: true,
      addWatermark: true,
      brandingOverlay: true,
      recordingBorder: false,
      smoothTransitions: true,
      ...options // Allow overrides
    };
    
    await startRecording(professionalOptions);
    return { success: true, type: 'professional' };
  } catch (error) {
    log.error('Error in professional recording handler:', error);
    return { success: false, error: error.message };
  }
});

// Function to create professional recording presets
function getProfessionalPresets() {
  return {
    'presentation': {
      quality: 'high',
      frameRate: 30,
      resolution: '1080p',
      audioEnhancement: true,
      showCursor: true,
      cursorHighlight: true,
      addWatermark: true,
      brandingOverlay: true,
      timestampOverlay: false,
      recordingBorder: false
    },
    'webinar': {
      quality: 'ultra',
      frameRate: 30,
      resolution: '1080p',
      audioEnhancement: true,
      showCursor: true,
      cursorHighlight: false,
      addWatermark: true,
      brandingOverlay: true,
      timestampOverlay: true,
      recordingBorder: false
    },
    'demo': {
      quality: 'high',
      frameRate: 60,
      resolution: '1080p',
      audioEnhancement: true,
      showCursor: true,
      cursorHighlight: true,
      addWatermark: false,
      brandingOverlay: false,
      timestampOverlay: false,
      recordingBorder: true
    },
    'tutorial': {
      quality: 'high',
      frameRate: 30,
      resolution: '1080p',
      audioEnhancement: true,
      showCursor: true,
      cursorHighlight: true,
      addWatermark: true,
      brandingOverlay: true,
      timestampOverlay: false,
      recordingBorder: false
    }
  };
}

// IPC handler for getting professional presets
ipcMain.handle('get-professional-presets', () => {
  return getProfessionalPresets();
});

// Enhanced settings with professional options
ipcMain.handle('get-professional-settings', () => {
  return store.get('professionalSettings', {
    defaultPreset: 'presentation',
    customWatermark: 'MOVAMI',
    watermarkPosition: 'top-right',
    watermarkOpacity: 70,
    audioEnhancement: true,
    cursorHighlight: true,
    recordingBorder: false,
    borderColor: '#333333',
    brandColors: {
      primary: '#007ACC',
      secondary: '#333333'
    }
  });
});

ipcMain.handle('save-professional-settings', (event, settings) => {
  store.set('professionalSettings', settings);
  return { success: true };
});

// Replace the stopRecording function and add a flag to track manual stops:

let isManualStop = false;

function stopRecording() {
  try {
    if (!isRecording || !recordingProcess) {
      if (!(TEST_MODE && isRecording)) {
        log.info('No recording in progress to stop');
        return { success: false, error: 'No recording in progress' };
      }
    }

    log.info('Stopping recording...');

    // Set flag to indicate this is a manual stop
    isManualStop = true;

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

    // Stop the recording process gracefully
    if (!TEST_MODE && recordingProcess && recordingProcess.ffmpegProc) {
      try {
        // Send 'q' command to FFmpeg for graceful shutdown
        recordingProcess.ffmpegProc.stdin.write('q');
        recordingProcess.ffmpegProc.stdin.end();
        
        // If that doesn't work, use SIGTERM as fallback
        setTimeout(() => {
          if (recordingProcess && recordingProcess.ffmpegProc) {
            recordingProcess.ffmpegProc.kill('SIGTERM');
            log.info('FFmpeg process terminated with SIGTERM');
          }
        }, 2000);
        
      } catch (error) {
        log.warn('Error stopping FFmpeg process:', error);
        // Force kill as last resort
        if (recordingProcess && recordingProcess.ffmpegProc) {
          recordingProcess.ffmpegProc.kill('SIGKILL');
        }
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
        // For segmented recording, do not finalize here. Final concat occurs on "finalize-recording".
        if (mainWindow) {
          mainWindow.webContents.send('recording-stopped', {
            path: segmentPaths[segmentPaths.length - 1] || finalPath,
            duration: recordingDuration,
            success: true
          });
        }
        if (TEST_MODE && mainWindow) {
          mainWindow.webContents.send('recording-completed', {
            path: finalPath,
            duration: recordingDuration,
            type: 'test'
          });
        }
      } catch (error) {
        log.error('Error after stop:', error);
      }
      
      // Reset the manual stop flag
      isManualStop = false;
    }, 2000); // Wait 2 seconds for file to be written

    log.info('Recording stopped, duration:', recordingDuration, 'ms');
    return { success: true, path: finalPath, duration: recordingDuration };

  } catch (error) {
    log.error('Error stopping recording:', error);
    isManualStop = false;
    return { success: false, error: error.message };
  }
}

// Pause by stopping current segment without merging
ipcMain.handle('pause-recording', async () => {
  try {
    if (!isRecording || !recordingProcess) {
      return { success: false, error: 'No active recording' };
    }
    stopRecording();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Resume by starting a new segment with last used options (basic: reuse defaults)
ipcMain.handle('resume-recording', async (event, options = {}) => {
  try {
    if (isRecording) {
      return { success: false, error: 'Already recording' };
    }
    // Increment segment counter for unique name
    segmentCounter += 1;
    await startRecording(options);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Finalize: if multiple segments exist, concat into final output
ipcMain.handle('finalize-recording', async () => {
  try {
    if (segmentPaths.length === 0) {
      return { success: false, error: 'No segments to finalize' };
    }
    if (segmentPaths.length === 1) {
      // Single segment: rename to final output if needed
      const onlySeg = segmentPaths[0];
      if (onlySeg !== currentRecordingPath) {
        fs.copyFileSync(onlySeg, currentRecordingPath);
      }
      return { success: true, path: currentRecordingPath };
    }
    // Build concat list file
    const concatListPath = path.join(path.dirname(currentRecordingPath), `concat-${Date.now()}.txt`);
    const listContent = segmentPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
    fs.writeFileSync(concatListPath, listContent, 'utf8');
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy'])
        .on('end', resolve)
        .on('error', reject)
        .save(currentRecordingPath);
    });
    // Cleanup concat list (keep segments for now or delete them if desired)
    try { fs.unlinkSync(concatListPath); } catch {}
    return { success: true, path: currentRecordingPath };
  } catch (e) {
    log.error('Finalize error:', e);
    return { success: false, error: e.message };
  }
});

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

// List audio devices (basic)
ipcMain.handle('list-audio-devices', async () => {
  try {
    if (process.platform === 'win32') {
      const devices = await getAudioDevices();
      return { success: true, devices };
    }
    if (process.platform === 'linux') {
      // Minimal support: rely on PulseAudio default
      return { success: true, devices: ['default'] };
    }
    if (process.platform === 'darwin') {
      // avfoundation device listing would require separate probing; return default
      return { success: true, devices: ['default'] };
    }
    return { success: true, devices: ['default'] };
  } catch (e) {
    return { success: false, error: e.message };
  }
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

ipcMain.handle('pick-video-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Media', extensions: ['mp4','mkv','mov','avi','webm','mp3','wav','aac'] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, path: result.filePaths[0] };
    }
    return { success: false, error: 'Canceled' };
  } catch (e) {
    return { success: false, error: e.message };
  }
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

// Projects persistence API
ipcMain.handle('get-projects', async () => {
  try {
    return store.get('projects', []);
  } catch (e) {
    return [];
  }
});

ipcMain.handle('save-project', async (event, project) => {
  try {
    const list = store.get('projects', []);
    const existingIndex = list.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) list[existingIndex] = project; else list.unshift(project);
    store.set('projects', list);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('get-recent-recordings', async () => {
  try {
    return store.get('recentRecordings', []);
  } catch (e) {
    return [];
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

// Editing: Trim a clip (input -> output) by start and end (seconds)
ipcMain.handle('edit-trim', async (event, { input, output, startSec, endSec }) => {
  try {
    if (!fs.existsSync(input)) return { success: false, error: 'Input not found' };
    await new Promise((resolve, reject) => {
      ffmpeg(input)
        .setStartTime(startSec || 0)
        .setDuration(Math.max(0, (endSec || 0) - (startSec || 0)))
        .outputOptions(['-c', 'copy'])
        .on('end', resolve)
        .on('error', reject)
        .save(output);
    });
    return { success: true, output };
  } catch (e) {
    log.error('edit-trim error:', e);
    return { success: false, error: e.message };
  }
});

// Editing: Merge multiple clips using concat demuxer
ipcMain.handle('edit-merge', async (event, { inputs, output }) => {
  try {
    if (!Array.isArray(inputs) || inputs.length === 0) return { success: false, error: 'No inputs' };
    const listPath = path.join(path.dirname(output), `merge-${Date.now()}.txt`);
    fs.writeFileSync(listPath, inputs.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'));
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy'])
        .on('end', resolve)
        .on('error', reject)
        .save(output);
    });
    try { fs.unlinkSync(listPath); } catch {}
    return { success: true, output };
  } catch (e) {
    log.error('edit-merge error:', e);
    return { success: false, error: e.message };
  }
});

// Export presets: transcode with selected format/bitrate/container
ipcMain.handle('export-transcode', async (event, { input, output, preset }) => {
  try {
    if (!fs.existsSync(input)) return { success: false, error: 'Input not found' };
    const p = preset || { container: 'mp4', vcodec: 'libx264', acodec: 'aac', videoBitrate: '6000k', audioBitrate: '192k', fps: null, scale: null };
    await new Promise((resolve, reject) => {
      let cmd = ffmpeg(input);
      if (p.scale) cmd = cmd.videoFilters(`scale=${p.scale}`);
      if (p.fps) cmd = cmd.outputOptions(['-r', String(p.fps)]);
      if (p.vcodec) cmd = cmd.videoCodec(p.vcodec);
      if (p.acodec) cmd = cmd.audioCodec(p.acodec);
      const outOpts = [];
      if (p.videoBitrate) outOpts.push('-b:v', p.videoBitrate);
      if (p.audioBitrate) outOpts.push('-b:a', p.audioBitrate);
      if (p.container === 'gif') {
        // High quality GIF: palettegen + paletteuse (simplified one-pass here for speed)
        cmd = cmd.outputOptions(['-filter_complex', 'fps=12,scale=640:-1:flags=lanczos']);
      }
      // Image sequence export
      let savePath = output;
      if (p.container === 'pngseq' || p.container === 'jpgseq') {
        const ext = p.container === 'pngseq' ? 'png' : 'jpg';
        const dir = path.dirname(output);
        const base = path.basename(output, path.extname(output));
        savePath = path.join(dir, `${base}_%05d.${ext}`);
        cmd = cmd.outputOptions(['-vsync', '0']);
        // mute audio for image sequence
        cmd = cmd.noAudio();
      }
      exportProcess = cmd
        .outputOptions([...outOpts, '-movflags', '+faststart'])
        .on('progress', (prog) => {
          try { if (mainWindow) mainWindow.webContents.send('export-progress', { timemark: prog.timemark, percent: prog.percent || 0 }); } catch {}
        })
        .on('end', () => { exportProcess = null; resolve(); })
        .on('error', (err) => { exportProcess = null; reject(err); })
        .save(savePath);
    });
    return { success: true, output };
  } catch (e) {
    log.error('export-transcode error:', e);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('cancel-export', async () => {
  try {
    if (exportProcess && exportProcess.ffmpegProc) {
      try { exportProcess.ffmpegProc.kill('SIGTERM'); } catch {}
      exportProcess = null;
      return { success: true };
    }
    return { success: false, error: 'No export in progress' };
  } catch (e) {
    return { success: false, error: e.message };
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

  if (TEST_MODE) {
    // Minimal HTTP harness to drive flows in CI
    const http = require('http');
    testServer = http.createServer(async (req, res) => {
      try {
        if (req.url?.startsWith('/start')) {
          await startRecording({});
          res.writeHead(200); res.end('started'); return;
        }
        if (req.url?.startsWith('/pause')) {
          stopRecording();
          res.writeHead(200); res.end('paused'); return;
        }
        if (req.url?.startsWith('/resume')) {
          await startRecording({});
          res.writeHead(200); res.end('resumed'); return;
        }
        if (req.url?.startsWith('/stop')) {
          stopRecording();
          res.writeHead(200); res.end('stopped'); return;
        }
        if (req.url?.startsWith('/finalize')) {
          // In TEST_MODE, treat as success with current path
          const r = { success: true, path: currentRecordingPath };
          res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(r)); return;
        }
        res.writeHead(404); res.end('not found');
      } catch (e) {
        res.writeHead(500); res.end(e.message);
      }
    }).listen(3123);
  }
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
  if (testServer) {
    try { testServer.close(); } catch {}
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
