import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// update this path based on the env file you are using
config({ path: ".env" });

// Ensure database URL uses Session Mode (port 5432) instead of Transaction Mode (port 6543)
function getSessionModeUrl(url: string) {
  try {
    const dbUrl = new URL(url);
    if (dbUrl.port === "6543") {
      dbUrl.port = "5432";
    }
    return dbUrl.toString();
  } catch {
    return url;
  }
}

const dbUrl = process.env.POSTGRES_URL || "";

export default defineConfig({
  schema: "./utils/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: getSessionModeUrl(dbUrl),
  },
});
