#!/usr/bin/env node

/**
 * WaytoAGI CLI - Post-install branding patch
 * Applies WaytoAGI branding to the CLI interface.
 */

const fs = require('fs');
const path = require('path');

const CLI_PATH = path.resolve(__dirname, 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');

if (!fs.existsSync(CLI_PATH)) {
  console.log('[waytoagi] Skipping branding patch - cli.js not found');
  process.exit(0);
}

let code = fs.readFileSync(CLI_PATH, 'utf8');
const original = code;

// ── Rainbow ASCII banner (ANSI Shadow style) ──
// Each letter gets a different color via Ink's hex color support
// W=#FF4444  a=#FF8C00  y=#FFD700  t=#44FF44  o=#00CCFF  A=#4488FF  G=#9944FF  I=#FF44CC
const RAINBOW_BANNER_CODE = `
(function(){
  var _wb = [
    {c:"#FF4444",r:["\\u2588\\u2588\\u2557    \\u2588\\u2588\\u2557","\\u2588\\u2588\\u2551    \\u2588\\u2588\\u2551","\\u2588\\u2588\\u2551 \\u2588\\u2557 \\u2588\\u2588\\u2551","\\u2588\\u2588\\u2551\\u2588\\u2588\\u2588\\u2557\\u2588\\u2588\\u2551","\\u255A\\u2588\\u2588\\u2588\\u2554\\u2588\\u2588\\u2588\\u2554\\u255D"," \\u255A\\u2550\\u2550\\u255D\\u255A\\u2550\\u2550\\u255D "]},
    {c:"#FF8C00",r:[" \\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 ","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2557","\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2551","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2551","\\u2588\\u2588\\u2551  \\u2588\\u2588\\u2551","\\u255A\\u2550\\u255D  \\u255A\\u2550\\u255D"]},
    {c:"#FFD700",r:["\\u2588\\u2588\\u2557   \\u2588\\u2588\\u2557","\\u255A\\u2588\\u2588\\u2557 \\u2588\\u2588\\u2554\\u255D"," \\u255A\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D ","  \\u255A\\u2588\\u2588\\u2554\\u255D  ","   \\u2588\\u2588\\u2551   ","   \\u255A\\u2550\\u255D   "]},
    {c:"#44FF44",r:["\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557","\\u255A\\u2550\\u2550\\u2588\\u2588\\u2554\\u2550\\u2550\\u255D","   \\u2588\\u2588\\u2551   ","   \\u2588\\u2588\\u2551   ","   \\u2588\\u2588\\u2551   ","   \\u255A\\u2550\\u255D   "]},
    {c:"#00CCFF",r:[" \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 ","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2550\\u2588\\u2588\\u2557","\\u2588\\u2588\\u2551   \\u2588\\u2588\\u2551","\\u2588\\u2588\\u2551   \\u2588\\u2588\\u2551","\\u255A\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"," \\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D "]},
    {c:"#4488FF",r:[" \\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 ","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2557","\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2551","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2588\\u2588\\u2551","\\u2588\\u2588\\u2551  \\u2588\\u2588\\u2551","\\u255A\\u2550\\u255D  \\u255A\\u2550\\u255D"]},
    {c:"#9944FF",r:[" \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2557 ","\\u2588\\u2588\\u2554\\u2550\\u2550\\u2550\\u2550\\u255D ","\\u2588\\u2588\\u2551  \\u2588\\u2588\\u2588\\u2557","\\u2588\\u2588\\u2551   \\u2588\\u2588\\u2551","\\u255A\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2554\\u255D"," \\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D "]},
    {c:"#FF44CC",r:[" \\u2588\\u2588\\u2557 "," \\u2588\\u2588\\u2551 "," \\u2588\\u2588\\u2551 "," \\u2588\\u2588\\u2551 "," \\u2588\\u2588\\u2551 "," \\u255A\\u2550\\u255D "]}
  ];
  globalThis.__waytoagi_banner = _wb;
})();
`;

// ── 1. Patch border titles: "Claude Code" → "WaytoAGI" ──
// Full border title:  ` ${N7("claude",e)("Claude Code")} ${N7("inactive",e)(...)} `
code = code.replace(
  /(\$\{(\w+)\("claude",\w+\)\()"Claude Code"(\)\})/g,
  '$1"WaytoAGI"$3'
);

// Compact border title: N7("claude",e)(" Claude Code ")
code = code.replace(
  /(\w+\("claude",\w+\)\()" Claude Code "(\))/g,
  '$1" WaytoAGI "$2'
);

// ── 2. Patch CondensedLogo: bold "Claude Code" text ──
code = code.replace(
  /createElement\((\w+),\{bold:\s*!0\},"Claude Code"\)/g,
  'createElement($1,{bold:!0},createElement($1,{color:"#FF4444"},"W"),createElement($1,{color:"#FF8C00"},"a"),createElement($1,{color:"#FFD700"},"y"),createElement($1,{color:"#44FF44"},"t"),createElement($1,{color:"#00CCFF"},"o"),createElement($1,{color:"#4488FF"},"A"),createElement($1,{color:"#9944FF"},"G"),createElement($1,{color:"#FF44CC"},"I"))'
);

// ── 3. Patch system prompt identity ──
code = code.replace(
  /You are Claude Code, Anthropic's official CLI for Claude\./g,
  'You are WaytoAGI CLI, an AI-powered coding assistant.'
);

// ── 4. Patch the tagline in logo area ──
// Look for the "Your personal AI" or similar tagline patterns
code = code.replace(
  /"Anthropic's official CLI for Claude"/g,
  '"AI Community \\u00b7 Empowered by AI"'
);

if (code !== original) {
  fs.writeFileSync(CLI_PATH, code, 'utf8');
  console.log('[waytoagi] Branding applied successfully.');
} else {
  console.log('[waytoagi] No patches applied - CLI may have been updated.');
}
