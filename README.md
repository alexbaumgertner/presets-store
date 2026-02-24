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
- Clerk authentication
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
