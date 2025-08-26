# Movami Screen Recorder

A professional-grade screen recording application with all premium features completely free. Built with Electron and React, offering a modern, intuitive interface for capturing high-quality screen recordings.

## ✨ Features

### 🎥 Core Recording Features
- **Full Screen Recording** - Capture your entire desktop/monitor
- **Window Capture** - Record specific application windows
- **Custom Area Selection** - Drag to select specific screen regions
- **Multi-Monitor Support** - Choose which monitor to record
- **Audio Recording** - System audio, microphone, or both simultaneously
- **Webcam Integration** - Picture-in-picture webcam overlay

### 🎮 Recording Controls
- **Hotkey Controls** - Customizable keyboard shortcuts
- **Recording Timer** - Set automatic start/stop times
- **Countdown Timer** - 3-2-1 countdown before recording begins
- **Pause/Resume** - Pause recording without stopping
- **Real-time Indicator** - Visual feedback during recording
- **System Tray Integration** - Minimize to system tray while recording

### 🎨 Advanced Recording Features
- **Multiple Resolutions** - 720p, 1080p, 1440p, 4K support
- **Frame Rate Selection** - 15, 24, 30, 60 FPS options
- **Codec Selection** - H.264, H.265, VP9 for optimal compression
- **Quality Presets** - Low/Medium/High/Ultra quality settings
- **Hardware Acceleration** - GPU encoding support for better performance
- **Low CPU Usage** - Efficient recording algorithms

### 🎵 Audio Features
- **Multiple Audio Sources** - Record from multiple devices simultaneously
- **Audio Level Monitoring** - Real-time audio level indicators
- **Noise Reduction** - Built-in audio noise suppression
- **Audio Sync** - Automatic audio-video synchronization
- **Separate Audio Tracks** - Export system and mic audio as separate tracks

### ✂️ Editing Capabilities
- **Trim/Cut** - Remove unwanted sections from beginning/end
- **Split Clips** - Cut recordings into multiple segments
- **Merge Videos** - Combine multiple recordings
- **Speed Adjustment** - Slow motion or time-lapse effects
- **Volume Control** - Adjust audio levels throughout the video

### 🎨 Advanced Editing Features
- **Annotations** - Add text, arrows, shapes, and callouts
- **Cursor Effects** - Highlight cursor with glow, ripple, or magnify effects
- **Transitions** - Smooth transitions between clips
- **Filters and Effects** - Color correction, blur, brightness adjustments
- **Green Screen Support** - Chroma key background removal
- **Zoom and Pan** - Add zoom effects to highlight specific areas

### 📤 Export and Sharing Options
- **Video Formats** - MP4, AVI, MOV, WMV, MKV, WebM
- **Audio Formats** - MP3, WAV, AAC for audio-only exports
- **GIF Creation** - Convert clips to animated GIFs
- **Image Sequences** - Export as PNG/JPG frame sequences
- **Custom Bitrate Settings** - Fine-tune file size vs quality
- **Compression Presets** - Web, mobile, high quality presets
- **Batch Processing** - Process multiple recordings simultaneously
- **Background Processing** - Continue working while exporting

### 🔗 Sharing Integration
- **Direct Upload** - One-click upload to YouTube, Vimeo, Google Drive
- **Cloud Storage** - Automatic backup to cloud services
- **Social Media Optimization** - Preset sizes for different platforms
- **Link Sharing** - Generate shareable links for recordings

### 🎨 User Interface and Experience
- **Clean, Intuitive Interface** - Easy-to-use design for all skill levels
- **Dark/Light Themes** - User preference theme options
- **Customizable Workspace** - Rearrangeable panels and tools
- **Keyboard Shortcuts** - Full keyboard navigation support
- **Multi-language Support** - Interface available in multiple languages

### 🛠️ User-Friendly Features
- **Setup Wizard** - First-time user guidance
- **Recording Profiles** - Save frequently used settings
- **Project Management** - Organize recordings into projects
- **Recently Recorded** - Quick access to recent recordings
- **Favorites System** - Mark frequently used tools/settings

