# Preset Store

Full-stack Next.js marketplace for downloadable guitar processor presets.

## Features
- Browse presets with audio previews (`/presets`)
- Preset detail and Stripe checkout (`/presets/[id]`)
- Secure purchased library downloads (`/library`)
- Admin preset management and uploads (`/admin/presets`, `/admin/presets/new`)
- Stripe webhook order fulfillment (`/api/webhooks/stripe`)
- JWT-based short-lived secure download links (`/api/download/*`)

## Tech
- Next.js App Router + TypeScript
- MongoDB + Mongoose
- NextAuth (Auth.js) v5 with JWT and social login (Google, Facebook, GitHub)
- Stripe checkout + webhooks
- Ant Design + CSS modules
- Vercel Blob storage for uploaded files

## Run

### Using Local Stubs (Development)

1. Start the local stub service:
```bash
cd stubs
npm install
npm run dev
```

2. Set up environment variables (see `.env.example`):
```bash
cp .env.example .env
# Set NEXT_PUBLIC_USE_STUBS=true to enable stub mode
```

3. Start MongoDB locally or use a cloud instance

4. Run the main application:
```bash
npm install
npm run dev
```

### Using Real Services (Production)

Set up your `.env` file with real service credentials and ensure `NEXT_PUBLIC_USE_STUBS` is not set or false.

## Auth

Login uses NextAuth (Auth.js) v5 with JWT sessions. Social providers: Google, Facebook, GitHub.

- Set `AUTH_SECRET` (min 32 characters). Set `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (and optionally Facebook, GitHub) after creating OAuth apps. Redirect URI: `{APP_URL}/api/auth/callback/{provider}`.
- First admin: set `ADMIN_EMAIL` to your email; that user gets the admin role on first sign-in. Otherwise assign roles in the database or via the Admin Users page (admin only).
- Session is stored in a JWT; role is in the token. After an admin changes a user’s role, that user must sign out and sign in again for the new role to apply.

## Environment variables

- `BLOB_READ_WRITE_TOKEN` — (required for uploading to Vercel Blob) set this to a Vercel Blob read/write token when running in production or when you want uploads to go to Vercel Blob storage. If this value is not present, the app will fall back to local `data/` storage for development.
- See `.env.example` for Auth (NextAuth) and OAuth provider variables.

Add the variable to your `.env` (or use `.env.local`) or provide it in your Vercel project/environment configuration.
