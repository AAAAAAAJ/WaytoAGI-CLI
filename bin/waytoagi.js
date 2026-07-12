#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgRoot = path.resolve(__dirname, '..');

// Find claude cli.js
const candidates = [
  path.resolve(pkgRoot, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(pkgRoot, '..', '@anthropic-ai', 'claude-code', 'cli.js'),
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

// Apply branding patch on first run
const patchMarker = claudeCli + '.waytoagi-patched';
if (!fs.existsSync(patchMarker)) {
  try {
    let code = fs.readFileSync(claudeCli, 'utf8');
    const original = code;

    // ── 1. Border titles: "Claude Code" → "WaytoAGI" ──
    // Search for the specific string literal structure in the UI components
    code = code.replace(/"Claude Code"/g, '"WaytoAGI"');
    code = code.replace(/" Claude Code "/g, '" WaytoAGI "');

    // ── 2. CondensedLogo: rainbow WaytoAGI ──
    code = code.replace(
      /createElement\(\w+,\{bold:\s*!0\},"Claude Code"\)/g,
      'createElement(t,{bold:!0},createElement(t,{color:"#FF4444"},"W"),createElement(t,{color:"#FF8C00"},"a"),createElement(t,{color:"#FFD700"},"y"),createElement(t,{color:"#44FF44"},"t"),createElement(t,{color:"#00CCFF"},"o"),createElement(t,{color:"#4488FF"},"A"),createElement(t,{color:"#9944FF"},"G"),createElement(t,{color:"#FF44CC"},"I"))'
    );

    // ── 3. Replace "Welcome back" greeting ──
    code = code.replace(/return`Welcome back \$\{q\}!`/g, 'return"\\u2728 WaytoAGI CLI \\u2728"');
    code = code.replace(/return"Welcome back!"/g, 'return"\\u2728 WaytoAGI CLI \\u2728"');

    // ── 4. Force single-column layout ──
    // Find the layout-choosing function by its signature: accepts a width/size parameter, 
    // checks a threshold, and returns "horizontal" or "compact".
    const layoutFunctionRegex = /function\s+(\w+)\s*\((\w+)\)\{if\s*\(\2\s*>=?\s*\d+\)\s*return\s*"horizontal";\s*return\s*"compact"\}/;
    const match = code.match(layoutFunctionRegex);
    if (match) {
        code = code.replace(match[0], `function ${match[1]}(${match[2]}){return"compact"}`);
    } else {
        console.warn('[waytoagi] Warning: Failed to find layout function to force compact mode.');
    }

    // ── 5. System prompt identity ──
    code = code.replace(/You are Claude Code, Anthropic's official CLI for Claude\./g, 'You are WaytoAGI CLI, an AI-powered coding assistant.');
    code = code.replace(/"Anthropic's official CLI for Claude"/g, '"AI Community \\u00b7 Empowered by AI"');

    if (code !== original) {
      fs.writeFileSync(claudeCli, code, 'utf8');
      fs.writeFileSync(patchMarker, Date.now().toString(), 'utf8');
      console.log('[waytoagi] Branding applied successfully.');
    } else {
      console.warn('[waytoagi] Warning: No changes made to branding, patch might be outdated.');
    }
  } catch (e) {
    console.error('[waytoagi] Error applying branding patch:', e.message);
  }
}

try {
  execFileSync(process.execPath, [claudeCli, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  });
} catch (e) {
  process.exitCode = e.status || 1;
}
