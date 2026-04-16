import pg from "pg";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.production", "utf-8");
const dbUrl = envContent.match(/^DATABASE_URL="(.+)"$/m)?.[1];

const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

// List all tables
const tables = await pool.query(
  `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
);
console.log("=== TABLES IN PRODUCTION DB ===");
tables.rows.forEach(r => console.log(" -", r.table_name));

// Count rows in key tables
const counts = await pool.query(`
  SELECT 
    (SELECT COUNT(*) FROM blog_posts) as blog_posts,
    (SELECT COUNT(*) FROM site_settings) as site_settings,
    (SELECT COUNT(*) FROM hero_slides) as hero_slides,
    (SELECT COUNT(*) FROM brand_partners) as brand_partners,
    (SELECT COUNT(*) FROM gallery_items) as gallery_items,
    (SELECT COUNT(*) FROM promo_items) as promo_items,
    (SELECT COUNT(*) FROM event_items) as event_items,
    (SELECT COUNT(*) FROM admin_users) as admin_users
`);
console.log("\n=== ROW COUNTS ===");
console.log(JSON.stringify(counts.rows[0], null, 2));
await pool.end();
