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
- Supabase for database, authentication and edge function
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

#### Edge Functions

The project includes a Supabase Edge Function to fetch Eventbrite attendees:

- **Function Name**: `fetch-eventbrite-attendees`
- **Purpose**: Retrieves attendees from a specified Eventbrite event, handling pagination automatically to get all attendees
- **Required Environment Variables**:
  - `EVENTBRITE_EVENT_ID`: The ID of the Eventbrite event
  - `EVENTBRITE_PRIVATE_TOKEN`: Eventbrite private token obtained through creating an Eventbrite api key
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- **Query Parameters**:
  - `email` (optional): Find an attendee by their email address
  - `latest` (optional): Set to "1" to bypass cache and fetch latest data from Eventbrite
- **Caching**:
  - Results are cached in Supabase database for 24 hours to minimize Eventbrite API calls
  - Cache is bypassed when `latest=1` is used
  - Cache is automatically refreshed after expiration
  - Cache persists across function instances and cold starts

To test the function:

```bash
# Get all attendees (uses cache if available)
curl -i --location --request GET 'https://<project-ref>.supabase.co/functions/v1/fetch-eventbrite-attendees' \
  --header 'Authorization: Bearer <supabase-anon-key>'

# Get latest attendees (bypasses cache)
curl -i --location --request GET 'https://<project-ref>.supabase.co/functions/v1/fetch-eventbrite-attendees?latest=1' \
  --header 'Authorization: Bearer <supabase-anon-key>'

# Get specific attendee by email (uses cache if available)
curl -i --location --request GET 'https://<project-ref>.supabase.co/functions/v1/fetch-eventbrite-attendees?email=user@example.com' \
  --header 'Authorization: Bearer <supabase-anon-key>'
```

Or using the Supabase client in your Next.js application:

```typescript
// Get all attendees (uses cache if available)
const { data: allAttendees, error } = await supabase.functions.invoke("fetch-eventbrite-attendees");

// Get latest attendees (bypasses cache)
const { data: latestAttendees, error } = await supabase.functions.invoke(
  "fetch-eventbrite-attendees",
  {
    queryParams: { latest: "1" },
  },
);

// Get specific attendee by email (uses cache if available)
const { data: attendee, error } = await supabase.functions.invoke("fetch-eventbrite-attendees", {
  queryParams: { email: "user@example.com" },
});
```

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
   npx drizzle-kit generate --name=some_change
   ```

2. This will create a new migration file in the `./drizzle` directory (as specified in `drizzle.config.ts`).

3. Review the generated SQL in the migration file to ensure it matches your intended changes.

#### Applying Migrations

To apply the migrations to your database:

1. Run the following command:

   ```bash
   npx drizzle-kit push
   ```

2. This will apply any pending migrations to your database.

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
