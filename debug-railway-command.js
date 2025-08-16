#!/usr/bin/env node

// Debug script to verify what command Railway is actually running
console.log('🔍 RAILWAY COMMAND DEBUG');
console.log('========================');

console.log('📋 Process Information:');
console.log('  process.argv:', process.argv);
console.log('  process.argv0:', process.argv0);
console.log('  process.execPath:', process.execPath);
console.log('  process.execArgv:', process.execArgv);

console.log('\n🌍 Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('  RAILWAY_ENVIRONMENT_NAME:', process.env.RAILWAY_ENVIRONMENT_NAME);
console.log('  RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);

console.log('\n📁 File System Check:');
const fs = require('fs');
const path = require('path');

const files = [
  'node-server.js',
  'package.json',
  'Dockerfile',
  'railway.json',
  'railway.toml',
  'Procfile',
  'build/index.html'
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🚀 Starting Node.js server...');
console.log('========================');

// Start the actual server
require('./node-server.js');
