# Deploying HOMELAND to Vercel + Supabase

This guide migrates the project from its original embedded PostgreSQL + local-filesystem setup to a serverless-compatible stack.

## What changed in the code

- Removed `embedded-postgres`, `pg-embedded`, and `@embedded-postgres/windows-x64` (these cannot run in Vercel's serverless runtime).
- Removed the `npm run dev:local` script and `scripts/dev.mjs` bootstrapper.
- The Drizzle schema, the `pg`-based connection in `src/db/index.ts`, and the existing `S3_*` storage adapter in `src/lib/storage.ts` are already compatible with Supabase — they only needed the right environment variables.
- `next.config.ts`: added `serverExternalPackages: ['pg']` (so `pg` is not bundled) and `experimental.serverActions.bodySizeLimit: '100mb'` to match the upload limit.
- `drizzle.config.json` now reads `DATABASE_URL` from the environment.
- `.env.example` documents every variable you need.

## 1. Create a Supabase project

1. Go to https://supabase.com and create a new project. Save the database password somewhere safe.
2. Wait for the project to finish provisioning.

### 1a. Get the database connection string

In Supabase: **Project Settings → Database → Connection string → Transaction pooler** (port **6543**, not 5432). Copy the URI. It looks like:

```
postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

> Use the **transaction pooler** (port 6543). It is the only one compatible with Vercel's serverless functions. The direct connection (5432) is for long-lived clients and will exhaust Supabase's connection limit on Vercel.

### 1b. Create the schema

From your local machine, with the connection string exported:

```bash
export DATABASE_URL="postgresql://postgres.PROJECT_REF:...pooler.supabase.com:6543/postgres"
npm install
npm run db:push
```

This applies the Drizzle schema to your Supabase Postgres. (The app also calls `ensureData()` on first request to seed the Originals collection, categories, homepage, FAQs, and Season settings.)

### 1c. Create a private Storage bucket for uploads

In Supabase: **Storage → New bucket**:

- Name: `homeland-uploads` (or any name; update `S3_BUCKET` below to match)
- **Public bucket: OFF** — keep it private. The app issues 60-second signed URLs for downloads.

### 1d. Get S3-compatible credentials for that bucket

In Supabase: **Project Settings → Storage → S3 Access Keys → Generate new key**. Note:

- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

Set `S3_ENDPOINT` to:

```
https://PROJECT_REF.supabase.co/storage/v1/s3
```

Set `S3_REGION` to the region of your Supabase project (e.g. `ap-southeast-1`).

## 2. Push the code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: prepare HOMELAND for Vercel + Supabase"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin git@github.com:YOUR_USER/homeland.git
git push -u origin main
```

## 3. Deploy on Vercel

1. Go to https://vercel.com → **Add New → Project** → import the GitHub repo.
2. **Framework preset:** Next.js (auto-detected).
3. **Build command:** `npm run build` (default).
4. **Install command:** `npm install` (default).
5. Open **Environment Variables** and add the following for the **Production** environment (and Preview if you want):

| Name | Value |
|---|---|
| `DATABASE_URL` | The Supabase **transaction pooler** URI (port 6543) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` (update later to your real domain) |
| `ADMIN_EMAIL` | The email you want to use as the first owner |
| `ADMIN_PASSWORD` | A password of **at least 12 characters** |
| `S3_BUCKET` | `homeland-uploads` |
| `S3_REGION` | e.g. `ap-southeast-1` |
| `S3_ENDPOINT` | `https://PROJECT_REF.supabase.co/storage/v1/s3` |
| `S3_ACCESS_KEY_ID` | From Supabase Storage S3 keys |
| `S3_SECRET_ACCESS_KEY` | From Supabase Storage S3 keys |
| `MAX_UPLOAD_BYTES` | `104857600` (optional, 100MB default) |
| `RESEND_API_KEY` | (optional) for password-reset emails |
| `EMAIL_FROM` | (optional) a verified Resend sender |

6. Click **Deploy**. The first build will fail to talk to the DB until the schema exists — make sure you ran `npm run db:push` in step 1b.
7. After it deploys, visit the site and confirm. The first request seeds the database; `ADMIN_EMAIL` / `ADMIN_PASSWORD` bootstrap the first owner on first successful login. **Remove the two `ADMIN_*` variables from Vercel after you confirm the owner account exists.**

## 4. (Optional) Custom domain

In Vercel: **Settings → Domains → Add**. Then update `NEXT_PUBLIC_SITE_URL` in the environment variables and redeploy.

## 5. (Optional) Configure Resend for password resets

1. Create a Resend account, verify your sending domain, get an API key.
2. In Vercel, add `RESEND_API_KEY` and `EMAIL_FROM="HOMELAND <noreply@your-domain>"`.
3. Redeploy. Without these, the app intentionally reports that reset email is unavailable — it never fabricates delivery.

## 6. Local development (after migration)

```bash
# In .env.local
DATABASE_URL=postgresql://postgres.PROJECT_REF:...pooler.supabase.com:6543/postgres
S3_BUCKET=homeland-uploads
S3_REGION=ap-southeast-1
S3_ENDPOINT=https://PROJECT_REF.supabase.co/storage/v1/s3
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

npm install
npm run dev
```

You can keep using your real Supabase project from local dev, or use a separate Supabase project / branch for development.

## 7. Production-readiness checklist (still required)

This guide gets the site online; it does **not** by itself make it production-hardened. The README's "Honest launch boundaries" and "Before a public production launch" sections still apply. At minimum before opening to untrusted users:

- Configure a custom domain and `NEXT_PUBLIC_SITE_URL`.
- Add malware scanning and a storage lifecycle policy for the S3 bucket.
- Add observability (Vercel logs, Sentry, uptime monitor) and database backups (Supabase Pro has PITR).
- Independent security review and load testing.
- Configure a verified payment provider before enabling paid content.

## Troubleshooting

- **`PoolError: too many clients`** — you used the direct connection (5432) instead of the transaction pooler (6543).
- **Uploads fail with 413** — verify `experimental.serverActions.bodySizeLimit` in `next.config.ts` and `MAX_UPLOAD_BYTES` env var.
- **First request hangs / 500** — schema not applied. Run `npm run db:push` against the same `DATABASE_URL`.
- **Signed download URLs are public** — confirm the Supabase bucket is **private**. The app forces signed URLs for paid content; free previews use the same bucket but route through the server.
- **`@aws-sdk/...` cold start is slow** — this is normal; subsequent requests are fast. Consider keeping the function warm if it matters.
