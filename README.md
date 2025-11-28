# Esprit

**AI-Powered Penetration Testing Agent**

Esprit is an autonomous security assessment tool that uses AI agents to perform comprehensive penetration tests. It can analyze web applications, APIs, code repositories, and network targets with minimal human intervention.

---

## Features

### AI-Driven Security Testing
- **Autonomous agent** powered by LLMs (Claude, GPT-4, local models)
- **Multi-target support**: URLs, GitHub repos, local code, IP addresses
- **Comprehensive testing**: OWASP Top 10, business logic, authentication flaws
- **Real-time reporting** with detailed vulnerability findings

### Tool Suite
| Tool | Description |
|------|-------------|
| **Browser** | Automated browser for web app testing (Playwright) |
| **Terminal** | Command execution for recon and exploitation |
| **Proxy** | HTTP/HTTPS interception via Caido |
| **File Editor** | Source code analysis and modification |
| **Web Search** | Real-time research via Perplexity |
| **Python REPL** | Custom exploit development |
| **Notes** | Findings documentation |
| **Reporting** | Automated vulnerability reports |

### Vulnerability Detection
- SQL Injection
- Cross-Site Scripting (XSS)
- Authentication & JWT flaws
- IDOR & Broken Access Control
- SSRF & Path Traversal
- Race Conditions
- Business Logic Vulnerabilities
- Mass Assignment
- And more...

### Deployment Options

| Mode | Description |
|------|-------------|
| **Local** | Run on your machine with Docker |
| **Cloud** | SaaS platform with hosted sandboxes |
| **Hybrid** | Authenticate via cloud, run locally |

---

## Quick Start

### Option 1: Homebrew (Recommended)

```bash
# Install
brew tap improdead/esprit
brew install esprit

# Login (opens browser)
esprit login

# Run a scan
esprit scan --target https://example.com
```

### Option 2: From Source (Local Mode)

```bash
# Clone the repository
git clone https://github.com/improdead/esprit.git
cd esprit/cli

# Install dependencies
pip install poetry
poetry install

# Set environment variables
export ESPRIT_LLM="anthropic/claude-sonnet-4-20250514"
export LLM_API_KEY="your-api-key"

# Run a scan
poetry run esprit scan --target https://example.com
```

### Option 3: Docker

```bash
docker run -it \
  -e ESPRIT_LLM="anthropic/claude-sonnet-4-20250514" \
  -e LLM_API_KEY="your-api-key" \
  ghcr.io/improdead/esprit:latest \
  scan --target https://example.com
```

---

## Usage

### Basic Commands

```bash
# Authentication (SaaS mode)
esprit login                    # Login via browser OAuth
esprit logout                   # Clear credentials
esprit whoami                   # Show current user
esprit status                   # Show usage/quota

# Scanning
esprit scan --target <target>   # Run a penetration test
```

### Scan Targets

```bash
# Web application
esprit scan --target https://api.example.com

# GitHub repository (white-box)
esprit scan --target https://github.com/user/repo

# Local codebase
esprit scan --target ./my-project

# IP address
esprit scan --target 192.168.1.100

# Multiple targets
esprit scan --target https://api.example.com --target https://github.com/user/repo
```

### Custom Instructions

```bash
# Focus on specific vulnerabilities
esprit scan --target example.com --instruction "Focus on authentication and JWT vulnerabilities"

# From a file
esprit scan --target example.com --instruction ./instructions.txt
```

### Non-Interactive Mode

```bash
# CI/CD pipeline mode
esprit scan --target https://api.example.com --non-interactive

# Exit codes:
# 0 = No vulnerabilities found
# 2 = Vulnerabilities found
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ESPRIT_LLM` | Yes | LLM model (e.g., `anthropic/claude-sonnet-4-20250514`) |
| `LLM_API_KEY` | Yes* | API key for LLM provider |
| `LLM_API_BASE` | No | Custom API endpoint for local models |
| `PERPLEXITY_API_KEY` | No | Enables web search during testing |

*Not required in SaaS mode (we provide the LLM)

### Supported LLM Providers

