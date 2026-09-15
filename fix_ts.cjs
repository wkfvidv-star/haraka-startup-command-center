const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');

fs.readdirSync(servicesDir).forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix supabase null check
  content = content.replace(/await supabase/g, 'await supabase!');

  // Re-inject delay for any remaining functions that use it
  if (content.includes('delay(') && !content.includes('const delay =')) {
    content = `const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));\n` + content;
  }

  // Restore empty store to fix TS errors for any un-migrated methods
  if (content.includes('// private store mocked')) {
    content = content.replace(/\/\/ private store mocked/g, 'private store: any[] = [];');
  }

  // Ensure getCompanyId is in the class if supabase is used inside the class
  if (content.includes('getCompanyId()') && !content.includes('private async getCompanyId()')) {
    const getCompanyIdCode = `
  private async getCompanyId() {
    if (!supabase) throw new Error('Not authenticated');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    
    const { data: members, error } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);
      
    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  }`;
    
    content = content.replace(/(class \w+ \{)/, `$1\n${getCompanyIdCode}`);
  }

  fs.writeFileSync(filePath, content);
});
console.log('Fixed TS errors in services');
