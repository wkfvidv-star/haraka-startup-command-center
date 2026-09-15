// ============================================================
// TYPES: market.ts — Phase 3 GTM & Revenue Types
// ============================================================

export type MarketSegmentType = 'Education' | 'Sports' | 'Rehabilitation' | 'Youth' | 'Institutional' | 'Other';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type SegmentStatus = 'Target' | 'Testing' | 'Validated' | 'Paused';

export interface MarketSegment {
  id: string;
  name: string;
  type: MarketSegmentType;
  description: string;
  problem: string;
  valueProposition: string;
  priority: PriorityLevel;
  status: SegmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube' | 'LinkedIn' | 'Website' | 'Referral' | 'Event' | 'University' | 'School Outreach' | 'Coach Outreach' | 'Partnership' | 'Direct Contact' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  segmentId: string;
  source: LeadSource;
  status: LeadStatus;
  interestLevel: PriorityLevel;
  owner: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferType = 'School' | 'Institution' | 'Coach' | 'Youth' | 'Pilot' | 'Video Analysis' | 'Report' | 'Custom';
export type BillingModel = 'One-Time' | 'Monthly' | 'Annual' | 'Pilot' | 'Custom';
export type OfferStatus = 'Active' | 'Draft' | 'Archived';

export interface Offer {
  id: string;
  name: string;
  targetSegment: string;
  type: OfferType;
  description: string;
  price: number;
  billingModel: BillingModel;
  status: OfferStatus;
  notes: string;
}

export type OpportunityStage = 'Qualified' | 'Proposal' | 'Negotiation' | 'Pilot' | 'Won' | 'Lost';

export interface Opportunity {
  id: string;
  leadId: string;
  organization: string;
  title: string;
  segmentId: string;
  offerId: string;
  stage: OpportunityStage;
  estimatedValue: number;
  probability: number; // 0-100
  weightedValue: number; // calculated: estimatedValue * (probability / 100)
  expectedCloseDate: string;
  owner: string;
  lastActivityDate: string;
  nextAction: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type PilotStatus = 'Planned' | 'Preparation' | 'Active' | 'Evaluation' | 'Completed' | 'Converted' | 'Paused' | 'Failed';

export interface Pilot {
  id: string;
  opportunityId: string;
  organization: string;
  segmentId: string;
  objective: string;
  startDate: string;
  endDate: string;
  status: PilotStatus;
  participants: number;
  successCriteria: string;
  participationScore: number;
  satisfactionScore: number;
  technicalScore: number;
  objectiveScore: number;
  overallScore: number; // calculated: avg of above 4
  result: string;
  conversionPotential: PriorityLevel;
  owner: string;
  feedback: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'Active' | 'At Risk' | 'Renewal' | 'Churned';

export interface Customer {
  id: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  segmentId: string;
  offerId: string;
  status: CustomerStatus;
  contractValue: number;
  billingModel: BillingModel;
  startDate: string;
  renewalDate: string;
  activeUsers: number;
  satisfaction: PriorityLevel;
  renewalProbability: number;
  lastActivityDate: string;
  nextAction: string;
  notes: string;
}

export type CampaignStatus = 'Planned' | 'Active' | 'Completed' | 'Paused' | 'Cancelled';

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  channel: LeadSource;
  segmentId: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: CampaignStatus;
  leadsGenerated: number;
  opportunitiesGenerated: number;
  customersGenerated: number;
  revenueGenerated: number;
  notes: string;
}

export type ContentStatus = 'Idea' | 'Draft' | 'Review' | 'Approved' | 'Published' | 'Archived';

export interface Content {
  id: string;
  title: string;
  platform: LeadSource;
  contentType: string;
  campaignId: string;
  segmentId: string;
  publishDate: string;
  status: ContentStatus;
  cta: string;
  result: string;
  notes: string;
}

export type PartnershipType = 'School' | 'University' | 'Club' | 'Coach' | 'Association' | 'Technology' | 'Media' | 'Institution' | 'Other';
export type PartnershipStatus = 'Identified' | 'Contacted' | 'Discussion' | 'Negotiation' | 'Active' | 'Inactive';

export interface Partnership {
  id: string;
  name: string;
  organization: string;
  type: PartnershipType;
  contactPerson: string;
  status: PartnershipStatus;
  objective: string;
  potentialValue: number;
  owner: string;
  nextAction: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type RevenueType = 'One-Time' | 'Recurring' | 'Pilot' | 'Other';
export type RevenueStatus = 'Expected' | 'Won' | 'Cancelled';

export interface Revenue {
  id: string;
  customerId: string;
  opportunityId: string;
  offerId: string;
  type: RevenueType;
  amount: number;
  date: string;
  status: RevenueStatus;
  source: string;
  notes: string;
}

export interface MarketKPIs {
  leadConversionRate: number; // Converted Leads / Total Leads × 100
  opportunityWinRate: number; // Won / Closed × 100
  pilotConversionRate: number; // Converted / Completed × 100
  averageDealValue: number; // Won Revenue / Won Customers
  pipelineValue: number; // Sum estimatedValue of open opps
  weightedPipeline: number; // Sum weightedValue of open opps
  expectedRevenue: number; // Sum Revenue status=Expected
  wonRevenue: number; // Sum Revenue status=Won
  marketHealthScore: number; // Deterministic calculation
}