```bash
# Anthropic (recommended)
export ESPRIT_LLM="anthropic/claude-sonnet-4-20250514"
export LLM_API_KEY="sk-ant-..."

# OpenAI
export ESPRIT_LLM="openai/gpt-4o"
export LLM_API_KEY="sk-..."

# Local models (Ollama)
export ESPRIT_LLM="ollama/llama3.1:70b"
export LLM_API_BASE="http://localhost:11434"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ESPRIT CLI                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  EspritAgent (AI Core)                               │  │
│  │  - Multi-turn conversation with LLM                  │  │
│  │  - Tool selection and execution                       │  │
│  │  - Vulnerability analysis and reporting               │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                    │
│  ┌─────────────────────┴────────────────────────────────┐  │
│  │  Tool Registry                                        │  │
│  ├──────────┬──────────┬──────────┬──────────┬─────────┤  │
│  │ Browser  │ Terminal │  Proxy   │  Python  │  Notes  │  │
│  │ (Playwright)        │ (Caido)  │  (REPL)  │         │  │
│  └──────────┴──────────┴──────────┴──────────┴─────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Docker Sandbox (Isolated Environment)                      │
│  - Tool Server (FastAPI on port 5000)                       │
│  - Caido Proxy (port 56789)                                 │
│  - Chromium Browser                                         │
│  - Python environment with security tools                   │
└─────────────────────────────────────────────────────────────┘
```

---

## SaaS Platform

The hosted version provides:

- **No Docker required** - Sandboxes run on our infrastructure
- **No API keys needed** - We provide the LLM
- **Web Dashboard** - Start scans, view results, manage settings
- **GitHub Integration** - Scan private repos with OAuth
- **Real-time Updates** - Live scan progress and findings
- **Team Features** - Shared scans and collaboration

### Dashboard Pages

| Page | Features |
|------|----------|
| **Dashboard** | Scan overview, recent activity, stats |
| **New Pentest** | Start scans, add targets, connect GitHub |
| **Scans** | Scan history, status, vulnerability counts |
| **Scan Detail** | Live logs, real-time progress, results |
| **Settings** | Profile, API tokens, notifications |
| **Billing** | Plans, usage, subscription management |

---

## Project Structure

```
esprit/
├── cli/                    # CLI application
│   └── esprit/
│       ├── agents/         # AI agent implementation
│       ├── auth/           # Authentication (login, OAuth)
│       ├── interface/      # TUI and CLI interfaces
│       ├── llm/            # LLM integration (litellm)
│       ├── prompts/        # Jinja templates for prompts
│       ├── runtime/        # Docker/Remote runtime
│       ├── tools/          # Tool implementations
│       └── telemetry/      # Tracing and metrics
│
├── web/                    # React dashboard
│   ├── auth/              # Login, signup, callbacks
│   ├── dashboard/         # Dashboard pages
│   └── lib/               # Supabase, hooks, context
│
├── backend/               # FastAPI backend
│   └── app/
│       ├── api/           # API routes
│       ├── core/          # Config, auth
│       └── services/      # Sandbox, LLM, usage
│
├── infrastructure/        # Terraform for AWS
│   └── terraform/
│
└── homebrew-esprit/       # Homebrew formula
```

---

## Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker
- Poetry

### Setup

```bash
# CLI development
cd cli
poetry install
poetry run esprit --help

# Web dashboard
cd web
npm install
npm run dev

# Backend
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

### Running Tests

```bash
# CLI tests
cd cli
poetry run pytest

# Web tests
cd web
npm test
```

---

## Roadmap

- [ ] Multi-agent collaboration for complex targets
- [ ] Integration with bug bounty platforms
- [ ] Custom vulnerability templates
- [ ] Team workspaces and RBAC
- [ ] Scheduled/recurring scans
- [ ] Slack/Discord notifications
- [ ] PDF report generation
- [ ] API for CI/CD integration

---

## Security

Esprit is designed for **authorized security testing only**.

- Only test systems you own or have explicit permission to test
- Sandboxed execution prevents damage to your local system
- All scan results are stored locally or in your account
- No data is shared with third parties

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- **Documentation**: https://docs.esprit.dev
- **GitHub Issues**: https://github.com/improdead/esprit/issues
- **Discord**: https://discord.gg/esprit
- **Email**: support@esprit.dev

---

## Credits

Built with:
- [LiteLLM](https://github.com/BerriAI/litellm) - LLM abstraction
- [Playwright](https://playwright.dev/) - Browser automation
- [Caido](https://caido.io/) - HTTP proxy
- [Rich](https://rich.readthedocs.io/) - Terminal UI
- [Supabase](https://supabase.com/) - Backend-as-a-Service
