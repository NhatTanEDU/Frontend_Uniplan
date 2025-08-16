#!/usr/bin/env node

// Node.js Static Server - NO SERVE PACKAGE
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

console.log('🚀 Node.js Static Server Starting...');
console.log('====================================');

// Configuration
const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.join(__dirname, 'build');

console.log('🌐 PORT:', PORT);
console.log('📁 BUILD_DIR:', BUILD_DIR);

// Check build directory
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory does not exist:', BUILD_DIR);
  process.exit(1);
}

const indexPath = path.join(BUILD_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found:', indexPath);
  process.exit(1);
}

console.log('✅ Build directory and index.html verified');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Security: prevent directory traversal
  if (pathname.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const filePath = path.join(BUILD_DIR, pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found - serve index.html for SPA routing
      const indexContent = fs.readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexContent);
      return;
    }
    
    // File exists - serve it
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log('✅ Server started successfully!');
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log('📋 Environment:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