### 🚀 Performance Optimization
- **Multi-threading** - Utilize multiple CPU cores efficiently
- **Memory Management** - Optimize RAM usage during recording
- **Storage Efficiency** - Smart compression without quality loss
- **Background Operation** - Minimal system impact while recording
- **Crash Recovery** - Auto-save and recovery features

### 🔒 Privacy and Security
- **Local Processing** - All processing done locally, no cloud dependency
- **No Telemetry** - No user data collection or tracking
- **Secure Storage** - Encrypted local file storage options
- **Privacy Mode** - Automatically blur sensitive information

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movami-screen-recorder.git
   cd movami-screen-recorder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run dist
   ```

## 📁 Project Structure

```
movami-screen-recorder/
├── src/
│   ├── main/                 # Electron main process
│   │   └── main.js          # Main process entry point
│   ├── components/          # React components
│   │   ├── Sidebar.js       # Application sidebar
│   │   ├── RecordingPreview.js
│   │   ├── SourceSelector.js
│   │   ├── QualitySettings.js
│   │   ├── AudioSettings.js
│   │   ├── CountdownSettings.js
│   │   ├── HotkeySettings.js
│   │   ├── ErrorBoundary.js
│   │   ├── ErrorToast.js
│   │   ├── CountdownOverlay.js
│   │   └── RecordingIndicator.js
│   ├── views/               # Main application views
│   │   ├── RecorderView.js  # Main recording interface
│   │   ├── EditorView.js    # Video editing interface
│   │   ├── LibraryView.js   # Video library management
│   │   └── SettingsView.js  # Application settings
│   ├── contexts/            # React contexts
│   │   └── AppContext.js    # Main application state
│   ├── styles/              # Global styles and themes
│   │   └── GlobalStyles.js  # Styled-components theme
│   ├── App.js               # Main React component
│   └── index.js             # React entry point
├── public/                  # Static assets
│   └── index.html           # HTML template
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Usage

### Basic Recording
1. Launch the application
2. Select your recording source (screen, window, or area)
3. Configure quality settings
4. Click "Start Recording" or use the hotkey (Ctrl+Shift+R)
5. Click "Stop Recording" or use the hotkey again

### Advanced Features
- **Countdown Timer**: Set a countdown before recording starts
- **Audio Settings**: Configure system audio and microphone recording
- **Quality Presets**: Choose from Low, Medium, High, or Ultra quality
- **Hotkeys**: Customize keyboard shortcuts in Settings
- **Library Management**: Organize and manage your recordings

## 🛠️ Development

### Available Scripts
- `npm start` - Start the Electron application
- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build the React application
- `npm run dist` - Build and package the application
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Requirements

### System Requirements
- **Windows**: Windows 10 or later
- **macOS**: macOS 10.14 or later
- **Linux**: Ubuntu 18.04 or later
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space
- **Graphics**: Any modern graphics card

### Development Requirements
- Node.js 16.x or higher
- npm 8.x or higher
- Git

## 🔧 Configuration

### Environment Variables
- `NODE_ENV` - Set to 'development' or 'production'
- `ELECTRON_START_URL` - Custom start URL for development

### Build Configuration
The application uses Electron Builder for packaging. Configuration can be found in `package.json` under the `build` section.

## 🐛 Troubleshooting

### Common Issues

1. **Recording not starting**
   - Check system permissions for screen recording
   - Ensure no other recording software is running
   - Verify audio device permissions

2. **Poor performance**
   - Lower the recording quality settings
   - Close unnecessary applications
   - Check available system resources

3. **Audio not recording**
   - Check system audio permissions
   - Verify microphone access
   - Test audio devices in system settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- Styling with [Styled Components](https://styled-components.com/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide React](https://lucide.dev/)
- Video processing with [FFmpeg](https://ffmpeg.org/)

## 🤝 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the documentation

## 🎉 Features Coming Soon

- **Live Streaming** - Stream directly to platforms
- **Advanced Effects** - More video effects and filters
- **Cloud Sync** - Sync recordings across devices
- **Collaboration Tools** - Share and collaborate on recordings
- **Mobile App** - Companion mobile application

---

**Movami Screen Recorder** - Professional screen recording made simple and free for everyone.
