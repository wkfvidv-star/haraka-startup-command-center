import { create } from 'zustand';
import { Task, NewTask } from '../types/task';
import { Project, NewProject } from '../types/project';
import { CompanyConfig, CeoNextMove } from '../types/company';
import { ProductReadinessItem, NewProductReadinessItem } from '../types/product';
import { LaunchBlocker, LaunchReadinessCategory, NewLaunchBlocker } from '../types/launch';
import { IncubationPhase, Deliverable, Meeting } from '../types/incubation';
import { Expense, NewExpense, FinanceSummary } from '../types/finance';
import { Risk, NewRisk } from '../types/risk';
import { Decision, NewDecision } from '../types/decision';
import { KPI, NewKPI } from '../types/kpi';
import { 
  MarketSegment, Lead, Opportunity, Offer, Pilot, 
  Customer, Campaign, Content, Partnership, Revenue, MarketKPIs 
} from '../types/market';

import { TeamMember, SystemRole } from '../types/team';
import { Goal } from '../types/goal';
import { Initiative } from '../types/initiative';
import { GrowthTarget } from '../types/growth';
import { CompanyHealthScore, TeamPerformance } from '../types/companyHealth';

// Phase 5 imports
import {
  FinancialAllocation, NewFinancialAllocation,
  FundingMilestone, NewFundingMilestone,
  FinancialScenario,
  FinancialSnapshot,
  FinancialControlState,
} from '../types/financialControl';

// Phase 6 imports
import {
  GovernanceProfile,
  Obligation, NewObligation,
  DocumentRecord, NewDocumentRecord,
  ContractRecord, NewContractRecord,
  IPAsset, NewIPAsset,
  GovernanceSignal, CalendarEntry,
} from '../types/governance';
import { Meeting as GovMeeting, NewMeeting } from '../types/governance';

import { supabase } from '../lib/supabase';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { companyService } from '../services/companyService';
import { productService } from '../services/productService';
import { launchService } from '../services/launchService';
import { incubationService } from '../services/incubationService';
import { financeService } from '../services/financeService';
import { riskService } from '../services/riskService';
import { decisionService } from '../services/decisionService';
import { kpiService } from '../services/kpiService';

import { marketSegmentService } from '../services/marketSegmentService';
import { leadService } from '../services/leadService';
import { opportunityService } from '../services/opportunityService';
import { offerService } from '../services/offerService';
import { pilotService } from '../services/pilotService';
import { customerService } from '../services/customerService';
import { campaignService } from '../services/campaignService';
import { contentService } from '../services/contentService';
import { partnershipService } from '../services/partnershipService';
import { revenueService } from '../services/revenueService';

import { teamService } from '../services/teamService';
import { goalService } from '../services/goalService';
import { initiativeService } from '../services/initiativeService';
import { growthService } from '../services/growthService';
import { calculateCompanyHealth } from '../services/companyHealthService';
import { getMemberPerformance } from '../services/performanceService';

// Phase 5 services
import { allocationService } from '../services/allocationService';
import { fundingMilestoneService } from '../services/fundingMilestoneService';
import { financialScenarioService } from '../services/financialScenarioService';
import { financialSnapshotService } from '../services/financialSnapshotService';
import { computeFinancialControl } from '../services/financialControlService';

// Phase 6 services
import { governanceService, computeGovernanceSignals, buildGovernanceCalendar } from '../services/governanceService';
import { obligationService } from '../services/obligationService';
import { documentService } from '../services/documentService';
import { contractService } from '../services/contractService';
import { ipService } from '../services/ipService';
import { meetingService as govMeetingService } from '../services/meetingService';

import {
  computeHealthScore,
  computeOverallReadiness,
  computeCeoNextMove,
  computeMarketHealth
} from '../lib/ruleEngine';

interface AppState {
  session: any | null;
  user: any | null;
  activeCompanyId: string | null;
  currentUserRole: SystemRole;
  currentMember: TeamMember | null;
  
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;

  reset: () => void;
  tasks: Task[];
  projects: Project[];
  config: CompanyConfig | null;
  ceoNextMove: CeoNextMove | null;
  
  products: ProductReadinessItem[];
  launchCategories: LaunchReadinessCategory[];
  launchBlockers: LaunchBlocker[];
  incubationPhase: IncubationPhase | null;
  deliverables: Deliverable[];
  meetings: Meeting[];
  expenses: Expense[];
  risks: Risk[];
  decisions: Decision[];
  kpis: KPI[];
  
  segments: MarketSegment[];
  leads: Lead[];
  opportunities: Opportunity[];
  offers: Offer[];
  pilots: Pilot[];
  customers: Customer[];
  campaigns: Campaign[];
  contents: Content[];
  partnerships: Partnership[];
  revenues: Revenue[];

  teamMembers: TeamMember[];
  goals: Goal[];
  initiatives: Initiative[];
  growthTargets: GrowthTarget[];

  // Phase 5
  financialAllocations: FinancialAllocation[];
  fundingMilestones: FundingMilestone[];
  financialScenarios: FinancialScenario[];
  financialSnapshots: FinancialSnapshot[];
  financialControl: FinancialControlState | null;

