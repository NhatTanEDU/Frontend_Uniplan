#!/usr/bin/env node

// Railway Frontend Start Script with PORT handling
console.log('🔍 Railway Frontend Start Debug:');
console.log('================================');

// Check environment variables
const port = process.env.PORT || '3000';
const nodeEnv = process.env.NODE_ENV || 'production';
const apiUrl = process.env.REACT_APP_API_URL || 'undefined';

console.log('🌍 Environment Variables:');
console.log('  PORT:', port);
console.log('  NODE_ENV:', nodeEnv);
console.log('  REACT_APP_API_URL:', apiUrl);

// Validate PORT
if (!port || port === 'undefined' || isNaN(parseInt(port))) {
  console.log('❌ Invalid PORT value:', port);
  console.log('🔄 Using fallback PORT: 3000');
  process.env.PORT = '3000';
}

// Check build directory
const fs = require('fs');
const path = require('path');

const buildPath = path.join(process.cwd(), 'build');
console.log('\n🔍 Checking build directory:', buildPath);

if (!fs.existsSync(buildPath)) {
  console.error('❌ Build directory does not exist!');
  process.exit(1);
}

const indexPath = path.join(buildPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in build directory!');
  process.exit(1);
}

console.log('✅ Build directory and index.html found');

// Start serve with proper error handling
const { spawn } = require('child_process');

const finalPort = process.env.PORT || '3000';
console.log('\n🚀 Starting serve...');
console.log('🌐 Command: npx serve -s build -l', finalPort);

// Use serve without -l flag (alternative approach)
const serveArgs = ['-s', 'build', '-p', finalPort];
console.log('🔧 Alternative command: npx serve', serveArgs.join(' '));

const serveProcess = spawn('npx', ['serve', ...serveArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: finalPort
  }
});

serveProcess.on('error', (error) => {
  console.error('❌ Serve process error:', error);
  
  // Fallback: try with different serve syntax
  console.log('🔄 Trying fallback serve command...');
  const fallbackArgs = ['-s', 'build'];
  const fallbackProcess = spawn('npx', ['serve', ...fallbackArgs], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: finalPort
    }
  });
  
  fallbackProcess.on('error', (fallbackError) => {
    console.error('❌ Fallback serve also failed:', fallbackError);
    process.exit(1);
  });
});

serveProcess.on('close', (code) => {
  console.log('🔄 Serve process exited with code:', code);
  if (code !== 0) {
    console.error('❌ Serve failed with exit code:', code);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  serveProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  serveProcess.kill('SIGINT');
});
