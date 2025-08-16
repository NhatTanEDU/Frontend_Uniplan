#!/usr/bin/env node

// Railway Environment Check Script
console.log('🔍 Railway Environment Check:');
console.log('============================');

// Check if we're in Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID;
console.log('🚂 Railway Environment:', isRailway ? 'YES' : 'NO');

if (isRailway) {
  console.log('📋 Railway Environment Variables:');
  console.log('  RAILWAY_ENVIRONMENT_NAME:', process.env.RAILWAY_ENVIRONMENT_NAME);
  console.log('  RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
  console.log('  RAILWAY_SERVICE_NAME:', process.env.RAILWAY_SERVICE_NAME);
}

// Check critical environment variables
console.log('\n🌍 Critical Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('  PORT:', process.env.PORT || 'undefined');
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'undefined');

// Check package.json start script
const fs = require('fs');
const path = require('path');

try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📦 Package.json start script:');
  console.log('  start:', packageJson.scripts?.start || 'undefined');
  
  if (packageJson.scripts?.start === 'npx serve -c serve.json -l $PORT') {
    console.log('✅ Package.json start script is CORRECT');
  } else {
    console.log('❌ Package.json start script is WRONG');
    console.log('   Expected: npx serve -c serve.json -l $PORT');
    console.log('   Actual:', packageJson.scripts?.start);
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// Check for configuration files
const configFiles = [
  'railway.json',
  'Procfile', 
  'nixpacks.toml',
  'serve.json',
  'start-debug.js'
];

console.log('\n📋 Configuration Files:');
configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check build directory
const buildPath = path.join(process.cwd(), 'build');
const buildExists = fs.existsSync(buildPath);
console.log('\n🔨 Build Directory:');
console.log(`  ${buildExists ? '✅' : '❌'} build/ directory`);

if (buildExists) {
  const indexPath = path.join(buildPath, 'index.html');
  const indexExists = fs.existsSync(indexPath);
  console.log(`  ${indexExists ? '✅' : '❌'} build/index.html`);
}

console.log('\n============================');
console.log('🎯 Environment check completed');

// If this is being run as start command, continue to actual start
if (process.argv.includes('--start')) {
  console.log('🚀 Continuing to start application...');
  require('./start-debug.js');
}
