#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgRoot = path.resolve(__dirname, '..');
const markerFile = path.resolve(pkgRoot, '.needs-patch');

// If postinstall couldn't find cli.js, try patching now
if (fs.existsSync(markerFile)) {
  try {
    execFileSync(process.execPath, [path.resolve(pkgRoot, 'postinstall.js')], {
      stdio: 'inherit'
    });
    fs.unlinkSync(markerFile);
  } catch (e) {
    // Continue anyway
  }
}

// Find claude cli.js
const candidates = [
  path.resolve(pkgRoot, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(pkgRoot, '..', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(pkgRoot, '..', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
];

let claudeCli = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    claudeCli = p;
    break;
  }
}

if (!claudeCli) {
  console.error('Error: Could not find CLI engine. Try reinstalling: npm install -g github:AAAAAAAJ/WaytoAGI-CLI');
  process.exit(1);
}

try {
  execFileSync(process.execPath, [claudeCli, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  });
} catch (e) {
  process.exitCode = e.status || 1;
}
