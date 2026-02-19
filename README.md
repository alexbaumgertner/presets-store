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
```bash
npm install
npm run dev
```
