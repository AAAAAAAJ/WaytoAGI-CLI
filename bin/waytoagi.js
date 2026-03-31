#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');

// Resolve the claude CLI entry point from our dependency
const claudeCli = path.resolve(__dirname, '..', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');

try {
  execFileSync(process.execPath, [claudeCli, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  });
} catch (e) {
  process.exitCode = e.status || 1;
}
