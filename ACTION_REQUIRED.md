# Action Required - Your Setup Checklist

Your configuration:
- **Domain**: esprit.dev
- **GitHub**: improdead
- **Supabase**: https://frzsqgyzuikwgqsrdkgz.supabase.co
- **LLM**: OpenAI

---

## What's Done

- [x] Supabase project created
- [x] Migration 1 ran (core schema)
- [x] All config files updated with your values

---

## What You Need To Do

### Step 1: Run Migration 2 (GitHub Integration)

In Supabase Dashboard → SQL Editor → New Query:

Copy and paste the entire contents of:
```
web/supabase/migrations/002_github_integration.sql
```

Click **Run**.

---

### Step 2: Enable OAuth in Supabase

Go to: https://supabase.com/dashboard/project/frzsqgyzuikwgqsrdkgz/auth/providers

#### Enable GitHub:
1. Toggle GitHub ON
2. You'll need Client ID and Secret (see Step 3)

#### Enable Google (optional):
1. Toggle Google ON
2. Get credentials from Google Cloud Console

---

### Step 3: Create GitHub OAuth App (for Login)

Go to: https://github.com/settings/developers → **New OAuth App**

| Field | Value |
|-------|-------|
| Application name | `Esprit` |
| Homepage URL | `https://esprit.dev` |
| Authorization callback URL | `https://frzsqgyzuikwgqsrdkgz.supabase.co/auth/v1/callback` |

After creating:
1. Copy **Client ID**
2. Generate **Client Secret**
3. Paste both into Supabase GitHub provider settings

---

### Step 4: Create GitHub OAuth App (for Repo Scanning)

Go to: https://github.com/settings/developers → **New OAuth App**

| Field | Value |
|-------|-------|
| Application name | `Esprit Repo Access` |
| Homepage URL | `https://esprit.dev` |
| Authorization callback URL | `https://app.esprit.dev/auth/github/callback` |

**Save the Client ID and Secret** - you'll need these for the backend.

---

### Step 5: Add Redirect URLs in Supabase

Go to: https://supabase.com/dashboard/project/frzsqgyzuikwgqsrdkgz/auth/url-configuration

Add these to **Redirect URLs**:
```
http://localhost:3000/auth/callback
http://localhost:54321/auth/callback
https://app.esprit.dev/auth/callback
https://app.esprit.dev/auth/github/callback
```

---

### Step 6: Enable Realtime in Supabase

Go to: https://supabase.com/dashboard/project/frzsqgyzuikwgqsrdkgz/database/replication

Enable replication for:
- `scans`
- `scan_logs`

---

### Step 7: Get Your Supabase Service Role Key

Go to: https://supabase.com/dashboard/project/frzsqgyzuikwgqsrdkgz/settings/api

Copy the **service_role** key (the secret one, not anon).

---

### Step 8: Get OpenAI API Key

Go to: https://platform.openai.com/api-keys

Create a new key.

---

## Give Me These Values

Once you complete the steps above, give me:

```yaml
# From Step 4 (GitHub Repo Access OAuth)
github_repo_client_id: ???
github_repo_client_secret: ???

# From Step 7
supabase_service_key: ???

# From Step 8
openai_api_key: ???
```

---

## After That

Once you give me those values, I'll:
1. Configure all environment files
2. You'll run `terraform apply` for AWS
3. Deploy web dashboard to Vercel
4. Deploy backend to Railway
5. Test everything end-to-end

---

## Quick Links

| What | Link |
|------|------|
| Supabase Dashboard | https://supabase.com/dashboard/project/frzsqgyzuikwgqsrdkgz |
| GitHub OAuth Apps | https://github.com/settings/developers |
| OpenAI API Keys | https://platform.openai.com/api-keys |
| Migration 2 File | `web/supabase/migrations/002_github_integration.sql` |