  // Phase 6
  governanceProfile: GovernanceProfile | null;
  obligations: Obligation[];
  govDocuments: DocumentRecord[];
  contracts: ContractRecord[];
  ipAssets: IPAsset[];
  govMeetings: GovMeeting[];
  governanceSignals: GovernanceSignal[];
  governanceCalendar: CalendarEntry[];

  productReadinessPct: number;
  launchReadinessPct: number;
  financeSummary: FinanceSummary | null;
  marketKPIs: MarketKPIs | null;
  companyHealth: CompanyHealthScore | null;
  teamPerformances: TeamPerformance[];

  isLoading: boolean;
  error: string | null;

  init: () => Promise<void>;
  setDemoRole: (role: SystemRole, member: TeamMember) => void;

  createTask: (data: NewTask) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createProject: (data: NewProject) => Promise<void>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateConfig: (patch: Partial<CompanyConfig>) => Promise<void>;
  createProductItem: (data: NewProductReadinessItem) => Promise<void>;
  updateProductItem: (id: string, patch: Partial<ProductReadinessItem>) => Promise<void>;
  deleteProductItem: (id: string) => Promise<void>;
  createLaunchBlocker: (data: NewLaunchBlocker) => Promise<void>;
  updateLaunchBlocker: (id: string, patch: Partial<LaunchBlocker>) => Promise<void>;
  deleteLaunchBlocker: (id: string) => Promise<void>;
  createExpense: (data: NewExpense) => Promise<void>;
  updateExpense: (id: string, patch: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  createRisk: (data: NewRisk) => Promise<void>;
  updateRisk: (id: string, patch: Partial<Risk>) => Promise<void>;
  deleteRisk: (id: string) => Promise<void>;
  createDecision: (data: NewDecision) => Promise<void>;
  updateDecision: (id: string, patch: Partial<Decision>) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;
  createKPI: (data: NewKPI) => Promise<void>;
  updateKPI: (id: string, patch: Partial<KPI>) => Promise<void>;
  deleteKPI: (id: string) => Promise<void>;

  createSegment: (data: any) => Promise<void>;
  updateSegment: (id: string, patch: Partial<MarketSegment>) => Promise<void>;
  deleteSegment: (id: string) => Promise<void>;
  createLead: (data: any) => Promise<void>;
  updateLead: (id: string, patch: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  createOpportunity: (data: any) => Promise<void>;
  updateOpportunity: (id: string, patch: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  createOffer: (data: any) => Promise<void>;
  updateOffer: (id: string, patch: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  createPilot: (data: any) => Promise<void>;
  updatePilot: (id: string, patch: Partial<Pilot>) => Promise<void>;
  deletePilot: (id: string) => Promise<void>;
  createCustomer: (data: any) => Promise<void>;
  updateCustomer: (id: string, patch: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  createCampaign: (data: any) => Promise<void>;
  updateCampaign: (id: string, patch: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  createContent: (data: any) => Promise<void>;
  updateContent: (id: string, patch: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  createPartnership: (data: any) => Promise<void>;
  updatePartnership: (id: string, patch: Partial<Partnership>) => Promise<void>;
  deletePartnership: (id: string) => Promise<void>;
  createRevenue: (data: any) => Promise<void>;
  updateRevenue: (id: string, patch: Partial<Revenue>) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;

  createTeamMember: (data: any) => Promise<void>;
  updateTeamMember: (id: string, patch: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  createGoal: (data: any) => Promise<void>;
  updateGoal: (id: string, patch: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  createInitiative: (data: any) => Promise<void>;
  updateInitiative: (id: string, patch: Partial<Initiative>) => Promise<void>;
  deleteInitiative: (id: string) => Promise<void>;
  createGrowthTarget: (data: any) => Promise<void>;
  updateGrowthTarget: (id: string, patch: Partial<GrowthTarget>) => Promise<void>;
  deleteGrowthTarget: (id: string) => Promise<void>;

  // Phase 5 CRUD
  createAllocation: (data: NewFinancialAllocation) => Promise<void>;
  updateAllocation: (id: string, patch: Partial<FinancialAllocation>) => Promise<void>;
  deleteAllocation: (id: string) => Promise<void>;
  createFundingMilestone: (data: NewFundingMilestone) => Promise<void>;
  updateFundingMilestone: (id: string, patch: Partial<FundingMilestone>) => Promise<void>;
  deleteFundingMilestone: (id: string) => Promise<void>;

  // Phase 6 CRUD
  createObligation: (data: NewObligation) => Promise<void>;
  updateObligation: (id: string, patch: Partial<Obligation>) => Promise<void>;
  deleteObligation: (id: string) => Promise<void>;
  createGovDocument: (data: NewDocumentRecord) => Promise<void>;
  updateGovDocument: (id: string, patch: Partial<DocumentRecord>) => Promise<void>;
  deleteGovDocument: (id: string) => Promise<void>;
  createContract: (data: NewContractRecord) => Promise<void>;
  updateContract: (id: string, patch: Partial<ContractRecord>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  createIPAsset: (data: NewIPAsset) => Promise<void>;
  updateIPAsset: (id: string, patch: Partial<IPAsset>) => Promise<void>;
  deleteIPAsset: (id: string) => Promise<void>;
  createGovMeeting: (data: NewMeeting) => Promise<void>;
  updateGovMeeting: (id: string, patch: Partial<GovMeeting>) => Promise<void>;
  deleteGovMeeting: (id: string) => Promise<void>;
}

function recomputeAll(s: Partial<AppState>): Partial<AppState> {
  const { 
    tasks = [], projects = [], config, products = [], launchCategories = [], launchBlockers = [], expenses = [], risks = [],
    leads = [], opportunities = [], pilots = [], customers = [], revenues = [],
    teamMembers = [], goals = [], initiatives = [], growthTargets = [],
    // Phase 5
    financialAllocations = [], financialSnapshots = [],
    // Phase 6
    obligations = [], govDocuments = [], contracts = [], ipAssets = [], govMeetings = [],
    governanceProfile,
  } = s;
  
  if (!config) return {};

  const updatedProjects = projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    if (pTasks.length === 0) return p;
    const completed = pTasks.filter(t => t.status === 'مكتملة').length;
    const progress = Math.round((completed / pTasks.length) * 100);
    return { ...p, progress };
  });

  const updatedInitiatives = initiatives.map(i => {
    const iProjects = updatedProjects.filter(p => p.initiativeId === i.id);
    if (iProjects.length === 0) return i;
    const progressSum = iProjects.reduce((acc, p) => acc + p.progress, 0);
    const progress = Math.round(progressSum / iProjects.length);
    return { ...i, progress };
  });

  const teamPerformances = teamMembers.map(m => getMemberPerformance(m, tasks, updatedProjects));
  const growthProgresses = growthTargets.map(g => g.target !== 0 ? Math.min(100, (g.current / g.target) * 100) : 0);

  let totalSpent = 0;
  let totalPlanned = 0;
  expenses.forEach(e => {
    if (e.status === 'Actual') totalSpent += e.actualAmount;
    else totalPlanned += e.plannedAmount;
  });

  const financeSummary: FinanceSummary = {
    totalFunding: config.fundingReceivedDZD,
    allocatedBudget: config.fundingReceivedDZD,
    plannedExpenses: totalPlanned,
    actualExpenses: totalSpent,
    remainingBudget: config.fundingReceivedDZD - totalSpent,
    utilizationPct: config.fundingReceivedDZD > 0 ? (totalSpent / config.fundingReceivedDZD) * 100 : 0,
    budgetCategories: []
  };

  let productReadinessPct = 0;
  if (products.length > 0) {
    const applicable = products.filter(p => p.status !== 'Not Applicable');
    const ready = applicable.filter(p => p.status === 'Ready');
    productReadinessPct = applicable.length > 0 ? Math.round((ready.length / applicable.length) * 100) : 0;
  }

  let launchReadinessPct = 0;
  if (launchCategories.length > 0) {
    const sum = launchCategories.reduce((acc, c) => acc + c.readiness, 0);
    launchReadinessPct = Math.round(sum / launchCategories.length);
  }

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const closedOpps = opportunities.filter(o => o.stage === 'Won' || o.stage === 'Lost');
  const wonOpps = opportunities.filter(o => o.stage === 'Won');
  const openOpps = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage));
  const completedPilots = pilots.filter(p => p.status === 'Completed' || p.status === 'Converted' || p.status === 'Failed');
  const convertedPilots = pilots.filter(p => p.status === 'Converted');
  const activeCustomersCount = customers.filter(c => c.status === 'Active' || c.status === 'Renewal').length;
  const expectedRevs = revenues.filter(r => r.status === 'Expected');
  const wonRevs = revenues.filter(r => r.status === 'Won');

  const marketHealthScore = computeMarketHealth(leads, opportunities, pilots, customers, revenues);

  const marketKPIs: MarketKPIs = {
    leadConversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    opportunityWinRate: closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 0,
    pilotConversionRate: completedPilots.length > 0 ? (convertedPilots.length / completedPilots.length) * 100 : 0,
    averageDealValue: activeCustomersCount > 0 ? (wonRevs.reduce((acc, r) => acc + r.amount, 0) / activeCustomersCount) : 0,
    pipelineValue: openOpps.reduce((acc, o) => acc + o.estimatedValue, 0),
    weightedPipeline: openOpps.reduce((acc, o) => acc + o.weightedValue, 0),
    expectedRevenue: expectedRevs.reduce((acc, r) => acc + r.amount, 0),
    wonRevenue: wonRevs.reduce((acc, r) => acc + r.amount, 0),
    marketHealthScore
  };

  const updatedConfig = { 
    ...config, 
    budgetSpentDZD: totalSpent,
    overallReadinessScore: computeOverallReadiness(config)
  };

  // Phase 5 — Financial Control Engine
  const financialControl = computeFinancialControl(
    config.fundingReceivedDZD,
    revenues,
    expenses,
    financialAllocations,
    financialSnapshots,
    financeSummary.utilizationPct
  );

  updatedConfig.startupHealthScore = computeHealthScore(
    tasks, updatedConfig, launchBlockers, risks, productReadinessPct
  );

  const companyHealth = calculateCompanyHealth(
    updatedConfig.startupHealthScore,
    financeSummary.utilizationPct,
    productReadinessPct,
    launchReadinessPct,
    marketHealthScore,
    teamPerformances,
    growthProgresses,
    financialControl.financialHealthScore  // Phase 5 feeds into Company Health
  );

  const ceoNextMove = computeCeoNextMove(
    tasks, updatedProjects, updatedConfig, launchBlockers, risks,
    productReadinessPct, launchReadinessPct,
    opportunities, pilots, customers, leads, s.campaigns || [],
    goals, updatedInitiatives, growthTargets
  );

  // Phase 6 — Governance Signals + Calendar
  const governanceSignals = computeGovernanceSignals(obligations, govDocuments, contracts, ipAssets);
  const governanceCalendar = buildGovernanceCalendar(
    obligations, govDocuments, contracts, govMeetings,
    governanceProfile?.nextGovernanceReviewDate
  );

  return {
    config: updatedConfig,
    ceoNextMove,
    financeSummary,
    productReadinessPct,
    launchReadinessPct,
    marketKPIs,
    projects: updatedProjects,
    initiatives: updatedInitiatives,
    companyHealth,
    teamPerformances,
    financialControl,  // Phase 5
    governanceSignals,  // Phase 6
    governanceCalendar, // Phase 6
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  session: null, user: null, activeCompanyId: null,
  currentUserRole: 'GUEST', currentMember: null,
  
  reset: () => {
    set({
      session: null, user: null, activeCompanyId: null,
      currentUserRole: 'GUEST', currentMember: null,
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

  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),

  tasks: [], projects: [], config: null, ceoNextMove: null,
  products: [], launchCategories: [], launchBlockers: [], incubationPhase: null,
  deliverables: [], meetings: [], expenses: [], risks: [], decisions: [], kpis: [],
  segments: [], leads: [], opportunities: [], offers: [], pilots: [],
  customers: [], campaigns: [], contents: [], partnerships: [], revenues: [],
  teamMembers: [], goals: [], initiatives: [], growthTargets: [],
  // Phase 5
  financialAllocations: [], fundingMilestones: [], financialScenarios: [], financialSnapshots: [], financialControl: null,
  // Phase 6
  governanceProfile: null, obligations: [], govDocuments: [], contracts: [], ipAssets: [], govMeetings: [],
  governanceSignals: [], governanceCalendar: [],
  productReadinessPct: 0, launchReadinessPct: 0, financeSummary: null, marketKPIs: null,
  companyHealth: null, teamPerformances: [],
  isLoading: false, error: null,

  setDemoRole: (role, member) => {
    set({ currentUserRole: role, currentMember: member });
    localStorage.setItem('haraka_demo_role', role);
    localStorage.setItem('haraka_demo_member', JSON.stringify(member));
  },

  init: async () => {
    // ── DEMO MODE: role selected from RoleSelector ───────────────────
    // If a role was selected, skip ALL Supabase auth and return immediately.
    const savedRole = localStorage.getItem('haraka_demo_role') as any;
    const savedMember = localStorage.getItem('haraka_demo_member');
    if (savedRole && savedMember) {
      try {
        const member = JSON.parse(savedMember);
        set({ currentUserRole: savedRole, currentMember: member, isLoading: false, error: null });
      } catch {
        set({ currentUserRole: savedRole, isLoading: false });
      }
      // In demo mode: do NOT touch Supabase at all — return now.
      return;
    }

    // ── SUPABASE AUTH MODE ────────────────────────────────────────────
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase client not found');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        get().reset();
        set({ isLoading: false, currentUserRole: 'GUEST', currentMember: null });
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

      const currentUserEmail = session.user?.email || '';
      const currentMember = teamMembers.find(m => m.email === currentUserEmail) || null;
      let currentUserRole: SystemRole = 'GUEST';

      if (currentMember) {
        const name = currentMember.name.toLowerCase();
        if (name.includes('abdelbasset') || name.includes('عبد الباسط')) currentUserRole = 'FOUNDER';
        else if (name.includes('riyad') || name.includes('نصير رياض') || name.includes('رياض')) currentUserRole = 'LEADERSHIP';
        else if (name.includes('hocine') || name.includes('حسين') || name.includes('djabellah') || name.includes('جاب الله')) currentUserRole = 'SCIENTIFIC';
        else if (name.includes('hadj mokhtar') || name.includes('حاج مختار')) currentUserRole = 'SCIENTIFIC';
        else if (name.includes('hamma') || name.includes('حمة') || name.includes('soltani')) currentUserRole = 'TECH';
        else if (name.includes('youssef') || name.includes('يوسف')) currentUserRole = 'LEGAL';
      }

      // If no member found but it's a test environment or fallback, you can do direct email mapping here
      if (!currentMember) {
        const email = currentUserEmail.toLowerCase();
        if (email.includes('abdelbasset')) currentUserRole = 'FOUNDER';
        else if (email.includes('riyad')) currentUserRole = 'LEADERSHIP';
        else if (email.includes('hocine') || email.includes('mokhtar')) currentUserRole = 'SCIENTIFIC';
        else if (email.includes('hamma')) currentUserRole = 'TECH';
        else if (email.includes('youssef')) currentUserRole = 'LEGAL';
      }

      const state = {
        session, user: session.user, activeCompanyId,
        currentUserRole, currentMember,
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

  createTask: async (data) => { const item = await taskService.create(data); set(s => { const tasks = [...s.tasks, item]; return { tasks, ...recomputeAll({ ...s, tasks }) }; }); },
  updateTask: async (id, patch) => { const updated = await taskService.update(id, patch); set(s => { const tasks = s.tasks.map(t => t.id === id ? updated : t); return { tasks, ...recomputeAll({ ...s, tasks }) }; }); },
  deleteTask: async (id) => { await taskService.delete(id); set(s => { const tasks = s.tasks.filter(t => t.id !== id); return { tasks, ...recomputeAll({ ...s, tasks }) }; }); },

  createProject: async (data) => { const project = await projectService.create(data); set(s => ({ projects: [...s.projects, project], ...recomputeAll({ ...s, projects: [...s.projects, project] }) })); },
  updateProject: async (id, patch) => { const updated = await projectService.update(id, patch); set(s => { const projects = s.projects.map(p => p.id === id ? updated : p); return { projects, ...recomputeAll({ ...s, projects }) }; }); },
  deleteProject: async (id) => { await projectService.delete(id); set(s => { const projects = s.projects.filter(p => p.id !== id); return { projects, ...recomputeAll({ ...s, projects }) }; }); },

  updateConfig: async (patch) => { const updated = await companyService.updateConfig(patch); set(s => ({ ...recomputeAll({ ...s, config: updated }) })); },

  createProductItem: async (data) => { const item = await productService.create(data); set(s => { const products = [...s.products, item]; return { products, ...recomputeAll({ ...s, products }) }; }); },
  updateProductItem: async (id, patch) => { const updated = await productService.update(id, patch); set(s => { const products = s.products.map(p => p.id === id ? updated : p); return { products, ...recomputeAll({ ...s, products }) }; }); },
  deleteProductItem: async (id) => { await productService.delete(id); set(s => { const products = s.products.filter(p => p.id !== id); return { products, ...recomputeAll({ ...s, products }) }; }); },

  createLaunchBlocker: async (data) => { const item = await launchService.createBlocker(data); set(s => { const launchBlockers = [...s.launchBlockers, item]; return { launchBlockers, ...recomputeAll({ ...s, launchBlockers }) }; }); },
  updateLaunchBlocker: async (id, patch) => { const updated = await launchService.updateBlocker(id, patch); set(s => { const launchBlockers = s.launchBlockers.map(b => b.id === id ? updated : b); return { launchBlockers, ...recomputeAll({ ...s, launchBlockers }) }; }); },
  deleteLaunchBlocker: async (id) => { await launchService.deleteBlocker(id); set(s => { const launchBlockers = s.launchBlockers.filter(b => b.id !== id); return { launchBlockers, ...recomputeAll({ ...s, launchBlockers }) }; }); },

  createExpense: async (data) => { const item = await financeService.createExpense(data); set(s => { const expenses = [...s.expenses, item]; return { expenses, ...recomputeAll({ ...s, expenses }) }; }); },
  updateExpense: async (id, patch) => { const updated = await financeService.updateExpense(id, patch); set(s => { const expenses = s.expenses.map(e => e.id === id ? updated : e); return { expenses, ...recomputeAll({ ...s, expenses }) }; }); },
  deleteExpense: async (id) => { await financeService.deleteExpense(id); set(s => { const expenses = s.expenses.filter(e => e.id !== id); return { expenses, ...recomputeAll({ ...s, expenses }) }; }); },

  createRisk: async (data) => { const item = await riskService.createRisk(data); set(s => { const risks = [...s.risks, item]; return { risks, ...recomputeAll({ ...s, risks }) }; }); },
  updateRisk: async (id, patch) => { const updated = await riskService.updateRisk(id, patch); set(s => { const risks = s.risks.map(r => r.id === id ? updated : r); return { risks, ...recomputeAll({ ...s, risks }) }; }); },
  deleteRisk: async (id) => { await riskService.deleteRisk(id); set(s => { const risks = s.risks.filter(r => r.id !== id); return { risks, ...recomputeAll({ ...s, risks }) }; }); },

  createDecision: async (data) => { const item = await decisionService.createDecision(data); set(s => ({ decisions: [...s.decisions, item] })); },
  updateDecision: async (id, patch) => { const updated = await decisionService.updateDecision(id, patch); set(s => ({ decisions: s.decisions.map(d => d.id === id ? updated : d) })); },
  deleteDecision: async (id) => { await decisionService.deleteDecision(id); set(s => ({ decisions: s.decisions.filter(d => d.id !== id) })); },

  createKPI: async (data) => { const item = await kpiService.createKPI(data); set(s => ({ kpis: [...s.kpis, item] })); },
  updateKPI: async (id, patch) => { const updated = await kpiService.updateKPI(id, patch); set(s => ({ kpis: s.kpis.map(k => k.id === id ? updated : k) })); },
  deleteKPI: async (id) => { await kpiService.deleteKPI(id); set(s => ({ kpis: s.kpis.filter(k => k.id !== id) })); },

  createSegment: async (data) => {
    const item = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(s => { const segments = [...s.segments, item]; return { segments, ...recomputeAll({ ...s, segments }) }; });
  },
  updateSegment: async (id, patch) => {
    set(s => { const segments = s.segments.map(i => i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i); return { segments, ...recomputeAll({ ...s, segments }) }; });
  },
  deleteSegment: async (id) => {
    set(s => { const segments = s.segments.filter(i => i.id !== id); return { segments, ...recomputeAll({ ...s, segments }) }; });
  },

  createLead: async (data) => {
    const item = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(s => { const leads = [...s.leads, item]; return { leads, ...recomputeAll({ ...s, leads }) }; });
  },
  updateLead: async (id, patch) => {
    set(s => { const leads = s.leads.map(i => i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i); return { leads, ...recomputeAll({ ...s, leads }) }; });
  },
  deleteLead: async (id) => {
    set(s => { const leads = s.leads.filter(i => i.id !== id); return { leads, ...recomputeAll({ ...s, leads }) }; });
  },

  createOpportunity: async (data) => {
    const weightedValue = data.estimatedValue * (data.probability / 100);
    const item = { ...data, weightedValue, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(s => { const opportunities = [...s.opportunities, item]; return { opportunities, ...recomputeAll({ ...s, opportunities }) }; });
  },
  updateOpportunity: async (id, patch) => {
    set(s => { 
      const opportunities = s.opportunities.map(i => {
        if (i.id === id) {
          const updated = { ...i, ...patch, updatedAt: new Date().toISOString() };
          updated.weightedValue = updated.estimatedValue * (updated.probability / 100);
          return updated;
        }
        return i;
      });
      return { opportunities, ...recomputeAll({ ...s, opportunities }) };
    });
  },
  deleteOpportunity: async (id) => {
    set(s => { const opportunities = s.opportunities.filter(i => i.id !== id); return { opportunities, ...recomputeAll({ ...s, opportunities }) }; });
  },

  createOffer: async (data) => {
    const item = { ...data, id: Date.now().toString() };
    set(s => { const offers = [...s.offers, item]; return { offers, ...recomputeAll({ ...s, offers }) }; });
  },
  updateOffer: async (id, patch) => {
    set(s => { const offers = s.offers.map(i => i.id === id ? { ...i, ...patch } : i); return { offers, ...recomputeAll({ ...s, offers }) }; });
  },
  deleteOffer: async (id) => {
    set(s => { const offers = s.offers.filter(i => i.id !== id); return { offers, ...recomputeAll({ ...s, offers }) }; });
  },

  createPilot: async (data) => {
    const os = (data.participationScore + data.satisfactionScore + data.technicalScore + data.objectiveScore) / 4;
    const item = { ...data, overallScore: os || 0, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(s => { const pilots = [...s.pilots, item]; return { pilots, ...recomputeAll({ ...s, pilots }) }; });
  },
  updatePilot: async (id, patch) => {
    set(s => { 
      const pilots = s.pilots.map(i => {
        if (i.id === id) {
          const u = { ...i, ...patch, updatedAt: new Date().toISOString() };
          u.overallScore = (u.participationScore + u.satisfactionScore + u.technicalScore + u.objectiveScore) / 4;
          return u;
        }
        return i;
      });
      return { pilots, ...recomputeAll({ ...s, pilots }) };
    });
  },
  deletePilot: async (id) => {
    set(s => { const pilots = s.pilots.filter(i => i.id !== id); return { pilots, ...recomputeAll({ ...s, pilots }) }; });
  },

  createCustomer: async (data) => {
    const item = { ...data, id: Date.now().toString() };
    set(s => { const customers = [...s.customers, item]; return { customers, ...recomputeAll({ ...s, customers }) }; });
  },
  updateCustomer: async (id, patch) => {
    set(s => { const customers = s.customers.map(i => i.id === id ? { ...i, ...patch } : i); return { customers, ...recomputeAll({ ...s, customers }) }; });
  },
  deleteCustomer: async (id) => {
    set(s => { const customers = s.customers.filter(i => i.id !== id); return { customers, ...recomputeAll({ ...s, customers }) }; });
  },

  createCampaign: async (data) => {
    const item = { ...data, id: Date.now().toString() };
    set(s => { const campaigns = [...s.campaigns, item]; return { campaigns, ...recomputeAll({ ...s, campaigns }) }; });
  },
  updateCampaign: async (id, patch) => {
    set(s => { const campaigns = s.campaigns.map(i => i.id === id ? { ...i, ...patch } : i); return { campaigns, ...recomputeAll({ ...s, campaigns }) }; });
  },
  deleteCampaign: async (id) => {
    set(s => { const campaigns = s.campaigns.filter(i => i.id !== id); return { campaigns, ...recomputeAll({ ...s, campaigns }) }; });
  },

  createContent: async (data) => {
    const item = { ...data, id: Date.now().toString() };
    set(s => { const contents = [...s.contents, item]; return { contents, ...recomputeAll({ ...s, contents }) }; });
  },
  updateContent: async (id, patch) => {
    set(s => { const contents = s.contents.map(i => i.id === id ? { ...i, ...patch } : i); return { contents, ...recomputeAll({ ...s, contents }) }; });
  },
  deleteContent: async (id) => {
    set(s => { const contents = s.contents.filter(i => i.id !== id); return { contents, ...recomputeAll({ ...s, contents }) }; });
  },

  createPartnership: async (data) => {
    const item = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(s => { const partnerships = [...s.partnerships, item]; return { partnerships, ...recomputeAll({ ...s, partnerships }) }; });
  },
  updatePartnership: async (id, patch) => {
    set(s => { const partnerships = s.partnerships.map(i => i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i); return { partnerships, ...recomputeAll({ ...s, partnerships }) }; });
  },
  deletePartnership: async (id) => {
    set(s => { const partnerships = s.partnerships.filter(i => i.id !== id); return { partnerships, ...recomputeAll({ ...s, partnerships }) }; });
  },

  createRevenue: async (data) => {
    const item = { ...data, id: Date.now().toString() };
    set(s => { const revenues = [...s.revenues, item]; return { revenues, ...recomputeAll({ ...s, revenues }) }; });
  },
  updateRevenue: async (id, patch) => {
    set(s => { const revenues = s.revenues.map(i => i.id === id ? { ...i, ...patch } : i); return { revenues, ...recomputeAll({ ...s, revenues }) }; });
  },
  deleteRevenue: async (id) => {
    set(s => { const revenues = s.revenues.filter(i => i.id !== id); return { revenues, ...recomputeAll({ ...s, revenues }) }; });
  },

  createTeamMember: async (data) => { const item = await teamService.create(data); set(s => { const teamMembers = [...s.teamMembers, item]; return { teamMembers, ...recomputeAll({ ...s, teamMembers }) }; }); },
  updateTeamMember: async (id, patch) => { set(s => { const teamMembers = s.teamMembers.map(i => i.id === id ? { ...i, ...patch } : i); return { teamMembers, ...recomputeAll({ ...s, teamMembers }) }; }); },
  deleteTeamMember: async (id) => { set(s => { const teamMembers = s.teamMembers.filter(i => i.id !== id); return { teamMembers, ...recomputeAll({ ...s, teamMembers }) }; }); },

  createGoal: async (data) => { const item = await goalService.create(data); set(s => { const goals = [...s.goals, item]; return { goals, ...recomputeAll({ ...s, goals }) }; }); },
  updateGoal: async (id, patch) => { set(s => { const goals = s.goals.map(i => i.id === id ? { ...i, ...patch } : i); return { goals, ...recomputeAll({ ...s, goals }) }; }); },
  deleteGoal: async (id) => { set(s => { const goals = s.goals.filter(i => i.id !== id); return { goals, ...recomputeAll({ ...s, goals }) }; }); },

  createInitiative: async (data) => { const item = await initiativeService.create(data); set(s => { const initiatives = [...s.initiatives, item]; return { initiatives, ...recomputeAll({ ...s, initiatives }) }; }); },
  updateInitiative: async (id, patch) => { set(s => { const initiatives = s.initiatives.map(i => i.id === id ? { ...i, ...patch } : i); return { initiatives, ...recomputeAll({ ...s, initiatives }) }; }); },
  deleteInitiative: async (id) => { set(s => { const initiatives = s.initiatives.filter(i => i.id !== id); return { initiatives, ...recomputeAll({ ...s, initiatives }) }; }); },

  createGrowthTarget: async (data) => { const item = await growthService.create(data); set(s => { const growthTargets = [...s.growthTargets, item]; return { growthTargets, ...recomputeAll({ ...s, growthTargets }) }; }); },
  updateGrowthTarget: async (id, patch) => { set(s => { const growthTargets = s.growthTargets.map(i => i.id === id ? { ...i, ...patch } : i); return { growthTargets, ...recomputeAll({ ...s, growthTargets }) }; }); },
  deleteGrowthTarget: async (id) => { set(s => { const growthTargets = s.growthTargets.filter(i => i.id !== id); return { growthTargets, ...recomputeAll({ ...s, growthTargets }) }; }); },

  // Phase 5 — Financial Control CRUD
  createAllocation: async (data) => {
    const item = await allocationService.create(data);
    set(s => { const financialAllocations = [...s.financialAllocations, item]; return { financialAllocations, ...recomputeAll({ ...s, financialAllocations }) }; });
  },
  updateAllocation: async (id, patch) => {
    const updated = await allocationService.update(id, patch);
    set(s => { const financialAllocations = s.financialAllocations.map(a => a.id === id ? updated : a); return { financialAllocations, ...recomputeAll({ ...s, financialAllocations }) }; });
  },
  deleteAllocation: async (id) => {
    await allocationService.delete(id);
    set(s => { const financialAllocations = s.financialAllocations.filter(a => a.id !== id); return { financialAllocations, ...recomputeAll({ ...s, financialAllocations }) }; });
  },

  createFundingMilestone: async (data) => {
    const item = await fundingMilestoneService.create(data);
    set(s => ({ fundingMilestones: [...s.fundingMilestones, item] }));
  },
  updateFundingMilestone: async (id, patch) => {
    const updated = await fundingMilestoneService.update(id, patch);
    set(s => ({ fundingMilestones: s.fundingMilestones.map(m => m.id === id ? updated : m) }));
  },
  deleteFundingMilestone: async (id) => {
    await fundingMilestoneService.delete(id);
    set(s => ({ fundingMilestones: s.fundingMilestones.filter(m => m.id !== id) }));
  },

  // Phase 6 CRUD
  createObligation: async (data) => {
    const item = await obligationService.create(data);
    set(s => { const obligations = [...s.obligations, item]; return { obligations, ...recomputeAll({ ...s, obligations }) }; });
  },
  updateObligation: async (id, patch) => {
    const updated = await obligationService.update(id, patch);
    set(s => { const obligations = s.obligations.map(o => o.id === id ? updated : o); return { obligations, ...recomputeAll({ ...s, obligations }) }; });
  },
  deleteObligation: async (id) => {
    await obligationService.delete(id);
    set(s => { const obligations = s.obligations.filter(o => o.id !== id); return { obligations, ...recomputeAll({ ...s, obligations }) }; });
  },

  createGovDocument: async (data) => {
    const item = await documentService.create(data);
    set(s => { const govDocuments = [...s.govDocuments, item]; return { govDocuments, ...recomputeAll({ ...s, govDocuments }) }; });
  },
  updateGovDocument: async (id, patch) => {
    const updated = await documentService.update(id, patch);
    set(s => { const govDocuments = s.govDocuments.map(d => d.id === id ? updated : d); return { govDocuments, ...recomputeAll({ ...s, govDocuments }) }; });
  },
  deleteGovDocument: async (id) => {
    await documentService.delete(id);
    set(s => { const govDocuments = s.govDocuments.filter(d => d.id !== id); return { govDocuments, ...recomputeAll({ ...s, govDocuments }) }; });
  },

  createContract: async (data) => {
    const item = await contractService.create(data);
    set(s => { const contracts = [...s.contracts, item]; return { contracts, ...recomputeAll({ ...s, contracts }) }; });
  },
  updateContract: async (id, patch) => {
    const updated = await contractService.update(id, patch);
    set(s => { const contracts = s.contracts.map(c => c.id === id ? updated : c); return { contracts, ...recomputeAll({ ...s, contracts }) }; });
  },
  deleteContract: async (id) => {
    await contractService.delete(id);
    set(s => { const contracts = s.contracts.filter(c => c.id !== id); return { contracts, ...recomputeAll({ ...s, contracts }) }; });
  },

  createIPAsset: async (data) => {
    const item = await ipService.create(data);
    set(s => { const ipAssets = [...s.ipAssets, item]; return { ipAssets, ...recomputeAll({ ...s, ipAssets }) }; });
  },
  updateIPAsset: async (id, patch) => {
    const updated = await ipService.update(id, patch);
    set(s => { const ipAssets = s.ipAssets.map(a => a.id === id ? updated : a); return { ipAssets, ...recomputeAll({ ...s, ipAssets }) }; });
  },
  deleteIPAsset: async (id) => {
    await ipService.delete(id);
    set(s => { const ipAssets = s.ipAssets.filter(a => a.id !== id); return { ipAssets, ...recomputeAll({ ...s, ipAssets }) }; });
  },

  createGovMeeting: async (data) => {
    const item = await govMeetingService.create(data);
    set(s => { const govMeetings = [...s.govMeetings, item]; return { govMeetings, ...recomputeAll({ ...s, govMeetings }) }; });
  },
  updateGovMeeting: async (id, patch) => {
    const updated = await govMeetingService.update(id, patch);
    set(s => { const govMeetings = s.govMeetings.map(m => m.id === id ? updated : m); return { govMeetings, ...recomputeAll({ ...s, govMeetings }) }; });
  },
  deleteGovMeeting: async (id) => {
    await govMeetingService.delete(id);
    set(s => { const govMeetings = s.govMeetings.filter(m => m.id !== id); return { govMeetings, ...recomputeAll({ ...s, govMeetings }) }; });
  },
}));
