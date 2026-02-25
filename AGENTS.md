# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Preset Store is a single Next.js 16 (App Router) application — a marketplace for guitar processor presets. Tech stack: TypeScript, React 19, Ant Design 6, MongoDB/Mongoose, Stripe (stubbed), Vercel Blob (optional).

### Services

| Service | Required | How to start |
|---|---|---|
| MongoDB | Yes | `sudo docker start mongodb` (container already created) or `sudo docker run -d --name mongodb -p 27017:27017 mongo:7` |
| Next.js dev server | Yes | `pnpm dev` (port 3000) |
| Stripe / stripe-mock | No | Stubbed; mock payment flow works without it |
| Vercel Blob | No | Only needed for admin file uploads |
| Clerk auth | No | Stubbed via `useStubAuth = true` in `lib/auth.ts` |

### Gotchas

- **Env var mismatch**: The code in `lib/controllers/db.ts` reads `MONGODB_URL`, but `.env.example` uses `MONGODB_URI`. Always use `MONGODB_URL` in your `.env` file.
- **`pnpm lint` is broken**: Next.js 16 removed the `lint` CLI command. There is no ESLint config in the repo. Use `pnpm typecheck` (`tsc --noEmit`) for static analysis instead.
- **Docker in nested container**: The Cloud VM runs inside a container. Docker needs `fuse-overlayfs` storage driver and `iptables-legacy`. These are configured in `/etc/docker/daemon.json` and via `update-alternatives`.
- **pnpm build scripts warning**: `esbuild` and `sharp` show "Ignored build scripts" warnings. This does not break the dev server or build — the platform-specific binaries resolve correctly via pnpm's virtual store.

### Standard commands

See `package.json` scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm seed`.
