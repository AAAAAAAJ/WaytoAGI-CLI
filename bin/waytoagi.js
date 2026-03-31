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

    // ── 4. Replace Clawd mascot with rainbow ASCII art banner ──
    // Find: <React>.createElement(<Box>,{marginY:1},<React>.createElement(<ClawdComponent>,null))
    // Replace with rainbow ASCII art rows
    code = code.replace(
      /(\w+)\.createElement\((\w+),\{marginY:1\},\1\.createElement\((\w+),null\)\)/g,
      function(match, R, Box, Clawd, offset, fullCode) {
        // Only patch in the logo area (offset ~10M)
        if (offset < 10000000 || offset > 11000000) return match;

        // Find the Text component variable by looking nearby for createElement(X,{dimColor:
        var nearby = fullCode.substring(offset, Math.min(fullCode.length, offset + 500));
        var tm = nearby.match(new RegExp(R + '\\.createElement\\((\\w+),\\{dimColor'));
        var TextComp = tm ? tm[1] : 'v';

        // ASCII art rows for each letter with its color
        // W=#FF4444 a=#FF8C00 y=#FFD700 t=#44FF44 o=#00CCFF A=#4488FF G=#9944FF I=#FF44CC
        var letters = [
          { c: '#FF4444', rows: ['\u2588\u2588\u2557    \u2588\u2588\u2557','\u2588\u2588\u2551    \u2588\u2588\u2551','\u2588\u2588\u2551 \u2588\u2557 \u2588\u2588\u2551','\u2588\u2588\u2551\u2588\u2588\u2588\u2557\u2588\u2588\u2551','\u255A\u2588\u2588\u2588\u2554\u2588\u2588\u2588\u2554\u255D',' \u255A\u2550\u2550\u255D\u255A\u2550\u2550\u255D '] },
          { c: '#FF8C00', rows: [' \u2588\u2588\u2588\u2588\u2588\u2557 ','\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557','\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551','\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551','\u2588\u2588\u2551  \u2588\u2588\u2551','\u255A\u2550\u255D  \u255A\u2550\u255D'] },
          { c: '#FFD700', rows: ['\u2588\u2588\u2557   \u2588\u2588\u2557','\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D',' \u255A\u2588\u2588\u2588\u2588\u2554\u255D ','  \u255A\u2588\u2588\u2554\u255D  ','   \u2588\u2588\u2551   ','   \u255A\u2550\u255D   '] },
          { c: '#44FF44', rows: ['\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557','\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D','   \u2588\u2588\u2551   ','   \u2588\u2588\u2551   ','   \u2588\u2588\u2551   ','   \u255A\u2550\u255D   '] },
          { c: '#00CCFF', rows: [' \u2588\u2588\u2588\u2588\u2588\u2588\u2557 ','\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557','\u2588\u2588\u2551   \u2588\u2588\u2551','\u2588\u2588\u2551   \u2588\u2588\u2551','\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D',' \u255A\u2550\u2550\u2550\u2550\u2550\u255D '] },
          { c: '#4488FF', rows: [' \u2588\u2588\u2588\u2588\u2588\u2557 ','\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557','\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551','\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551','\u2588\u2588\u2551  \u2588\u2588\u2551','\u255A\u2550\u255D  \u255A\u2550\u255D'] },
          { c: '#9944FF', rows: [' \u2588\u2588\u2588\u2588\u2588\u2588\u2557 ','\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D ','\u2588\u2588\u2551  \u2588\u2588\u2588\u2557','\u2588\u2588\u2551   \u2588\u2588\u2551','\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D',' \u255A\u2550\u2550\u2550\u2550\u2550\u255D '] },
          { c: '#FF44CC', rows: [' \u2588\u2588\u2557 ',' \u2588\u2588\u2551 ',' \u2588\u2588\u2551 ',' \u2588\u2588\u2551 ',' \u2588\u2588\u2551 ',' \u255A\u2550\u255D '] }
        ];

        // Build: Box(column) > 6x Box(row) > 8x Text(colored letter row)
        // v = Text component (Ink), Box = m
        var rowElements = [];
        for (var r = 0; r < 6; r++) {
          var cols = [];
          for (var l = 0; l < letters.length; l++) {
            cols.push(R + '.createElement(' + TextComp + ',{color:"' + letters[l].c + '"},' + JSON.stringify(letters[l].rows[r]) + ')');
          }
          rowElements.push(R + '.createElement(' + Box + ',{flexDirection:"row"},' + cols.join(',') + ')');
        }

        return R + '.createElement(' + Box + ',{marginY:1,flexDirection:"column"},' + rowElements.join(',') + ')';
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
