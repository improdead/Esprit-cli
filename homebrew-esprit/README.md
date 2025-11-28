# Homebrew Tap for Esprit

This is the official Homebrew tap for [Esprit](https://esprit.dev), the AI-powered penetration testing CLI.

## Installation

```bash
# Add the tap
brew tap improdead/esprit

# Install Esprit
brew install esprit
```

## Usage

After installation, authenticate and start scanning:

```bash
# Login (opens browser for OAuth)
esprit login

# Check your account
esprit whoami

# Start a security scan
esprit scan --target https://your-app.com

# View usage/quota
esprit status
```

## Upgrading

```bash
brew update
brew upgrade esprit
```

## Uninstalling

```bash
brew uninstall esprit
brew untap improdead/esprit
```

## Requirements

- macOS 11+ or Linux
- Python 3.11+ (installed automatically by Homebrew)

## Troubleshooting

### Authentication Issues

If you have trouble logging in:

```bash
# Clear stored credentials
rm -rf ~/.esprit/credentials.json

# Try logging in again
esprit login
```

### Port Already in Use

The login flow uses port 54321 for the OAuth callback. If this port is in use:

```bash
# Find what's using the port
lsof -i :54321

# Kill the process if needed
kill -9 <PID>
```

## Support

- GitHub Issues: https://github.com/improdead/esprit/issues
- Documentation: https://docs.esprit.dev
- Discord: https://discord.gg/esprit
