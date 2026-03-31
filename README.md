# WaytoAGI CLI

<p align="center">
  <strong>AI Community · Empowered by AI</strong>
</p>

<p align="center">
  <a href="https://waytoagi.com">Website</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#features">Features</a>
</p>

---

WaytoAGI CLI is an agentic coding tool that lives in your terminal. It understands your codebase, writes code, fixes bugs, runs commands, and helps you build software — all through natural language.

## Preview

```
╭─ WaytoAGI v1.0.0 ──────────────────────────────────────────────────╮
│                                                                      │
│  ██╗    ██╗ █████╗ ██╗   ██╗████████╗ ██████╗  █████╗  ██████╗ ██╗ │
│  ██║    ██║██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝ ██║ │
│  ██║ █╗ ██║███████║ ╚████╔╝    ██║   ██║   ██║███████║██║  ███╗██║ │
│  ██║███╗██║██╔══██║  ╚██╔╝     ██║   ██║   ██║██╔══██║██║   ██║██║ │
│  ╚███╔███╔╝██║  ██║   ██║      ██║   ╚██████╔╝██║  ██║╚██████╔╝██║ │
│   ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝│
│                                                                      │
│  ❯ ✦ AI Community  ·  Empowered by AI  ✦                            │
│  ────────────────────────────────────────────────────────────────── │
│  claude-opus-4.6  ·  Pro  ·  v1.0.0                                 │
│  ~/your-project                                                      │
│  💡  Tip: Use /help to see all available commands                   │
│                                                                      │
╰──────────────────────────────────────────────────────────────────────╯
```

## Installation

### npm (Recommended)

```bash
npm install -g @anthropic-ai/claude-code
```

### Homebrew (macOS)

```bash
brew install claude-code
```

> Requires Node.js 18+

## Quick Start

```bash
# Navigate to your project
cd your-project

# Start WaytoAGI CLI
claude

# Or start with a task
claude "explain this codebase to me"
```

## Usage

### Interactive Mode

```bash
claude
```

Launch the CLI in interactive mode. Ask questions, give instructions, or let it explore your codebase.

### One-shot Mode

```bash
claude "fix the failing tests in src/utils"
claude "add dark mode support to the settings page"
claude "refactor the auth middleware to use JWT"
```

### Pipe Mode

```bash
cat error.log | claude "explain these errors and suggest fixes"
git diff | claude "review this change"
```

## Features

| Feature | Description |
|---------|-------------|
| **Code Generation** | Write new features, components, and modules from natural language |
| **Bug Fixing** | Describe the bug, let the CLI find and fix it |
| **Code Review** | Get instant feedback on your changes |
| **Refactoring** | Restructure code while preserving behavior |
| **Testing** | Generate and run tests automatically |
| **Git Operations** | Commit, create PRs, manage branches |
| **Multi-file Editing** | Edit multiple files in a single operation |
| **Terminal Commands** | Run shell commands with safety guardrails |
| **MCP Servers** | Extend capabilities with Model Context Protocol |
| **Agent Mode** | Autonomous multi-step task execution |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/compact` | Compact conversation history |
| `/clear` | Clear conversation |
| `/model` | Switch AI model |
| `/cost` | Show token usage and cost |
| `/commit` | Auto-generate a commit message |
| `/review` | Review code changes |
| `/pr` | Create a pull request |
| `/init` | Initialize project configuration |

## Configuration

### CLAUDE.md

Create a `CLAUDE.md` file in your project root to provide project-specific context:

```markdown
# Project Context

- This is a Next.js 14 app with TypeScript
- Use pnpm for package management
- Follow the existing code style
- Tests are in __tests__ directories
```

### Settings

```bash
# Global settings
~/.claude/settings.json

# Project settings
.claude/settings.json
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Esc` | Cancel current operation |
| `Ctrl+C` | Exit |
| `Ctrl+L` | Clear screen |
| `Tab` | Autocomplete |
| `↑` / `↓` | Navigate history |

## Security

- All file operations require explicit approval or configured permissions
- API keys are stored securely in the system keychain
- No code is sent to third parties beyond the AI provider
- Sandbox mode available for restricted environments

## Requirements

- **Node.js** 18 or later
- **OS**: macOS, Linux, or Windows (via WSL)
- **API Key**: Anthropic API key or Claude Pro/Max subscription

## Community

- **Website**: [waytoagi.com](https://waytoagi.com)
- **Issues**: [GitHub Issues](https://github.com/AAAAAAAJ/WaytoAGI-CLI/issues)

## License

MIT
