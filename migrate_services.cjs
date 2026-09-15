const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');

const tableMap = {
  'taskService.ts': 'tasks',
  'projectService.ts': 'projects',
  'initiativeService.ts': 'initiatives',
  'goalService.ts': 'goals',
  'campaignService.ts': 'campaigns',
  'contentService.ts': 'content',
  'contractService.ts': 'contracts',
  'customerService.ts': 'customers',
  'decisionService.ts': 'decisions',
  'documentService.ts': 'documents',
  'financeService.ts': 'expenses',
  'financialAllocationService.ts': 'financial_allocations',
  'financialScenarioService.ts': 'financial_scenarios',
  'financialSnapshotService.ts': 'financial_snapshots',
  'fundingMilestoneService.ts': 'funding_milestones',
  'governanceService.ts': 'governance_profiles',
  'incubationService.ts': 'incubation_phases',
  'ipService.ts': 'ip_assets',
  'kpiService.ts': 'kpis',
  'launchService.ts': 'launch_categories',
  'leadService.ts': 'leads',
  'marketSegmentService.ts': 'market_segments',
  'meetingService.ts': 'meetings',
  'obligationService.ts': 'obligations',
  'offerService.ts': 'offers',
  'opportunityService.ts': 'opportunities',
  'partnershipService.ts': 'partnerships',
  'pilotService.ts': 'pilots',
  'productService.ts': 'product_readiness_items',
  'riskService.ts': 'risks'
};

const getCompanyIdCode = `
  private async getCompanyId() {
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
  }
`;

fs.readdirSync(servicesDir).forEach(file => {
  if (!tableMap[file]) return;
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const tableName = tableMap[file];
  
  // Replace imports
  if (!content.includes("import { supabase }")) {
    content = `import { supabase } from '../lib/supabase';\n` + content;
  }
  
  // Remove delay import
  content = content.replace(/import \{ delay \} from '.*?delay.*?';/g, '');
  content = content.replace(/const delay = .*?;/g, '');
  
  // Basic Regex replacements for CRUD methods (assuming they all exist and return similar types)
  
  // getAll
  content = content.replace(
    /async getAll\(\)([\s\S]*?)\{\s*await delay\(.*?\);\s*return \[\.\.\.this\.store\];\s*\}/g,
    `async getAll()$1 {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase.from('${tableName}').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }`
  );
  
  content = content.replace(
    /async getAll\(\)([\s\S]*?)\{\s*await delay\(.*?\);\s*return structuredClone\(this\.store\);\s*\}/g,
    `async getAll()$1 {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase.from('${tableName}').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }`
  );

  // create
  content = content.replace(
    /async create\(data(.*?)\)([\s\S]*?)\{\s*await delay\(.*?\);[\s\S]*?return item;\s*\}/g,
    `async create(data$1)$2 {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase.from('${tableName}').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }`
  );

  content = content.replace(
    /async create\(data(.*?)\)([\s\S]*?)\{\s*await delay\(.*?\);[\s\S]*?return structuredClone.*?;\s*\}/g,
    `async create(data$1)$2 {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase.from('${tableName}').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }`
  );
  
  // update
  content = content.replace(
    /async update\(id(.*?)\)([\s\S]*?)\{\s*await delay\(.*?\);[\s\S]*?return this\.store\[index\];\s*\}/g,
    `async update(id$1)$2 {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase.from('${tableName}').update(patch).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return data;
  }`
  );

  content = content.replace(
    /async update\(id(.*?)\)([\s\S]*?)\{\s*await delay\(.*?\);[\s\S]*?return structuredClone.*?;\s*\}/g,
    `async update(id$1)$2 {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase.from('${tableName}').update(patch).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return data;
  }`
  );
  
  // delete
  content = content.replace(
    /async delete\(id(.*?)\)([\s\S]*?)\{\s*await delay\(.*?\);[\s\S]*?this\.store = this\.store\.filter.*?\);\s*\}/g,
    `async delete(id$1)$2 {
    const company_id = await this.getCompanyId();
    const { error } = await supabase.from('${tableName}').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }`
  );

  // Inject getCompanyId
  if (!content.includes('getCompanyId')) {
    content = content.replace(/class .*? \{/, (match) => match + '\n' + getCompanyIdCode);
  }
  
  // Comment out mock store
  content = content.replace(/private store:.*?=.*?\[.*?\];/g, '// private store mocked');
  content = content.replace(/private store:.*?=.*?structuredClone.*?;/g, '// private store mocked');
  
  fs.writeFileSync(filePath, content);
  console.log('Migrated', file);
});
