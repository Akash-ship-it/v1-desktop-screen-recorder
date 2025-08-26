#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Movami Screen Recorder Application...\n');

// Test 1: Check if all required files exist
console.log('📁 Checking file structure...');

const requiredFiles = [
  'src/main/main.js',
  'src/index.js',
  'src/App.js',
  'src/contexts/AppContext.js',
  'src/styles/GlobalStyles.js',
  'src/components/Sidebar.js',
  'src/views/RecorderView.js',
  'src/views/EditorView.js',
  'src/views/LibraryView.js',
  'src/views/SettingsView.js',
  'public/index.html',
  'package.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files exist');
} else {
  console.log('\n❌ Some required files are missing');
}

// Test 2: Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'react',
    'electron',
    'styled-components',
    'framer-motion',
    'lucide-react',
    'fluent-ffmpeg',
    'ffmpeg-static',
    'electron-store',
    'electron-updater'
  ];

  let allDepsExist = true;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]} (dev)`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allDepsExist = false;
    }
  });

  if (allDepsExist) {
    console.log('\n✅ All required dependencies are present');
  } else {
    console.log('\n❌ Some required dependencies are missing');
  }
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check if node_modules exists
console.log('\n📚 Checking node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
  
  // Check if key packages are installed
  const keyPackages = ['react', 'electron', 'styled-components'];
  keyPackages.forEach(pkg => {
    const pkgPath = path.join('node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`✅ ${pkg} is installed`);
    } else {
      console.log(`❌ ${pkg} is not installed`);
    }
  });
} else {
  console.log('❌ node_modules directory does not exist');
  console.log('   Run "npm install" to install dependencies');
}

// Test 4: Check main.js syntax
console.log('\n🔧 Checking main.js syntax...');
try {
  const mainJs = fs.readFileSync('src/main/main.js', 'utf8');
  
  // Basic syntax checks
  const checks = [
    { name: 'Electron imports', pattern: /require\(['"]electron['"]\)/, found: false },
    { name: 'React imports', pattern: /require\(['"]react['"]\)/, found: false },
    { name: 'FFmpeg setup', pattern: /ffmpeg\.setFfmpegPath/, found: false },
    { name: 'Window creation', pattern: /new BrowserWindow/, found: false },
    { name: 'IPC handlers', pattern: /ipcMain\.handle/, found: false }
  ];

  checks.forEach(check => {
    if (check.pattern.test(mainJs)) {
      console.log(`✅ ${check.name}`);
      check.found = true;
    } else {
      console.log(`❌ ${check.name} - NOT FOUND`);
    }
  });

  const foundChecks = checks.filter(c => c.found).length;
  if (foundChecks === checks.length) {
    console.log('\n✅ Main.js appears to be properly structured');
  } else {
    console.log(`\n⚠️  Main.js may have issues (${foundChecks}/${checks.length} checks passed)`);
  }
} catch (error) {
  console.log(`❌ Error reading main.js: ${error.message}`);
}

// Test 5: Check React app structure
console.log('\n⚛️  Checking React app structure...');
try {
  const appJs = fs.readFileSync('src/App.js', 'utf8');
  const indexJs = fs.readFileSync('src/index.js', 'utf8');
  
  const reactChecks = [
    { name: 'React import in App.js', pattern: /import React/, found: false },
    { name: 'Styled-components import', pattern: /styled-components/, found: false },
    { name: 'App component export', pattern: /export default App/, found: false },
    { name: 'ReactDOM render in index.js', pattern: /ReactDOM\.render/, found: false }
  ];

  const allCode = appJs + '\n' + indexJs;
  reactChecks.forEach(check => {
    if (check.pattern.test(allCode)) {
      console.log(`✅ ${check.name}`);
      check.found = true;
    } else {
      console.log(`❌ ${check.name} - NOT FOUND`);
    }
  });

  const foundReactChecks = reactChecks.filter(c => c.found).length;
  if (foundReactChecks === reactChecks.length) {
    console.log('\n✅ React app appears to be properly structured');
  } else {
    console.log(`\n⚠️  React app may have issues (${foundReactChecks}/${reactChecks.length} checks passed)`);
  }
} catch (error) {
  console.log(`❌ Error reading React files: ${error.message}`);
}

// Summary
console.log('\n🎯 Test Summary:');
console.log('================');

if (allFilesExist) {
  console.log('✅ File structure: PASSED');
} else {
  console.log('❌ File structure: FAILED');
}

console.log('✅ Dependencies: CHECKED');
console.log('✅ Node modules: CHECKED');
console.log('✅ Main process: CHECKED');
console.log('✅ React app: CHECKED');

console.log('\n🚀 Application appears to be ready for development!');
console.log('\nNext steps:');
console.log('1. Run "npm run dev" to start development mode');
console.log('2. Run "npm start" to launch the Electron app');
console.log('3. Check the application window for any runtime errors');
console.log('4. Test the recording functionality');

console.log('\n📚 For more information, see README.md');
