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

    // ── 3. Replace "Welcome back" greeting ──
    code = code.replace(
      /return`Welcome back \$\{q\}!`/g,
      'return"\\u2728 WaytoAGI CLI \\u2728"'
    );
    code = code.replace(
      /return"Welcome back!"/g,
      'return"\\u2728 WaytoAGI CLI \\u2728"'
    );

    // ── 4. Replace the entire Clawd mascot component (oR6) ──
    // Match: function oR6(q){...return P}
    // Replace with a function that renders rainbow ASCII art WaytoAGI
    code = code.replace(
      /function oR6\(q\)\{let K=Y6\(26\)[\s\S]*?return P\}/,
      function(match) {
        // Replace with compact rainbow "WaytoAGI" text logo
        // This fits in the narrow left column of the two-column layout
        // Uses large bold colored letters + a decorative line
        return 'function oR6(q){' +
          'return WY.createElement(m,{flexDirection:"column",alignItems:"center"},' +
            // Rainbow "WaytoAGI" in bold
            'WY.createElement(m,{flexDirection:"row"},' +
              'WY.createElement(v,{bold:!0,color:"#FF4444"},"W"),' +
              'WY.createElement(v,{bold:!0,color:"#FF8C00"},"a"),' +
              'WY.createElement(v,{bold:!0,color:"#FFD700"},"y"),' +
              'WY.createElement(v,{bold:!0,color:"#44FF44"},"t"),' +
              'WY.createElement(v,{bold:!0,color:"#00CCFF"},"o"),' +
              'WY.createElement(v,{bold:!0,color:"#4488FF"},"A"),' +
              'WY.createElement(v,{bold:!0,color:"#9944FF"},"G"),' +
              'WY.createElement(v,{bold:!0,color:"#FF44CC"},"I")),' +
            // Decorative line
            'WY.createElement(v,{dimColor:!0},"\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500"),' +
            // Tagline
            'WY.createElement(v,{dimColor:!0},"AI Community"))}'
      }
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
