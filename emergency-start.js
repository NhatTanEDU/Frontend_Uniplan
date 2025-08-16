#!/usr/bin/env node

// Emergency Railway Start Script - Minimal serve command
console.log('🚨 Emergency Railway Start Script');
console.log('================================');

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check build directory
const buildPath = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build directory missing!');
  process.exit(1);
}

// Set PORT environment variable
const port = process.env.PORT || '3000';
console.log('🌐 Using PORT:', port);

// Start serve with minimal command - NO FLAGS
console.log('🚀 Starting: npx serve build');

const serveProcess = spawn('npx', ['serve', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port
  }
});

serveProcess.on('error', (error) => {
  console.error('❌ Emergency serve failed:', error);
  process.exit(1);
});

serveProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Emergency serve exited with code:', code);
    process.exit(code);
  }
});
