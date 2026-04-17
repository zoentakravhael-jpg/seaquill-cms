/**
 * One-time migration: upsert footer_visibility setting into the database.
 * Run: node scripts/add-footer-visibility.mjs
 * Set DATABASE_URL env before running against production.
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.production if DATABASE_URL not already set
if (!process.env.DATABASE_URL) {
  try {
    const envPath = resolve(__dirname, "../.env.production");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key?.trim() === "DATABASE_URL") {
        process.env.DATABASE_URL = rest.join("=").trim().replace(/^["']|["']$/g, "");
        console.log("[INFO] Loaded DATABASE_URL from .env.production");
        break;
      }
    }
  } catch {
    // .env.production not found, rely on env var
  }
}

if (!process.env.DATABASE_URL) {
  console.error("[ERROR] DATABASE_URL is not set. Set it as an environment variable or provide .env.production");
  process.exit(1);
}

const require = createRequire(import.meta.url);

// Dynamically import pg
let pg;
try {
  pg = require("pg");
} catch {
  console.error("[ERROR] pg package not found. Run: pnpm add pg");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const FOOTER_VISIBILITY_VALUE = JSON.stringify({
  logo: true,
  contact: true,
  navigation: true,
  headline: true,
  marketplace: true,
  copyright: true,
  social_media: true,
});

async function run() {
  const client = await pool.connect();
  try {
    const existing = await client.query(
      "SELECT key, value FROM site_settings WHERE key = $1",
      ["footer_visibility"]
    );

    if (existing.rows.length > 0) {
      console.log(`[INFO] footer_visibility already exists: ${existing.rows[0].value}`);
      console.log("[INFO] Skipping — use UPDATE manually if you want to override.");
    } else {
      await client.query(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2)",
        ["footer_visibility", FOOTER_VISIBILITY_VALUE]
      );
      console.log("[OK] Inserted footer_visibility:", FOOTER_VISIBILITY_VALUE);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("[ERROR]", err);
  process.exit(1);
});
