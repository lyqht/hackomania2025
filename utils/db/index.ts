import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env" });

const url = process.env.POSTGRES_URL;
if (!url) {
  throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(url);
export const db = drizzle(client, { schema });
