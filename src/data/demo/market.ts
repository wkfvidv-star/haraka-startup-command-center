// ============================================================
// DEMO DATA: market.ts
// ⚠ بيانات تجريبية — DEMO DATA
// ============================================================
import { 
  MarketSegment, Lead, Opportunity, Offer, Pilot, 
  Customer, Campaign, Content, Partnership, Revenue 
} from '../../types/market';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 86_400_000).toISOString();

export const demoMarketSegments: MarketSegment[] = [
  { id: 'seg1', name: 'المدارس الخاصة', type: 'Education', description: 'بيانات تجريبية: المدارس الخاصة التي تبحث عن رقمنة المتابعة الرياضية.', problem: 'صعوبة تتبع أداء الطلاب الرياضي والتواصل مع الأولياء.', valueProposition: 'منصة رقمية موحدة لمتابعة التطور البدني ومشاركته.', priority: 'Critical', status: 'Target', notes: '', createdAt: daysAgo(30), updatedAt: daysAgo(2) },
  { id: 'seg2', name: 'الأكاديميات الرياضية', type: 'Sports', description: 'بيانات تجريبية: نوادي كرة القدم والسباحة للشباب.', problem: 'غياب البيانات التاريخية لتطور اللاعب.', valueProposition: 'ملف رياضي رقمي يرافق اللاعب.', priority: 'High', status: 'Testing', notes: '', createdAt: daysAgo(30), updatedAt: daysAgo(10) },
];

export const demoOffers: Offer[] = [
  { id: 'off1', name: 'اشتراك المدارس (سنوي)', targetSegment: 'seg1', type: 'School', description: 'بيانات تجريبية: وصول كامل للمنصة مع 500 حساب طالب.', price: 250000, billingModel: 'Annual', status: 'Active', notes: '' },
  { id: 'off2', name: 'تجربة مجانية (Pilot)', targetSegment: 'seg1', type: 'Pilot', description: 'بيانات تجريبية: فترة تجريبية مجانية لمدة 3 أشهر لمدرسة واحدة.', price: 0, billingModel: 'Pilot', status: 'Active', notes: '' },
];

