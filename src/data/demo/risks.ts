import { Risk } from '../../types/risk';

export const demoRisks: Risk[] = [
  { id: 'r1', title: 'الامتثال لخصوصية البيانات', description: 'بيانات تجريبية: التعامل مع بيانات الطلاب يتطلب امتثالاً صارماً للقوانين المحلية.', category: 'Legal', probability: 'High', impact: 'High', severity: 'Critical', owner: 'المستشار القانوني', mitigation: 'صياغة سياسة خصوصية قوية وضمان الاستضافة محلياً إذا لزم الأمر.', status: 'Open', dueDate: '2026-10-15T00:00:00.000Z' },
  { id: 'r2', title: 'تأخير من جانب مدارس التجربة', description: 'بيانات تجريبية: قد تؤجل المدارس توقيع الاتفاقية بسبب الإجراءات الإدارية.', category: 'Customer/Pilot', probability: 'Medium', impact: 'High', severity: 'High', owner: 'المدير التنفيذي', mitigation: 'التواصل مع 3 مدارس محتملة في وقت واحد لضمان تأمين مدرسة واحدة على الأقل.', status: 'Open', dueDate: '2026-11-01T00:00:00.000Z' },
  { id: 'r3', title: 'تكاليف معالجة الفيديو', description: 'بيانات تجريبية: إذا رفع الطلاب فيديوهات كثيرة، سترتفع تكاليف الخادم.', category: 'Technical', probability: 'Medium', impact: 'Medium', severity: 'Medium', owner: 'المدير التقني', mitigation: 'تطبيق ضغط صارم للفيديوهات وتقييد مدتها.', status: 'Mitigated', dueDate: '2026-09-30T00:00:00.000Z' },
];
