#!/usr/bin/env node

/**
 * WaytoAGI CLI - Post-install branding patch
 */

const fs = require('fs');
const path = require('path');

// Try multiple possible locations for cli.js
const candidates = [
  path.resolve(__dirname, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(__dirname, '..', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.resolve(__dirname, '..', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
];

let CLI_PATH = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    CLI_PATH = p;
    break;
  }
}

if (!CLI_PATH) {
  console.log('[waytoagi] cli.js not found yet - branding will apply on first run.');
  // Write a marker so bin script can patch on first run
  fs.writeFileSync(path.resolve(__dirname, '.needs-patch'), '', 'utf8');
  process.exit(0);
}

applyPatch(CLI_PATH);

function applyPatch(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  const original = code;

  // ── 1. Border titles: "Claude Code" → "WaytoAGI" ──
  code = code.replace(
    /(\$\{(\w+)\("claude",\w+\)\()"Claude Code"(\)\})/g,
    '$1"WaytoAGI"$3'
  );

  // Compact border title
  code = code.replace(
    /(\w+\("claude",\w+\)\()" Claude Code "(\))/g,
    '$1" WaytoAGI "$2'
  );

  // ── 2. CondensedLogo: bold "Claude Code" → rainbow WaytoAGI ──
  code = code.replace(
    /createElement\((\w+),\{bold:\s*!0\},"Claude Code"\)/g,
    'createElement($1,{bold:!0},createElement($1,{color:"#FF4444"},"W"),createElement($1,{color:"#FF8C00"},"a"),createElement($1,{color:"#FFD700"},"y"),createElement($1,{color:"#44FF44"},"t"),createElement($1,{color:"#00CCFF"},"o"),createElement($1,{color:"#4488FF"},"A"),createElement($1,{color:"#9944FF"},"G"),createElement($1,{color:"#FF44CC"},"I"))'
  );

  // ── 3. System prompt identity ──
  code = code.replace(
    /You are Claude Code, Anthropic's official CLI for Claude\./g,
    'You are WaytoAGI CLI, an AI-powered coding assistant.'
  );

  // ── 4. Tagline ──
  code = code.replace(
    /"Anthropic's official CLI for Claude"/g,
    '"AI Community \\u00b7 Empowered by AI"'
  );

  if (code !== original) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('[waytoagi] Branding applied successfully.');
    return true;
  } else {
    console.log('[waytoagi] No patches needed.');
    return false;
  }
}
