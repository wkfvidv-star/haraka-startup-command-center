// apply_migration.cjs
// Applies 014_tasks_ios_v2.sql directly via Supabase REST API
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read credentials from .env.local
const envPath = path.join(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Could not find Supabase credentials in .env.local');
  process.exit(1);
}

const SUPABASE_URL = urlMatch[1].trim();
const SUPABASE_KEY = keyMatch[1].trim();
// Extract project ref from URL: https://qaknvrxmdbgkivasjnnn.supabase.co
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

// Read the migration SQL
const sql = fs.readFileSync(
  path.join(__dirname, 'supabase', 'migrations', '014_tasks_ios_v2.sql'),
  'utf8'
);

console.log(`\n🚀 Applying migration to Supabase project: ${projectRef}`);
console.log(`📋 SQL:\n${sql}\n`);

// Use Supabase REST endpoint to execute SQL
const payload = JSON.stringify({ query: sql });
const options = {
  hostname: `${projectRef}.supabase.co`,
  path: '/rest/v1/rpc',
  method: 'POST',
};

// Try using pg-meta SQL endpoint via Supabase Management API
// Since we don't have a service role key, we'll use the publishable key with ALTER TABLE
// This requires service role. Let's try the anon key via a workaround.

// Actually, ALTER TABLE requires service role. Let's inform the user.
console.log('⚠️  ALTER TABLE requires Supabase Service Role Key (not publishable key).');
console.log('\n📋 Please run this SQL manually in your Supabase Dashboard SQL Editor:');
console.log('   👉 https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('\n' + '─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
console.log('\n✅ Or use: supabase db push (after logging in to Supabase CLI)');
