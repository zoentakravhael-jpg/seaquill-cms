import pg from "pg";

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  
  // List tables
  const tables = await c.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
  console.log("Tables:", tables.rows.map((x: any) => x.tablename).join(", "));
  
  // Try to find the about section
  try {
    const r = await c.query(`SELECT value FROM "site_settings" WHERE key='tentang_about_section'`);
    console.log("About:", r.rows[0]?.value);
  } catch {
    try {
      const r = await c.query(`SELECT value FROM "SiteSettings" WHERE key='tentang_about_section'`);
      console.log("About:", r.rows[0]?.value);
    } catch (e: any) {
      console.log("Error:", e.message);
    }
  }
  await c.end();
}
main();
