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
    code = code.replace(
      /(\$\{(\w+)\("claude",\w+\)\()"Claude Code"(\)\})/g,
      '$1"WaytoAGI"$3'
    );
    code = code.replace(
      /(\w+\("claude",\w+\)\()" Claude Code "(\))/g,
      '$1" WaytoAGI "$2'
    );

    // ── 2. CondensedLogo: rainbow WaytoAGI ──
    code = code.replace(
      /createElement\((\w+),\{bold:\s*!0\},"Claude Code"\)/g,
      'createElement($1,{bold:!0},createElement($1,{color:"#FF4444"},"W"),createElement($1,{color:"#FF8C00"},"a"),createElement($1,{color:"#FFD700"},"y"),createElement($1,{color:"#44FF44"},"t"),createElement($1,{color:"#00CCFF"},"o"),createElement($1,{color:"#4488FF"},"A"),createElement($1,{color:"#9944FF"},"G"),createElement($1,{color:"#FF44CC"},"I"))'
    );

    // ── 3. Replace the "Welcome back" greeting ──
    code = code.replace(
      /return`Welcome back \$\{q\}!`/g,
      'return"\\u2728 WaytoAGI CLI \\u2728"'
    );
    code = code.replace(
      /return"Welcome back!"/g,
      'return"\\u2728 WaytoAGI CLI \\u2728"'
    );

    // ── 4. Replace Clawd cat ASCII art with WaytoAGI text ──
    // The Clawd body renders "█████" with clawd_body color.
    // Replace the pose data to show "WaytoAGI" instead of cat face
    // Original: r1E:"▛███▜" (cat head top), replace all poses
    code = code.replace(
      /\{default:\{r1L:" ▐",r1E:"▛███▜",r1R:"▌",r2L:"▝▜",r2R:"▛▘"\}[^}]*\}[^}]*\}[^}]*\}[^}]*\}/,
      '{default:{r1L:"",r1E:"WaytoAGI",r1R:"",r2L:"",r2R:""},"look-left":{r1L:"",r1E:"WaytoAGI",r1R:"",r2L:"",r2R:""},"look-right":{r1L:"",r1E:"WaytoAGI",r1R:"",r2L:"",r2R:""},"arms-up":{r1L:"",r1E:"WaytoAGI",r1R:"",r2L:"",r2R:""}}'
    );

    // Replace the Clawd body "█████" with space (valid React child = string)
    code = code.replace(
      /color:"clawd_body",backgroundColor:"clawd_background"\},"█████"\)/g,
      'color:"#FF8C00"}," ")'
    );

    // Replace feet with tagline
    code = code.replace(
      /color:"clawd_body"\},"  ","▘▘ ▝▝","  "\)/g,
      'dimColor:!0},"AI Community \\u00b7 Empowered by AI")'
    );

    // Hide Clawd side decorations (replace with empty strings, not objects)
    code = code.replace(
      /color:"clawd_body"\},"▗"\)/g,
      'color:"#FF4444"}," ")'
    );
    code = code.replace(
      /color:"clawd_body"\},"▖"\)/g,
      'color:"#FF44CC"}," ")'
    );

    // Change Clawd bottom pose text
    code = code.replace(
      /default:" ▗   ▖ "/g,
      'default:" "'
    );

    // ── 5. System prompt identity ──
    code = code.replace(
      /You are Claude Code, Anthropic's official CLI for Claude\./g,
      'You are WaytoAGI CLI, an AI-powered coding assistant.'
    );

    code = code.replace(
      /"Anthropic's official CLI for Claude"/g,
      '"AI Community \\u00b7 Empowered by AI"'
    );

    if (code !== original) {
      fs.writeFileSync(claudeCli, code, 'utf8');
      fs.writeFileSync(patchMarker, Date.now().toString(), 'utf8');
    }
  } catch (e) {
    // Patch failed, continue anyway
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
