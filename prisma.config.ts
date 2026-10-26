import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Local secrets live in .env.local (gitignored). Hosting platforms inject real env vars instead.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // The CLI (db push, studio) needs a direct connection; the app itself uses the pooled DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
