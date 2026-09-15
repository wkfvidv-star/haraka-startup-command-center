const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env
const envContent = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY; // Anon key

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars. Ensure .env is loaded.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("=== RUNNING BACKEND TESTS ===");

  const email1 = `test1_${Date.now()}@example.com`;
  const email2 = `test2_${Date.now()}@example.com`;
  const password = "password123";

  // 1. Sign up user 1
  const { data: auth1, error: err1 } = await supabase.auth.signUp({ email: email1, password });
  if (err1) throw new Error("SignUp 1 failed: " + err1.message);
  console.log("✅ User 1 signed up:", auth1.user.id);

  // 2. Run Onboarding RPC for user 1
  const { data: onb1, error: onbErr1 } = await supabase.rpc('create_company_onboarding', {
    company_name: 'Company A',
    full_name: 'Founder One'
  });
  if (onbErr1) throw new Error("Onboarding 1 failed: " + onbErr1.message);
  console.log("✅ Onboarding successful. Company A created:", onb1.company_id);

  // 3. Test Real CRUD (Tasks)
  const taskTitle = 'Setup Command Center';
  const { data: task, error: tErr1 } = await supabase.from('tasks').insert([
    { title: taskTitle, status: 'To Do', priority: 'High', company_id: onb1.company_id }
  ]).select().single();
  if (tErr1) throw new Error("Task Create failed: " + tErr1.message);
  console.log("✅ Task Created:", task.id);

  // 4. Multi-tenant isolation test
  // Sign up user 2
  const supabase2 = createClient(supabaseUrl, supabaseKey);
  const { data: auth2, error: err2 } = await supabase2.auth.signUp({ email: email2, password });
  if (err2) throw new Error("SignUp 2 failed: " + err2.message);
  console.log("✅ User 2 signed up:", auth2.user.id);

  // User 2 runs Onboarding
  const { data: onb2, error: onbErr2 } = await supabase2.rpc('create_company_onboarding', {
    company_name: 'Company B',
    full_name: 'Founder Two'
  });
  if (onbErr2) throw new Error("Onboarding 2 failed: " + onbErr2.message);
  console.log("✅ Onboarding successful. Company B created:", onb2.company_id);

  // User 2 tries to read User 1's tasks
  const { data: readTasks2, error: tErr2 } = await supabase2.from('tasks').select('*');
  if (tErr2) throw new Error("Task Read failed: " + tErr2.message);
  
  const hasCompanyATask = readTasks2.some(t => t.id === task.id);
  if (hasCompanyATask) {
    throw new Error("❌ Security Failure: User 2 can read User 1's tasks!");
  } else {
    console.log("✅ RLS Enforced: User 2 cannot read User 1's tasks.");
  }

  console.log("=== ALL TESTS PASSED ===");
}

runTests().catch(e => console.error(e));
