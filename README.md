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
3. GitHub: OAuth/App credentials and webhook secret
4. AI providers: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
5. Queue: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
6. Stripe: publishable key, secret key, webhook secret

Check local configuration without exposing secret values:

```bash
curl http://localhost:3000/api/env-check
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
```

## GitHub App Webhook

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