export const demoLeads: Lead[] = [
  { id: 'ld1', name: 'محمد أمين', organization: 'مدرسة ديمو الجزائر', contactPerson: 'المدير العام', email: 'director@demoalger.dz', phone: '0555001122', city: 'الجزائر', segmentId: 'seg1', source: 'Direct Contact', status: 'Qualified', interestLevel: 'High', owner: 'فريق المبيعات', lastContactDate: daysAgo(5), nextFollowUpDate: daysAhead(2), notes: 'بيانات تجريبية: مهتم جداً ببرنامج التجربة (Pilot).', createdAt: daysAgo(20), updatedAt: daysAgo(5) },
  { id: 'ld2', name: 'سمير', organization: 'أكاديمية المستقبل الرياضية', contactPerson: 'المدير الفني', email: 'contact@future-academy.dz', phone: '0777002233', city: 'وهران', segmentId: 'seg2', source: 'Instagram', status: 'New', interestLevel: 'Medium', owner: 'فريق المبيعات', lastContactDate: daysAgo(1), nextFollowUpDate: daysAhead(5), notes: 'بيانات تجريبية: تواصل معنا عبر إنستغرام.', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
];

export const demoOpportunities: Opportunity[] = [
  { id: 'opp1', leadId: 'ld1', organization: 'مدرسة ديمو الجزائر', title: 'إطلاق التجربة المدرسية', segmentId: 'seg1', offerId: 'off2', stage: 'Negotiation', estimatedValue: 250000, probability: 80, weightedValue: 200000, expectedCloseDate: daysAhead(10), owner: 'المدير التنفيذي', lastActivityDate: daysAgo(2), nextAction: 'توقيع العقد التجريبي', notes: 'بيانات تجريبية: تم الاتفاق على كل البنود، بانتظار توقيع الإدارة.', createdAt: daysAgo(15), updatedAt: daysAgo(2) },
  { id: 'opp2', leadId: 'ld2', organization: 'أكاديمية المستقبل الرياضية', title: 'اشتراك سنوي للأكاديمية', segmentId: 'seg2', offerId: 'off1', stage: 'Qualified', estimatedValue: 150000, probability: 30, weightedValue: 45000, expectedCloseDate: daysAhead(45), owner: 'فريق المبيعات', lastActivityDate: daysAgo(1), nextAction: 'تحديد موعد العرض التقديمي', notes: 'بيانات تجريبية: فرصة جديدة تحتاج لتأهيل أعمق.', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
];

export const demoPilots: Pilot[] = [
  { id: 'pil1', opportunityId: 'opp1', organization: 'مدرسة ديمو الجزائر', segmentId: 'seg1', objective: 'اختبار لوحة تحكم الطالب وإدخال البيانات من قبل المعلمين.', startDate: daysAhead(15), endDate: daysAhead(105), status: 'Preparation', participants: 300, successCriteria: 'إدخال بيانات 80% من الطلاب مرتين شهرياً.', participationScore: 0, satisfactionScore: 0, technicalScore: 0, objectiveScore: 0, overallScore: 0, result: '', conversionPotential: 'High', owner: 'العمليات', feedback: '', nextAction: 'تدريب المعلمين', createdAt: daysAgo(5), updatedAt: daysAgo(1) }
];

export const demoCustomers: Customer[] = [
  { id: 'cust1', organization: 'مدرسة النخبة', contactPerson: 'أحمد', email: 'ahmed@nokhba.dz', phone: '0666000000', segmentId: 'seg1', offerId: 'off1', status: 'Active', contractValue: 250000, billingModel: 'Annual', startDate: daysAgo(100), renewalDate: daysAhead(265), activeUsers: 450, satisfaction: 'High', renewalProbability: 90, lastActivityDate: daysAgo(10), nextAction: 'إرسال تقرير الأداء الربع سنوي', notes: 'بيانات تجريبية: أول عميل مدفوع.' }
];

export const demoCampaigns: Campaign[] = [
  { id: 'camp1', name: 'حملة العودة المدرسية', objective: 'جلب 50 مدرسة محتملة', channel: 'Facebook', segmentId: 'seg1', startDate: daysAgo(15), endDate: daysAhead(15), budget: 50000, status: 'Active', leadsGenerated: 12, opportunitiesGenerated: 2, customersGenerated: 0, revenueGenerated: 0, notes: 'بيانات تجريبية: تفاعل جيد حتى الآن.' }
];

export const demoContent: Content[] = [
  { id: 'cnt1', title: 'فيديو تشويقي: كيف تتابع أداء ابنك؟', platform: 'Instagram', contentType: 'Reel', campaignId: 'camp1', segmentId: 'seg1', publishDate: daysAgo(5), status: 'Published', cta: 'حمل التطبيق الآن', result: '1500 مشاهدة، 4 Leads', notes: 'بيانات تجريبية' },
  { id: 'cnt2', title: 'مقال: أهمية الرياضة في المدارس', platform: 'LinkedIn', contentType: 'Article', campaignId: 'camp1', segmentId: 'seg1', publishDate: daysAhead(2), status: 'Approved', cta: 'تواصل معنا لتجربة المنصة', result: '', notes: 'بيانات تجريبية' }
];

export const demoPartnerships: Partnership[] = [
  { id: 'part1', name: 'اتحاد الرياضة المدرسية', organization: 'الاتحاد الوطني', type: 'Association', contactPerson: 'السيد مراد', status: 'Discussion', objective: 'اعتماد المنصة رسمياً في المدارس الحكومية.', potentialValue: 5000000, owner: 'المؤسس', nextAction: 'تحضير العرض الفني', notes: 'بيانات تجريبية: شراكة استراتيجية طويلة الأمد.', createdAt: daysAgo(20), updatedAt: daysAgo(3) }
];

export const demoRevenue: Revenue[] = [
  { id: 'rev1', customerId: 'cust1', opportunityId: '', offerId: 'off1', type: 'One-Time', amount: 250000, date: daysAgo(100), status: 'Won', source: 'Bank Transfer', notes: 'بيانات تجريبية: الدفعة السنوية الأولى.' },
  { id: 'rev2', customerId: '', opportunityId: 'opp1', offerId: 'off1', type: 'Recurring', amount: 250000, date: daysAhead(105), status: 'Expected', source: 'Contract', notes: 'بيانات تجريبية: الإيراد المتوقع بعد انتهاء التجربة بنجاح.' }
];
