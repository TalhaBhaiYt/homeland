# HOMELAND

A content-first digital resource platform built with Next.js App Router, PostgreSQL, Drizzle ORM, Framer Motion, and the installed UI/UX Pro Max skill (`.agents/skills/ui-ux-pro-max`).

## Run

Use the platform-managed build/start command to bootstrap the local database. Apply the schema with `npx drizzle-kit push`. The first request initializes the original starter collection, categories, editable homepage settings, FAQs, and Season 5 settings. There are no fake download counters or reviews.

## Environment

- `DATABASE_URL`: PostgreSQL connection (provided by the environment).
- `NEXT_PUBLIC_SITE_URL`: real public HTTPS origin. Defaults to a clearly non-production example domain for metadata; configure before launch.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: optional first-owner initialization. Password must be at least 12 characters. Initialization never overwrites an existing account or grants a role to an existing email. Remove the initialization variables after setup. No administrative credentials are hard-coded.
- `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`: optional private S3-compatible object storage. Keep the bucket private. Signed download links expire after 60 seconds. Without these variables, `.storage/` is a private local filesystem adapter suitable for this single-server preview, not a durable multi-instance deployment. Persist that directory or configure object storage before deploying.
- `MAX_UPLOAD_BYTES`: optional server memory-backed upload size limit. Defaults to 104857600 bytes (100 MB). Upload counts are not capped; abuse rate limiting applies. For large-scale delivery, move uploads to a streaming/quarantine object-storage pipeline and configure a malware scanner before opening registration to untrusted publishers.
- `RESEND_API_KEY`, `EMAIL_FROM`: configure a verified Resend sender for password-reset emails. Recovery tokens are single-use, hashed, expire after 30 minutes, and revoke existing sessions. Without email configuration, recovery clearly reports that it is unavailable; it never fabricates delivery.

## Implemented flows

- Server-rendered resource discovery, search/filter/sort, categories, creator profiles, original resource detail pages.
- Registration, login, secure HTTP-only sessions, scrypt password hashes, persistent abuse rate limiting, same-origin mutation checks, role-based dashboard routing.
- Free downloads with actual delivery and recorded counts; paid download authorization checks verified purchases. Guest free downloads are allowed; signed-in downloads are added to the account library.
- Favorites, unique per-user reviews with edit-on-resubmission, user profile updates, creator enrollment.
- Creator upload with drag-and-drop, XHR progress/speed/ETA, cancellation, signature/extension checks, metadata, thumbnail, pricing selector, optional game fields, gallery/video links, external links, drafts, review submission.
- Admin publish/unpublish/feature/archive/edit, content search/filter/pagination/bulk actions, category management, user role changes/suspension, account-session revocation, homepage/FAQ/community/Season settings, announcements, contact inbox, activity log, live resource counts and seven-day download chart.
- Dedicated SMP page with optional configured countdown, server address copy, community links, trailer link, rules, features, announcements.
- Accessibility: keyboard focus, reduced-motion support, native accordion semantics, mobile navigation, pointer-capability-gated circular cursor, semantic labels.

## Honest launch boundaries

Payments are intentionally unavailable. No checkout is simulated and no client action can grant paid access. The purchase table and authorization boundary are ready for a provider-specific verified webhook integration, but that integration is not configured or implemented. Premium starter entries illustrate the catalog; configure real licensed payloads and a verified payment provider before selling.

The Originals starter collection is original AI-assisted artwork, clearly credited in each resource. Voxel art is explicitly described as imagery, not a playable Minecraft world. There are no fabricated customer testimonials, download numbers, launch dates, or social links.

The current implementation offers role-specific server checks rather than a configurable granular permission editor. User deletion/export is handled through contact requests rather than a self-service destructive endpoint. Replies/threaded comments and realtime notifications are not implemented; reviews and platform announcements provide the working community interactions. Analytics cover actual content views/downloads and basic database totals, not a full business-intelligence suite.

Before a public production launch: configure your domain, durable private object storage, verified reset-email delivery, malware scanning and storage lifecycle policy, observability/backups, legal/business requirements, and a real payment integration if paid sales are enabled. Conduct an independent security review and load testing.

## Security notes

Never use public storage URLs for paid original files. Resource media endpoints allow only verified raster types and authorized preview access. Files are delivered as attachments with `nosniff`; user HTML/SVG/code is never executed inline. File signatures are checked but are not a malware scan. State changes enforce same-origin requests. Owner-level role modifications are protected on the server. Suspensions and role changes revoke sessions. Public views never serialize password hashes, session tokens, or storage keys.

## Validation

Run `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, and `npm run build`, then the platform-managed `build_and_start` healthcheck. Database changes require re-running the validation sequence.
