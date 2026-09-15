// ============================================================
// TYPES: governance.ts — Phase 6 Governance & Operations Control
// All data is DEMO DATA. No real legal records.
// ============================================================

// ─── Governance Profile ──────────────────────────────────────
export interface GovernanceProfile {
  id: string;
  companyStage: string;
  legalStatus: string;
  incubationStatus: string;
  startupStatus: string;
  currentStrategicPhase: string;
  founderCount: number;
  importantNotes: string;
  nextGovernanceReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Obligation ───────────────────────────────────────────────
export type ObligationType =
  | 'Incubation' | 'Administrative' | 'Legal'
  | 'Financial' | 'Contractual' | 'Strategic' | 'Other';

export type ObligationPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ObligationStatus =
  | 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

export interface Obligation {
  id: string;
  title: string;
  description: string;
  type: ObligationType;
  priority: ObligationPriority;
  dueDate: string;
  owner: string;
  status: ObligationStatus;
  relatedDocumentId?: string;
  relatedProjectId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewObligation = Omit<Obligation, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Document Record ─────────────────────────────────────────
export type DocumentCategory =
  | 'Company' | 'Incubation' | 'Funding' | 'Business'
  | 'Product' | 'Marketing' | 'Legal' | 'IP' | 'Contract' | 'Other';

export type DocumentStatus =
  | 'Draft' | 'Active' | 'Expired' | 'Archived' | 'Missing';

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  owner: string;
  documentDate: string;
  expiryDate?: string;
  relatedProjectId?: string;
  relatedGoalId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewDocumentRecord = Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Contract Record ─────────────────────────────────────────
export type ContractType =
  | 'School' | 'Coach' | 'Partner' | 'Supplier' | 'Service' | 'Collaboration' | 'Other';

export type ContractStatus =
  | 'Draft' | 'Active' | 'Expiring' | 'Expired' | 'Terminated';

export interface ContractRecord {
  id: string;
  name: string;
  counterparty: string;
  type: ContractType;
  startDate: string;
  endDate: string;
  value: number;
  status: ContractStatus;
  renewalDate?: string;
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewContractRecord = Omit<ContractRecord, 'id' | 'createdAt' | 'updatedAt'>;

// ─── IP Asset ────────────────────────────────────────────────
export type IPType =
  | 'Brand' | 'Logo' | 'Platform' | 'Source Code' | 'Research'
  | 'Algorithm' | 'Content' | 'AI Model' | 'Other';

export type IPStatus =
  | 'Planned' | 'In Progress' | 'Protected' | 'Under Review' | 'Archived';

export type IPProtectionStatus =
  | 'Not Protected' | 'In Process' | 'Protected' | 'Review Required';

export interface IPAsset {
  id: string;
  name: string;
  type: IPType;
  description: string;
  status: IPStatus;
  owner: string;
  registrationDate?: string;
  reviewDate?: string;
  protectionStatus: IPProtectionStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewIPAsset = Omit<IPAsset, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Meeting ────────────────────────────────────────────────
export type MeetingStatus = 'Planned' | 'Completed' | 'Cancelled';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: string[];
  objective: string;
  notes: string;
  decisions: string;
  nextMeetingDate?: string;
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
}

export type NewMeeting = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Governance Signal ───────────────────────────────────────
export type GovernanceSignalSeverity = 'Critical' | 'High' | 'Warning' | 'Healthy';

export interface GovernanceSignal {
  severity: GovernanceSignalSeverity;
  title: string;
  message: string;
}

// ─── Calendar Entry (unified view) ───────────────────────────
export type CalendarEntryType =
  | 'Obligation' | 'ContractExpiry' | 'DocumentExpiry'
  | 'Meeting' | 'GovernanceReview' | 'FundingMilestone';

export interface CalendarEntry {
  id: string;
  type: CalendarEntryType;
  title: string;
  date: string;
  status: string;
  severity: GovernanceSignalSeverity;
}
