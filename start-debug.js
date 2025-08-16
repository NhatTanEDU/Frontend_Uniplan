#!/usr/bin/env node

// Railway Frontend Deployment Debug Script
console.log('🔍 Railway Frontend Deployment Debug:');
console.log('====================================');

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Check environment
console.log('🌍 Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Check current directory
console.log('\n📁 Current working directory:', process.cwd());

// List files in current directory
try {
  const files = fs.readdirSync(process.cwd());
  console.log('\n📋 Files in current directory:');
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const stats = fs.statSync(filePath);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (error) {
  console.error('❌ Error reading directory:', error.message);
}

// Check for build directory
const buildPath = path.join(process.cwd(), 'build');
console.log('\n🔍 Checking build directory:', buildPath);

if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory exists!');
  
  // List build contents
  try {
    const buildFiles = fs.readdirSync(buildPath);
    console.log('📋 Build directory contents:');
    buildFiles.forEach(file => {
      const filePath = path.join(buildPath, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
    
    // Check for index.html
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html found in build directory');
    } else {
      console.log('❌ index.html NOT found in build directory');
    }
  } catch (error) {
    console.error('❌ Error reading build directory:', error.message);
  }
} else {
  console.log('❌ Build directory does NOT exist!');
  console.log('🔄 Running build command...');
  
  // Try to build
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed successfully');
      startServer();
    } else {
      console.log('❌ Build failed with code:', code);
      process.exit(1);
    }
  });
  
  return;
}

// Check serve.json
const serveJsonPath = path.join(process.cwd(), 'serve.json');
console.log('\n🔍 Checking serve.json:', serveJsonPath);
if (fs.existsSync(serveJsonPath)) {
  console.log('✅ serve.json exists');
  try {
    const serveConfig = JSON.parse(fs.readFileSync(serveJsonPath, 'utf8'));
    console.log('📋 serve.json config:', JSON.stringify(serveConfig, null, 2));
  } catch (error) {
    console.error('❌ Error reading serve.json:', error.message);
  }
} else {
  console.log('❌ serve.json NOT found');
}

// Start server
startServer();

function startServer() {
  console.log('\n🚀 Starting server...');
  console.log('====================================');
  
  const port = process.env.PORT || 3000;
  console.log('🌐 Using port:', port);
  
  // Start serve command
  const serveArgs = ['-c', 'serve.json', '-l', port];
  console.log('🔧 Serve command: npx serve', serveArgs.join(' '));
  
  const serveProcess = spawn('npx', ['serve', ...serveArgs], {
    stdio: 'inherit',
    shell: true
  });
  
  serveProcess.on('error', (error) => {
    console.error('❌ Serve process error:', error);
  });
  
  serveProcess.on('close', (code) => {
    console.log('🔄 Serve process exited with code:', code);
    if (code !== 0) {
      process.exit(code);
    }
  });
}
