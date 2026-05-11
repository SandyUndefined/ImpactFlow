# ImpactFlow

ImpactFlow is a public-beta SaaS MVP for AI-assisted repository analysis.

Implemented workflow:

- Login
- Connect GitHub
- Select repo
- Analyze
- View report
- Export PDF

The current build uses mock repositories and a typed Next.js API route at `src/app/api/analyze/route.ts`. The UI is structured so Supabase Auth, GitHub OAuth, a queue worker, and real Claude/OpenAI/Gemini provider calls can replace the mock boundaries without changing the report surface.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Start by copying `.env.example` to `.env.local`. Keep `.env.local` private; it is ignored by git.

The first real integration should fill these groups in order:

1. App URLs: `APP_URL`, `NEXT_PUBLIC_APP_URL`
2. Supabase: auth, database, service role, storage bucket
3. Google Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. GitHub: OAuth/App credentials and webhook secret
5. AI providers: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
6. Queue: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
7. Stripe: publishable key, secret key, webhook secret

Check local configuration without exposing secret values:

```bash
curl http://localhost:3000/api/env-check
curl http://localhost:3000/api/supabase/status
```

## Deploy to Vercel

This repo is ready to publish as a Vercel Next.js project before GitHub OAuth/App credentials are added.

1. Push the repo to GitHub.
2. In Vercel, create a new project and import this repository.
3. Use the default Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave empty
4. Add production environment variables:

```bash
APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

The mock MVP can deploy with only those two variables. Add Supabase, GitHub, AI, queue, and Stripe variables later as those integrations are wired.

Useful deployment checks:

```bash
curl https://your-vercel-domain.vercel.app/api/health
curl https://your-vercel-domain.vercel.app/api/env-check
curl https://your-vercel-domain.vercel.app/api/supabase/status
```

Vercel Web Analytics and Speed Insights are installed at the root layout. After deployment, visit the site and navigate between pages to collect the first page-view and performance data points.

## GitHub App Webhook

Set this URL in the GitHub App setup settings after deploying:

```bash
https://your-vercel-domain.vercel.app/github/setup
```

Set this browser-safe install URL locally and in Vercel:

```bash
NEXT_PUBLIC_GITHUB_APP_INSTALL_URL=https://github.com/apps/<your-github-app-slug>/installations/new
```

For this project, the production setup URL should be:

```bash
https://impact-flow-neon.vercel.app/github/setup
```

Set this URL in the GitHub App webhook settings after deploying:

```bash
https://your-vercel-domain.vercel.app/api/github/webhook
```

Use the same secret in GitHub and in Vercel:

```bash
GITHUB_WEBHOOK_SECRET=<your-random-webhook-secret>
```

Recommended beta events:

- `ping`
- `installation`
- `installation_repositories`
- `push`
- `issues`
- `pull_request`

The webhook route verifies `X-Hub-Signature-256` before accepting events.

## Google Login

Google login is implemented through Supabase Auth. The app redirects users to Google with:

```bash
/auth/callback?next=/
```

Configure Supabase:

1. Supabase Dashboard -> Authentication -> URL Configuration
2. Site URL:

```bash
https://your-vercel-domain.vercel.app
```

3. Redirect URLs:

```bash
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

For this project, your production callback should be:

```bash
https://impact-flow-neon.vercel.app/auth/callback
```

If Supabase sends users to `localhost:3000` after production login, update the Site URL to the production URL and save the change. Localhost should only be an allowed Redirect URL, not the production Site URL.

Do not put the Supabase provider callback URL in the Supabase Redirect URLs list. This URL belongs in Google Cloud only:

```bash
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

Configure Google Cloud:

1. Google Cloud Console -> APIs & Services -> OAuth consent screen
2. Set the app name to `ImpactFlow`
3. Add scopes: `openid`, email, profile
4. Google Cloud Console -> APIs & Services -> Credentials -> Create OAuth client ID
5. Application type: Web application
6. Authorized JavaScript origins:

```bash
http://localhost:3000
https://your-vercel-domain.vercel.app
```

7. Authorized redirect URI:

```bash
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

For your current Supabase project, that Google Cloud redirect URI is:

```bash
https://lkmdzvtefrqzavcuzjif.supabase.co/auth/v1/callback
```

Then paste the Google OAuth client ID and secret into:

```bash
Supabase Dashboard -> Authentication -> Providers -> Google
```

No Google OAuth client secret is needed in this Next.js app when Supabase manages the provider.

## Google Analytics

Create a GA4 Web Data Stream and copy the measurement ID. It starts with `G-`.

Add this locally and in Vercel:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Analytics is loaded from the root layout with `@next/third-parties/google`.
