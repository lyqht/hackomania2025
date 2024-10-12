# HackOMania 2025

## Introduction

This repo is created using the [Next.js and Supabase Starter Kit](https://github.com/vercel/nextjs-with-supabase).

<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
</a>

Auth with GitHub is added by following this guide for [Login with GitHub | Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-github).

Demo of signing up with GitHub: https://share.cleanshot.com/lFT0Q4LR

## Deployment

This project has been deployed using [Supabase Vercel Integration and Vercel deploy](#deploy-your-own) where environment variables are automatically assigned to the project.

The project is deployed at [https://hackomania2025.vercel.app/](https://hackomania2025.vercel.app/).

## What comes with the starter kit

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)

## Local Development

1. Populate `.env.local` with the environment variables based on `.env.example`.
2. Install dependencies using your favorite package manager. [@lyqht](https://github.com/lyqht) recommends using [pnpm](https://pnpm.io/).
3. You can now start the Next.js local development server:

   ```bash
   pnpm dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

4. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
