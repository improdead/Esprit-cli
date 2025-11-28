# Esprit SaaS Complete Setup Guide

This comprehensive guide walks you through setting up the entire Esprit SaaS platform, including:
- Supabase database and authentication
- Web dashboard deployment
- Backend API deployment
- AWS infrastructure (ECS sandboxes)
- CLI distribution via Homebrew
- GitHub integration for cloud scanning

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S MACHINE                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Esprit CLI (brew install esprit)                           │   │
│  │  - No Docker required                                        │   │
│  │  - Stores auth token in ~/.esprit/credentials               │   │
│  │  - Connects to remote API                                    │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────────┘
                              │ HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR INFRASTRUCTURE                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Supabase ($25/mo)                                           │   │
│  │  ├─ Auth (OAuth: Google, GitHub)                            │   │
│  │  ├─ PostgreSQL (users, subscriptions, scan history)         │   │
│  │  ├─ Storage (scan reports)                                  │   │
│  │  ├─ Real-time (live dashboard updates)                      │   │
│  │  └─ Row Level Security (multi-tenancy)                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                           │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Backend API (AWS ECS / Railway)                             │   │
│  │  ├─ /api/v1/sandbox/* → Manage ECS scan tasks               │   │
│  │  ├─ /api/v1/llm/* → Proxy LLM requests (your API key)       │   │
│  │  ├─ /api/v1/github/* → GitHub OAuth for repo scanning       │   │
│  │  └─ /api/v1/user/* → Usage tracking & rate limiting         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                           │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  AWS ECS Fargate (~$100-300/mo)                              │   │
│  │  └─ Sandbox containers (one per scan)                       │   │
│  │     ├─ Tool Server (FastAPI on port 5000)                   │   │
│  │     └─ Caido Proxy (port 56789)                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js 18+** (for web dashboard)
- **Python 3.11+** (for CLI and backend)
- **AWS account** (for ECS sandboxes)
- **Supabase account** (free tier available)
- **Anthropic/OpenAI API key** (for LLM)
- **GitHub OAuth App** (for repo integration)
- **Terraform** (for infrastructure)
- **Docker** (for building images)

---

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Save these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon (public) key**: `eyJ...` (for frontend)
   - **service_role key**: `eyJ...` (for backend - KEEP SECRET!)

### 1.2 Run Database Migrations

Go to SQL Editor in Supabase Dashboard and run these migrations in order:

**Migration 1: Core Schema** (`web/supabase/migrations/001_initial_schema.sql`)

```sql
-- Copy the entire contents of 001_initial_schema.sql and run it
```

**Migration 2: GitHub Integration** (`web/supabase/migrations/002_github_integration.sql`)

```sql
-- Copy the entire contents of 002_github_integration.sql and run it
```

### 1.3 Enable OAuth Providers

#### GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Esprit
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://xxxxx.supabase.co/auth/v1/callback`
4. Save **Client ID** and generate **Client Secret**
5. In Supabase Dashboard → Authentication → Providers → GitHub:
   - Enable GitHub
   - Enter Client ID and Client Secret

#### Google OAuth Setup (Optional)

1. Go to Google Cloud Console → APIs & Credentials
2. Create OAuth 2.0 Client ID (Web Application)
3. Add authorized redirect: `https://xxxxx.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google
   - Enter Client ID and Client Secret

### 1.4 Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

Add these to **Redirect URLs**:
```
http://localhost:3000/auth/callback
http://localhost:54321/auth/callback
https://your-domain.com/auth/callback
https://your-domain.com/auth/github/callback
```

### 1.5 Enable Realtime

In Supabase Dashboard → Database → Replication:

Enable realtime for these tables:
- `scans`
- `scan_logs`
- `vulnerabilities`

---

## Part 2: GitHub OAuth App (for Repo Integration)

This is a **separate** OAuth app from Supabase authentication. It allows users to connect their GitHub accounts to scan private repos.

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Esprit Repo Access
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/auth/github/callback`
4. Save **Client ID** and **Client Secret** for backend configuration

---

## Part 3: Web Dashboard Setup

### 3.1 Install Dependencies

```bash
cd web
npm install
```

### 3.2 Configure Environment

Create `web/.env`:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...

# Backend API (for production, use your deployed URL)
VITE_API_URL=http://localhost:8000

# GitHub OAuth (for repo integration - separate from Supabase)
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

### 3.3 Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3.4 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel

# Set environment variables in Vercel dashboard
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_URL
# - VITE_GITHUB_CLIENT_ID
```

---

## Part 4: Backend API Setup

### 4.1 Install Dependencies

```bash
cd backend
pip install poetry
poetry install
```

### 4.2 Configure Environment

Create `backend/.env`:

```bash
# App
DEBUG=true
ENVIRONMENT=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...

# AWS (for ECS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# ECS Configuration (from Terraform output)
ECS_CLUSTER_NAME=esprit-prod-cluster
ECS_TASK_DEFINITION=esprit-prod-sandbox
ECS_SUBNETS=["subnet-xxx","subnet-yyy"]
ECS_SECURITY_GROUPS=["sg-xxx"]

# S3 (from Terraform output)
S3_BUCKET=esprit-prod-scan-results-123456789

# LLM (your API key - users don't need one)
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-...
LLM_MODEL=claude-sonnet-4-20250514

# GitHub OAuth (for repo integration)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Redis (optional, for rate limiting)
REDIS_URL=redis://localhost:6379
```

### 4.3 Run Backend Server

```bash
poetry run uvicorn app.main:app --reload --port 8000
```

API will be available at http://localhost:8000

### 4.4 Deploy Backend

#### Option A: Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

#### Option B: AWS ECS (via Terraform)

See Part 5 for Terraform deployment which includes the backend service.

---

## Part 5: AWS Infrastructure (Terraform)

### 5.1 Prerequisites

```bash
# Install Terraform
brew install terraform

# Install AWS CLI and configure
brew install awscli
aws configure
```

### 5.2 Configure Terraform Variables

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
aws_region  = "us-east-1"
environment = "prod"

# Supabase
supabase_url         = "https://xxxxx.supabase.co"
supabase_service_key = "eyJ..."

# LLM
llm_provider = "anthropic"
llm_api_key  = "sk-ant-..."
llm_model    = "claude-sonnet-4-20250514"

# Optional: Custom domain
# domain_name     = "api.esprit.dev"
# certificate_arn = "arn:aws:acm:..."
```

### 5.3 Deploy Infrastructure

```bash
cd infrastructure

# Initialize Terraform
make init

# Preview changes
make plan

# Apply changes
make apply
```

### 5.4 Push Backend Docker Image

```bash
# Build and push orchestrator image to ECR
make push-orchestrator
```

### 5.5 Get Configuration for Backend

```bash
# Get the backend .env values
make backend-env
```

Copy these values to your backend `.env` file.

### 5.6 Force New Deployment

After pushing a new image:

```bash
make deploy-orchestrator
```

---

## Part 6: CLI Distribution

### 6.1 Homebrew (Recommended)

#### Create Homebrew Tap Repository

1. Create a new GitHub repo: `improdead/homebrew-esprit`
2. Push the contents of `homebrew-esprit/` directory

#### Users Install With:

```bash
brew tap improdead/esprit
brew install esprit
```

### 6.2 Standalone Binary

Build a standalone binary that doesn't require Python:

```bash
cd cli

# Install PyInstaller
pip install pyinstaller

# Build
chmod +x scripts/build.sh
./scripts/build.sh --release
```

The binary will be in `dist/esprit`.

### 6.3 GitHub Releases

Tag a release to trigger automated builds:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The GitHub Actions workflow will:
1. Build binaries for Linux and macOS (Intel + ARM)
2. Create a GitHub Release
3. Update the Homebrew formula

---

## Part 7: Complete Checklist

### Supabase
- [ ] Create project
- [ ] Run Migration 1 (core schema)
- [ ] Run Migration 2 (GitHub integration)
- [ ] Enable GitHub OAuth provider
- [ ] Enable Google OAuth provider (optional)
- [ ] Add redirect URLs
- [ ] Enable realtime for tables

### GitHub OAuth (Repo Access)
- [ ] Create OAuth App
- [ ] Save Client ID and Secret

### Web Dashboard
- [ ] Install dependencies
- [ ] Configure `.env`
- [ ] Test login flow locally
- [ ] Deploy to Vercel/Netlify
- [ ] Configure production environment variables

### Backend API
- [ ] Install dependencies
- [ ] Configure `.env`
- [ ] Test locally
- [ ] Deploy to Railway/AWS

### AWS Infrastructure
- [ ] Configure Terraform variables
- [ ] Run `make apply`
- [ ] Push orchestrator image to ECR
- [ ] Verify ECS service is running

### CLI Distribution
- [ ] Create Homebrew tap repository
- [ ] Tag first release
- [ ] Verify Homebrew installation works

---

## Testing the Full Flow

### 1. Test Authentication

```bash
# Web: Go to your dashboard URL and login with GitHub
# CLI:
esprit login
esprit whoami
```

### 2. Test Scan Creation

From the web dashboard:
1. Go to "New Pentest"
2. Add a URL target
3. Click "Start Engagement"
4. Verify scan appears in dashboard

### 3. Test GitHub Integration

1. Click "Code Repositories" in New Pentest
2. Connect GitHub account
3. Select a repo
4. Start scan

### 4. Verify Real-time Updates

1. Start a scan
2. Click on the scan to view details
3. Verify live logs appear

---

## Cost Estimates

| Service | Monthly Cost |
|---------|--------------|
| Supabase Pro | $25 |
| AWS ECS (5 concurrent avg) | $100-200 |
| AWS ALB | $20 |
| AWS NAT Gateway (2x) | $70 |
| CloudWatch | $5-10 |
| S3 | $5-10 |
| **Total MVP** | **~$225-335/month** |

### Cost Optimization Tips

1. **Use FARGATE_SPOT** for sandboxes (70% cheaper)
2. **Single NAT Gateway** in dev/staging
3. **Reduce log retention** to 7 days for sandboxes
4. **S3 lifecycle policies** to move old reports to Glacier

---

## Troubleshooting

### "Invalid API key" in web dashboard

Check that `VITE_SUPABASE_ANON_KEY` starts with `eyJ` (JWT format).

### OAuth redirect errors

1. Check redirect URLs match exactly in Supabase dashboard
2. Ensure callback URL in GitHub OAuth app is correct
3. Check browser console for specific error

### GitHub repos not loading

1. Verify GitHub OAuth app has `repo` scope
2. Check that GitHub access token is stored in profile
3. Try disconnecting and reconnecting GitHub

### Scan stuck in "pending"

1. Check backend logs: `make logs-orchestrator`
2. Verify ECS can launch tasks: Check CloudWatch logs
3. Check user has remaining quota

### CLI login times out

1. Ensure port 54321 is not in use: `lsof -i :54321`
2. Try different browser
3. Check firewall settings

### ECS tasks failing

1. Check CloudWatch logs: `make logs-sandbox`
2. Verify security groups allow outbound traffic
3. Check task has enough memory/CPU

---

## Support

- **GitHub Issues**: https://github.com/improdead/esprit/issues
- **Documentation**: https://docs.esprit.dev
- **Discord**: https://discord.gg/esprit
- **Email**: support@esprit.dev
