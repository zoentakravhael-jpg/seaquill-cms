import pg from "pg";

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();

  // Fix social section
  const social = await c.query(`SELECT value FROM site_settings WHERE key='hubungi_social_section'`);
  if (social.rows[0]) {
    const val = JSON.parse(social.rows[0].value);
    let changed = false;
    for (const item of val.items || []) {
      if (item.icon && item.icon.endsWith('.png')) {
        item.icon = item.icon.replace('.png', '.svg');
        changed = true;
      }
    }
    if (changed) {
      await c.query(`UPDATE site_settings SET value=$1 WHERE key='hubungi_social_section'`, [JSON.stringify(val)]);
      console.log("Updated social section icons");
    }
  }

  // Fix marketplace section
  const market = await c.query(`SELECT value FROM site_settings WHERE key='hubungi_marketplace_section'`);
  if (market.rows[0]) {
    const val = JSON.parse(market.rows[0].value);
    let changed = false;
    for (const item of val.items || []) {
      if (item.icon && item.icon.includes('wa.')) {
        // Fix Lazada and TikTok Shop icons
        if (item.platform === 'Lazada') item.icon = '/assets/img/icon/lazada.svg';
        else if (item.platform === 'TikTok Shop') item.icon = '/assets/img/icon/tiktok.svg';
        changed = true;
      } else if (item.icon && item.icon.endsWith('.png')) {
        item.icon = item.icon.replace('.png', '.svg');
        changed = true;
      }
    }
    if (changed) {
      await c.query(`UPDATE site_settings SET value=$1 WHERE key='hubungi_marketplace_section'`, [JSON.stringify(val)]);
      console.log("Updated marketplace section icons");
    }
  }

  console.log("Done!");
  await c.end();
}
main().catch(console.error);
