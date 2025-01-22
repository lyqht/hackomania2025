# HackOMania 2025

## Introduction

This repo is created using the [Next.js and Supabase Starter Kit](https://github.com/vercel/nextjs-with-supabase).

<details>

<summary> What comes with the starter kit </summary>

<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
</a>

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

</details>

## Tech stack

- Next.js for frontend
- Tailwind CSS for styling
- shadcn/ui for components
- Supabase for database and authentication
- Drizzle ORM for migrations and queries

## Deployment

This project has been deployed at [https://hackomania2025.vercel.app/](https://hackomania2025.vercel.app/) using [Supabase Vercel Integration and Vercel deploy](#deploy-your-own) where environment variables are automatically assigned to the project.

## Local Development

1. Populate `.env.local` with the environment variables based on `.env.example`.
2. Install dependencies using your favorite package manager. [@lyqht](https://github.com/lyqht) recommends using [pnpm](https://pnpm.io/).
3. You can now start the Next.js local development server:

   ```bash
   pnpm dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

### Supabase

- Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to run Supabase locally.
- Auth with GitHub is added by following this guide for [Login with GitHub | Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-github).

Demo of signing up with GitHub: https://share.cleanshot.com/lFT0Q4LR

### Drizzle

Below are the steps to create schemas and generate migrations.

> For more detailed information, refer to the [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview).

#### Creating Schemas

1. Define your schema in the `utils/db/schema` directory. For example:

   ```typescript:utils/db/schema/users.ts
   import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     name: text('name').notNull(),
     email: text('email').notNull().unique(),
     createdAt: timestamp('created_at').defaultNow().notNull()
   });
   ```

2. If you have multiple schema files, you can create an index file to export them all:

   ```typescript:utils/db/schema/index.ts
   export * from './users';
   export * from './teams';
   // ... other schema exports
   ```

#### Generating Migrations

After defining or updating your schema, generate migrations using Drizzle Kit:

1. Run the following command:

   ```bash
   npx drizzle-kit generate:pg --name=some_change
   ```

2. This will create a new migration file in the `./drizzle` directory (as specified in `drizzle.config.ts`).

3. Review the generated SQL in the migration file to ensure it matches your intended changes.

#### Applying Migrations

To apply the migrations to your database:

1. Run the following command:

   ```bash
   npx drizzle-kit push:pg
   ```

2. This will apply any pending migrations to your database.

**If you encounter an error like below:**

```
<path_to_this_project>\node_modules\drizzle-kit\bin.cjs:37579
              checkValue = checkValue.replace(/^CHECK\s*\(\(/, "").replace(/\)\)\s*$/, "");

TypeError: Cannot read properties of undefined (reading 'replace')
    at <path_to_this_project>\node_modules\drizzle-kit\bin.cjs:37579:39
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
```

There could be an issue with the database's pooling mode. Check the `POSTGRES_URL` and ensure that Session Mode is used instead of Transaction Mode.  
To switch between modes, use the following ports:

- 5432: Session Mode
- 6543: Transaction Mode

#### Best Practices

- Always review generated migrations before applying them to your database.
- Commit both your schema files and the generated migration files to version control.
- In a team environment, coordinate database changes to avoid conflicts.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
