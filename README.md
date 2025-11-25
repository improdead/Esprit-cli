<p align="center">
  <a href="#">
    <img src=".github/logo.png" width="150" alt="Esprit Logo">
  </a>
</p>

<h1 align="center">Esprit</h1>

<h2 align="center">Open-source AI Hackers to secure your Apps</h2>

<div align="center">

[![Python](https://img.shields.io/pypi/pyversions/esprit-cli?color=3776AB)](https://pypi.org/project/esprit-cli/)
[![PyPI](https://img.shields.io/pypi/v/esprit-cli?color=10b981)](https://pypi.org/project/esprit-cli/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

[![GitHub Stars](https://img.shields.io/github/stars/improdead/Esprit-cli)](https://github.com/improdead/Esprit-cli)

</div>

<br>

<div align="center">
  <img src=".github/screenshot.png" alt="Esprit Demo" width="800" style="border-radius: 16px;">
</div>

<br>

> [!TIP]
> **New!** Esprit now integrates seamlessly with GitHub Actions and CI/CD pipelines. Automatically scan for vulnerabilities on every pull request and block insecure code before it reaches production!

---

## 🦉 Esprit Overview

Esprit are autonomous AI agents that act just like real hackers - they run your code dynamically, find vulnerabilities, and validate them through actual proof-of-concepts. Built for developers and security teams who need fast, accurate security testing without the overhead of manual pentesting or the false positives of static analysis tools.

**Key Capabilities:**

- 🔧 **Full hacker toolkit** out of the box
- 🤝 **Teams of agents** that collaborate and scale
- ✅ **Real validation** with PoCs, not false positives
- 💻 **Developer‑first** CLI with actionable reports
- 🔄 **Auto‑fix & reporting** to accelerate remediation


## 🎯 Use Cases

- **Application Security Testing** - Detect and validate critical vulnerabilities in your applications
- **Rapid Penetration Testing** - Get penetration tests done in hours, not weeks, with compliance reports
- **Bug Bounty Automation** - Automate bug bounty research and generate PoCs for faster reporting
- **CI/CD Integration** - Run tests in CI/CD to block vulnerabilities before reaching production

---

## 🚀 Quick Start

**Prerequisites:**
- Docker (running)
- Python 3.12+
- An LLM provider key (e.g. [get OpenAI API key](https://platform.openai.com/api-keys) or use a local LLM)

### Installation & First Scan

```bash
# Install Esprit
pipx install esprit-cli

# Configure your AI provider
export ESPRIT_LLM="openai/gpt-5"
export LLM_API_KEY="your-api-key"

# Run your first security assessment
esprit --target ./app-directory
```

> [!NOTE]
> First run automatically pulls the sandbox Docker image. Results are saved to `esprit_runs/<run-name>`

---

## ✨ Features

### 🛠️ Agentic Security Tools

Esprit agents come equipped with a comprehensive security testing toolkit:

- **Full HTTP Proxy** - Full request/response manipulation and analysis
- **Browser Automation** - Multi-tab browser for testing of XSS, CSRF, auth flows
- **Terminal Environments** - Interactive shells for command execution and testing
- **Python Runtime** - Custom exploit development and validation
- **Reconnaissance** - Automated OSINT and attack surface mapping
- **Code Analysis** - Static and dynamic analysis capabilities
- **Knowledge Management** - Structured findings and attack documentation

### 🎯 Comprehensive Vulnerability Detection

Esprit can identify and validate a wide range of security vulnerabilities:

- **Access Control** - IDOR, privilege escalation, auth bypass
- **Injection Attacks** - SQL, NoSQL, command injection
- **Server-Side** - SSRF, XXE, deserialization flaws
- **Client-Side** - XSS, prototype pollution, DOM vulnerabilities
- **Business Logic** - Race conditions, workflow manipulation
- **Authentication** - JWT vulnerabilities, session management
- **Infrastructure** - Misconfigurations, exposed services

### 🕸️ Graph of Agents

Advanced multi-agent orchestration for comprehensive security testing:

- **Distributed Workflows** - Specialized agents for different attacks and assets
- **Scalable Testing** - Parallel execution for fast comprehensive coverage
- **Dynamic Coordination** - Agents collaborate and share discoveries

---

## 💻 Usage Examples

### Basic Usage

```bash
# Scan a local codebase
esprit --target ./app-directory

# Security review of a GitHub repository
esprit --target https://github.com/org/repo

# Black-box web application assessment
esprit --target https://your-app.com
```

### Advanced Testing Scenarios

```bash
# Grey-box authenticated testing
esprit --target https://your-app.com --instruction "Perform authenticated testing using credentials: user:pass"

# Multi-target testing (source code + deployed app)
esprit -t https://github.com/org/app -t https://your-app.com

# Focused testing with custom instructions
esprit --target api.your-app.com --instruction "Focus on business logic flaws and IDOR vulnerabilities"
```

### 🤖 Headless Mode

Run Esprit programmatically without interactive UI using the `-n/--non-interactive` flag—perfect for servers and automated jobs. The CLI prints real-time vulnerability findings, and the final report before exiting. Exits with non-zero code when vulnerabilities are found.

```bash
esprit -n --target https://your-app.com
```

### 🔄 CI/CD (GitHub Actions)

Esprit can be added to your pipeline to run a security test on pull requests with a lightweight GitHub Actions workflow:

```yaml
name: esprit-penetration-test

on:
  pull_request:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Esprit
        run: pipx install esprit-cli

      - name: Run Esprit
        env:
          ESPRIT_LLM: ${{ secrets.ESPRIT_LLM }}
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}

        run: esprit -n -t ./
```

### ⚙️ Configuration

```bash
export ESPRIT_LLM="openai/gpt-5"
export LLM_API_KEY="your-api-key"

# Optional
export LLM_API_BASE="your-api-base-url"  # if using a local model, e.g. Ollama, LMStudio
export PERPLEXITY_API_KEY="your-api-key"  # for search capabilities
```

[OpenAI's GPT-5](https://openai.com/api/) (`openai/gpt-5`) and [Anthropic's Claude Sonnet 4.5](https://claude.com/platform/api) (`anthropic/claude-sonnet-4-5`) are the recommended models for best results with Esprit. We also support many [other options](https://docs.litellm.ai/docs/providers), including cloud and local models, though their performance and reliability may vary.

## 🤝 Contributing

We welcome contributions from the community! There are several ways to contribute:

### Code Contributions
See our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up your development environment
- Running tests and quality checks
- Submitting pull requests
- Code style guidelines


### Prompt Modules Collection
Help expand our collection of specialized prompt modules for AI agents:
- Advanced testing techniques for vulnerabilities, frameworks, and technologies
- See [Prompt Modules Documentation](esprit/prompts/README.md) for guidelines
- Submit via [pull requests](https://github.com/improdead/Esprit-cli/pulls) or [issues](https://github.com/improdead/Esprit-cli/issues)

## 👥 Join Our Community

Have questions? Found a bug? Want to contribute?

## 🌟 Support the Project

**Love Esprit?** Give us a ⭐ on GitHub!

> [!WARNING]
> Only test apps you own or have permission to test. You are responsible for using Esprit ethically and legally.

</div>
