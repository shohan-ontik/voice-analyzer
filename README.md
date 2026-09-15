This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Running with Docker

This app calls a separate backend API (`voice-analyzer-api`, see `app/lib/apiClient.ts`) that is not part of this repo, so it must already be running and reachable before you start the container.

1. Copy the env template and fill it in:
   ```bash
   cp .env.docker.example .env
   ```
   - `GEMINI_API_KEY`: your key from https://aistudio.google.com/apikey
   - `API_BASE_URL`: URL of the `voice-analyzer-api` backend
     - Backend running on the same machine, outside Docker: leave the default (`http://host.docker.internal:4000/api/v1`)
     - Backend running elsewhere (another server, cloud): put its URL here instead

2. Build and start:
   ```bash
   docker compose up --build
   ```

3. Open http://localhost:3000

To move this to another PC: copy the whole project folder onto the new machine (note `.env.docker.example`, like `.env.local.example`, is gitignored, so a `git clone` alone won't bring it — copy it separately or recreate it if you clone instead), make sure Docker is installed, then repeat steps 1-3 there. No local Node.js install is required on the target machine — everything needed runs inside the container.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
