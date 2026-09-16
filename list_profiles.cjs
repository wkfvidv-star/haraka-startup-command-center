// list_profiles.cjs
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const SUPABASE_URL = urlMatch[1].trim();
const SUPABASE_KEY = keyMatch[1].trim();
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

const options = {
  hostname: `${projectRef}.supabase.co`,
  path: '/rest/v1/profiles?select=*',
  method: 'GET',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
});
req.end();
