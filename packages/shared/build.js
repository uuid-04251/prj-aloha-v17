#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building shared package...');

// Clean dist directory
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}

// Compile TypeScript
execSync('tsc', { stdio: 'inherit' });

// Copy package.json to dist
fs.copyFileSync('package.json', 'dist/package.json');

console.log('Build completed successfully!');
