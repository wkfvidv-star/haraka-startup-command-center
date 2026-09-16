import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: governanceService.ts — Phase 6
// Governance Profile + Signals + Calendar engine.
// DEMO DATA.
// ============================================================
import { GovernanceProfile, GovernanceSignal, CalendarEntry } from '../types/governance';
import { Obligation } from '../types/governance';
import { DocumentRecord } from '../types/governance';
import { ContractRecord } from '../types/governance';
import { IPAsset } from '../types/governance';
import { Meeting } from '../types/governance';

async function getCompanyId(): Promise<string> {
  const { data: { session } } = await supabase!.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data: members, error } = await supabase!
    .from('company_members')
    .select('company_id')
    .eq('status', 'Active')
    .limit(1);
  if (error || !members || members.length === 0) throw new Error('No active company found for user');
  return members[0].company_id;
}

export const governanceService = {
  getProfile: async (): Promise<GovernanceProfile> => {
    const company_id = await getCompanyId();
    const { data, error } = await supabase!
      .from('governance_profiles')
      .select('*')
      .eq('company_id', company_id)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      // Return a default profile — no record yet
      return {
        id: '',
        companyStage: '',
        legalStatus: '',
        incubationStatus: '',
        startupStatus: '',
        currentStrategicPhase: '',
        founderCount: 0,
        importantNotes: '',
        nextGovernanceReviewDate: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return data as GovernanceProfile;
  },
  updateProfile: async (patch: Partial<GovernanceProfile>): Promise<GovernanceProfile> => {
    const company_id = await getCompanyId();
    const { data: existing } = await supabase!
      .from('governance_profiles')
      .select('id')
      .eq('company_id', company_id)
      .maybeSingle();

    let result;
    if (existing?.id) {
      const { data, error } = await supabase!
        .from('governance_profiles')
        .update(patch)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase!
        .from('governance_profiles')
        .insert([{ ...patch, company_id }])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return result as GovernanceProfile;
  },
};

// ─── Governance Signals Engine ──────────────────────────────
export function computeGovernanceSignals(
  obligations: Obligation[],
  documents: DocumentRecord[],
  contracts: ContractRecord[],
  ipAssets: IPAsset[],
): GovernanceSignal[] {
  const signals: GovernanceSignal[] = [];
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86400000);
  const in30 = new Date(now.getTime() + 30 * 86400000);

  // Critical: overdue critical obligation
  const criticalOverdue = obligations.filter(
    o => o.status === 'Overdue' && o.priority === 'Critical'
  );
  if (criticalOverdue.length > 0) {
    signals.push({
      severity: 'Critical',
      title: 'التزامات حرجة متأخرة',
      message: `${criticalOverdue.length} التزام حرج متأخر: ${criticalOverdue.map(o => o.title).join(' / ')}`,
    });
  }

  // High: overdue high priority obligation
  const highOverdue = obligations.filter(
    o => o.status === 'Overdue' && o.priority === 'High'
  );
  if (highOverdue.length > 0) {
    signals.push({
      severity: 'High',
      title: 'التزامات عالية الأولوية متأخرة',
      message: `${highOverdue.length} التزام عالي الأولوية متأخر`,
    });
  }

  // High: important contract expired
  const expiredContracts = contracts.filter(c => c.status === 'Expired');
  if (expiredContracts.length > 0) {
    signals.push({
      severity: 'High',
      title: 'عقود منتهية الصلاحية',
      message: `${expiredContracts.length} عقد منتهٍ يحتاج تجديدًا أو إغلاقًا`,
    });
  }

  // High: important document expired
  const expiredDocs = documents.filter(d => d.status === 'Expired');
  if (expiredDocs.length > 0) {
    signals.push({
      severity: 'High',
      title: 'وثائق منتهية الصلاحية',
      message: `${expiredDocs.length} وثيقة منتهية الصلاحية`,
    });
  }

  // Warning: obligation due within 7 days
  const dueSoonObl = obligations.filter(o => {
    if (o.status === 'Completed' || o.status === 'Cancelled' || o.status === 'Overdue') return false;
    const due = new Date(o.dueDate);
    return due >= now && due <= in7;
  });
  if (dueSoonObl.length > 0) {
    signals.push({
      severity: 'Warning',
      title: 'التزامات مستحقة خلال 7 أيام',
      message: `${dueSoonObl.length} التزام يستحق خلال 7 أيام`,
    });
  }

  // Warning: contract expiring within 30 days
  const expiringContracts = contracts.filter(c => c.status === 'Expiring');
  if (expiringContracts.length > 0) {
    signals.push({
      severity: 'Warning',
      title: 'عقود تقترب من الانتهاء',
      message: `${expiringContracts.length} عقد يقترب من الانتهاء خلال 30 يومًا`,
    });
  }

  // Warning: document expiring within 30 days
  const expiringDocs = documents.filter(d => {
    if (!d.expiryDate || d.status === 'Expired' || d.status === 'Archived' || d.status === 'Missing') return false;
    const exp = new Date(d.expiryDate);
    return exp >= now && exp <= in30;
  });
  if (expiringDocs.length > 0) {
    signals.push({
      severity: 'Warning',
      title: 'وثائق تقترب من الانتهاء',
      message: `${expiringDocs.length} وثيقة تقترب من الانتهاء`,
    });
  }

  // Warning: IP review required
  const ipReview = ipAssets.filter(
    a => a.protectionStatus === 'Review Required' || a.protectionStatus === 'Not Protected'
  );
  if (ipReview.length > 0) {
    signals.push({
      severity: 'Warning',
      title: 'ملكية فكرية تحتاج مراجعة',
      message: `${ipReview.length} أصول ملكية فكرية تحتاج مراجعة أو حماية`,
    });
  }

  if (signals.length === 0) {
    signals.push({
      severity: 'Healthy',
      title: 'الحوكمة بخير',
      message: 'لا توجد تنبيهات حوكمة حرجة أو عالية حالياً.',
    });
  }

  return signals;
}

// ─── Calendar Builder ───────────────────────────────────────
export function buildGovernanceCalendar(
  obligations: Obligation[],
  documents: DocumentRecord[],
  contracts: ContractRecord[],
  meetings: Meeting[],
  governanceReviewDate?: string,
): CalendarEntry[] {
  const now = new Date();
  const entries: CalendarEntry[] = [];

  // Obligations
  obligations
    .filter(o => o.status !== 'Completed' && o.status !== 'Cancelled')
    .forEach(o => {
      const sev = o.status === 'Overdue'
        ? (o.priority === 'Critical' ? 'Critical' : 'High')
        : o.priority === 'Critical' ? 'Warning' : 'Warning';
      entries.push({
        id: o.id,
        type: 'Obligation',
        title: o.title,
        date: o.dueDate,
        status: o.status,
        severity: sev as any,
      });
    });

  // Documents with expiry
  documents
    .filter(d => d.expiryDate && d.status !== 'Archived')
    .forEach(d => {
      const exp = new Date(d.expiryDate!);
      const sev = exp < now ? 'High' : 'Warning';
      entries.push({
        id: d.id,
        type: 'DocumentExpiry',
        title: `انتهاء: ${d.name}`,
        date: d.expiryDate!,
        status: d.status,
        severity: sev as any,
      });
    });

  // Contract expirations
  contracts
    .filter(c => c.status === 'Expiring' || c.status === 'Expired')
    .forEach(c => {
      const sev = c.status === 'Expired' ? 'High' : 'Warning';
      entries.push({
        id: c.id,
        type: 'ContractExpiry',
        title: `انتهاء عقد: ${c.name}`,
        date: c.endDate,
        status: c.status,
        severity: sev as any,
      });
    });

  // Meetings
  meetings
    .filter(m => m.status === 'Planned')
    .forEach(m => {
      entries.push({
        id: m.id,
        type: 'Meeting',
        title: m.title,
        date: m.date,
        status: m.status,
        severity: 'Healthy',
      });
    });

  // Governance review
  if (governanceReviewDate) {
    entries.push({
      id: 'gov-review',
      type: 'GovernanceReview',
      title: 'مراجعة الحوكمة الدورية',
      date: governanceReviewDate,
      status: 'Planned',
      severity: 'Warning',
    });
  }

  // Sort by date ascending
  return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
