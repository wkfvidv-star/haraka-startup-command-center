const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');
const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts'));

console.log('--- SERVICES AUDIT ---');
for (const file of files) {
  const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
  
  let hasSupabase = content.includes('supabase.from') || content.includes('supabaseAdapter');
  let hasMock = content.includes('delay(500)') || content.match(/let\s+[a-zA-Z]+\s*=\s*\[/);
  
  let status = 'Unknown';
  if (hasSupabase && !hasMock) status = '🟢 SUPABASE ONLY';
  else if (hasSupabase && hasMock) status = '🟡 MIXED (Has Supabase + Mocks)';
  else if (!hasSupabase && hasMock) status = '🔴 MOCK ONLY (Local Arrays)';
  else status = '⚪ NO CRUD FOUND';
  
  console.log(`${status.padEnd(35)} - ${file}`);
}
