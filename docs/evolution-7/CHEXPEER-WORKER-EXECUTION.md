# Cheexpeer Worker — bootstrap executor

This is the isolated execution process for Cheexpeer. It is deliberately separate from the MajestiOS website build.

## Current scope

The bootstrap worker can execute exactly one harmless mission type:

- `readiness_probe`, with autonomy level `0`.

It can dispatch due work, read PGMQ wake-up messages, claim the highest-priority eligible mission, complete the harmless probe, and archive wake-ups. It refuses unknown mission types; it never guesses a handler.

**No CRM write, email, scraping, Drive operation, external API call, or other business action is enabled.** The Supabase tool registry currently has zero enabled tools.

## Architecture

- Supabase Postgres is the durable source of truth.
- Supabase Queues (PGMQ) carries wake-up messages only.
- The SQL claim function arbitrates priority, deadlines, approval and leases.
- The Edge Function `cheexpeer-worker-bridge` is the narrow server-side bridge.
- This Node worker polls the bridge and executes reviewed handlers.

## Required runtime secrets

Set these in the worker host's secret manager. Never commit them:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only; never a browser variable
- `CHEXPEER_WORKER_SECRET` — independent random secret shared with the Edge Function

Non-secret settings:

- `CHEXPEER_WORKER_ID`
- `CHEXPEER_POLL_MS` (default 5000)
- `CHEXPEER_LEASE_SECONDS` (default 120)
- `PORT` (default 8080)

Set `CHEXPEER_WORKER_SECRET` in Supabase Edge Function secrets before starting the worker.

## Run locally

1. Set the environment variables in your local secret manager or untracked `.env`.
2. Start with Node.js 22 or later:

```sh
npm start
```

3. Check `GET /health`.

Do not expose the worker port publicly except through a host health check. The worker itself makes outbound HTTPS requests only.

## Container

```sh
docker build -t cheexpeer-worker .
docker run --env-file .env -p 8080:8080 cheexpeer-worker
```

## Delivery semantics

- PGMQ wake-ups are hints, not task payloads.
- Mission claims use a bounded database lease and row locking.
- The database is authoritative after retries or redelivery.
- A wake-up is archived after the claim attempt. If archive fails, it is redelivered and safely ignored if no mission is claimable.
- Any future handler with external effects must implement its own idempotency key at the destination and renew its lease during long work.
- Unknown handlers fail closed and are journaled through the mission lifecycle.

## Deployment decision

The current Vercel team is on the Hobby plan and the MajestiOS repository is a static-site build with several linked Vercel projects. This worker is therefore packaged as an independent container rather than adding a persistent daemon to the public MajestiOS `vercel.json`.

No worker host has been provisioned, no secrets have been set, and no deployment has been made. Choose a host and budget before starting it continuously.

## Important distinction

This process is the **execution worker**, not yet the conversational/reasoning agent. The model-driven Cheexpeer brain, its approved tool catalogue, human command interface, cost limits and Google Workspace connector are separate next layers.
