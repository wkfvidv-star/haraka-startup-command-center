const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'src/store/useAppStore.ts');
let storeCode = fs.readFileSync(storePath, 'utf8');

// Add session properties to AppState
storeCode = storeCode.replace(
  'interface AppState {',
  'interface AppState {\n  session: any | null;\n  user: any | null;\n  activeCompanyId: string | null;\n  reset: () => void;'
);

// Add supabase import
if (!storeCode.includes('import { supabase }')) {
  storeCode = storeCode.replace(
    'import { taskService } from \'../services/taskService\';',
    'import { supabase } from \'../lib/supabase\';\nimport { taskService } from \'../services/taskService\';'
  );
}

// Add state defaults and reset method
storeCode = storeCode.replace(
  'export const useAppStore = create<AppState>((set, get) => ({\n  tasks: [],',
  `export const useAppStore = create<AppState>((set, get) => ({
  session: null, user: null, activeCompanyId: null,
  
  reset: () => {
    set({
      session: null, user: null, activeCompanyId: null,
      tasks: [], projects: [], config: null, ceoNextMove: null,
      products: [], launchCategories: [], launchBlockers: [], incubationPhase: null,
      deliverables: [], meetings: [], expenses: [], risks: [], decisions: [], kpis: [],
      segments: [], leads: [], opportunities: [], offers: [], pilots: [],
      customers: [], campaigns: [], contents: [], partnerships: [], revenues: [],
      teamMembers: [], goals: [], initiatives: [], growthTargets: [],
      financialAllocations: [], fundingMilestones: [], financialScenarios: [], financialSnapshots: [], financialControl: null,
      governanceProfile: null, obligations: [], govDocuments: [], contracts: [], ipAssets: [], govMeetings: [],
      governanceSignals: [], governanceCalendar: [],
      productReadinessPct: 0, launchReadinessPct: 0, financeSummary: null, marketKPIs: null,
      companyHealth: null, teamPerformances: [],
    });
  },

  tasks: [],`
);

// Replace init method
const newInit = `
  init: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase client not found');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        get().reset();
        set({ isLoading: false });
        return;
      }
      
      const { data: members, error: memError } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('status', 'Active');
        
      let activeCompanyId = null;
      if (!memError && members && members.length > 0) {
        activeCompanyId = members[0].company_id;
      }

      const [
        tasks, projects, config, products, launchCategories, launchBlockers, 
        incPhase, deliverables, meetings, expenses, risks, decisions, kpis,
        segments, leads, opportunities, offers, pilots, customers, campaigns, contents, partnerships, revenues,
        teamMembers, goals, initiatives, growthTargets,
        // Phase 5
        financialAllocations, fundingMilestones, financialScenarios, financialSnapshots,
        // Phase 6
        governanceProfile, obligations, govDocuments, contracts, ipAssets, govMeetings
      ] = await Promise.all([
        taskService.getAll(), projectService.getAll(), companyService.getConfig(),
        productService.getAll(), launchService.getCategories(), launchService.getBlockers(),
        incubationService.getPhase(), incubationService.getDeliverables(), incubationService.getMeetings(),
        financeService.getExpenses(), riskService.getRisks(), decisionService.getDecisions(), kpiService.getKPIs(),
        marketSegmentService.getAll(), leadService.getAll(), opportunityService.getAll(), offerService.getAll(),
        pilotService.getAll(), customerService.getAll(), campaignService.getAll(), contentService.getAll(),
        partnershipService.getAll(), revenueService.getAll(),
        teamService.getAll(), goalService.getAll(), initiativeService.getAll(), growthService.getAll(),
        // Phase 5
        allocationService.getAll(), fundingMilestoneService.getAll(),
        financialScenarioService.getAll(), financialSnapshotService.getAll(),
        // Phase 6
        governanceService.getProfile(), obligationService.getAll(), documentService.getAll(),
        contractService.getAll(), ipService.getAll(), govMeetingService.getAll()
      ]);

      const state = {
        session, user: session.user, activeCompanyId,
        tasks, projects, config, products, launchCategories, launchBlockers, 
        incubationPhase: incPhase, deliverables, meetings, expenses, risks, decisions, kpis,
        segments, leads, opportunities, offers, pilots, customers, campaigns, contents, partnerships, revenues,
        teamMembers, goals, initiatives, growthTargets,
        financialAllocations, fundingMilestones, financialScenarios, financialSnapshots,
        governanceProfile, obligations, govDocuments, contracts, ipAssets, govMeetings
      };

      const computed = recomputeAll(state);
      set({ ...state, ...computed, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },
`;

storeCode = storeCode.replace(/init: async \(\) => \{[\s\S]*?createTask: async/m, newInit.trim() + '\n\n  createTask: async');

fs.writeFileSync(storePath, storeCode);
console.log('Store updated');
