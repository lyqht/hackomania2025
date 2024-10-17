import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from "postgres";

config({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) {
    throw new Error('DATABASE_URL is not defined');
}

const client = postgres(url);
export const db = drizzle(client);