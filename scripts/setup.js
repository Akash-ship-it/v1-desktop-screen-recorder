#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 Setting up Movami Screen Recorder...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not available');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Create necessary directories
const directories = [
  'build',
  'dist',
  'recordings',
  'logs'
];

console.log('\n📁 Creating directories...');
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`ℹ️  Directory already exists: ${dir}`);
  }
});

// Copy environment file if it doesn't exist
const envFile = path.join(process.cwd(), '.env');
const envTemplate = path.join(process.cwd(), '.electron-builder.env');

if (!fs.existsSync(envFile) && fs.existsSync(envTemplate)) {
  fs.copyFileSync(envTemplate, envFile);
  console.log('✅ Created .env file from template');
} else if (fs.existsSync(envFile)) {
  console.log('ℹ️  .env file already exists');
}

// Check FFmpeg installation
console.log('\n🎥 Checking FFmpeg...');
try {
  const ffmpegPath = require.resolve('ffmpeg-static');
  console.log('✅ FFmpeg is available via ffmpeg-static');
} catch (error) {
  console.warn('⚠️  FFmpeg not found in node_modules, will be installed with dependencies');
}

// Display next steps
console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Run "npm start" to launch the Electron app');
console.log('3. Run "npm run build" to build for production');
console.log('4. Run "npm run dist" to create distributable packages');
console.log('\n📚 For more information, see README.md');

// Check for common issues
console.log('\n🔍 Checking for potential issues...');

// Check if running on Windows and suggest WSL for development
if (process.platform === 'win32') {
  console.log('ℹ️  You\'re running on Windows. For the best development experience, consider using WSL2.');
}

// Check available disk space (rough estimate)
try {
  const stats = fs.statSync(process.cwd());
  const freeSpace = require('child_process').execSync('df -h .', { encoding: 'utf8' });
  console.log('ℹ️  Make sure you have at least 2GB of free disk space for development');
} catch (error) {
  // Ignore disk space check errors
}

console.log('\n🚀 Happy coding!');
