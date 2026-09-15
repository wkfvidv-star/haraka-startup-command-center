import { TeamMember } from '../../types/team';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();

export const demoTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'المؤسس التجريبي',
    role: 'Founder',
    department: 'Management',
    email: 'founder@demo.com',
    phone: '0555000001',
    status: 'Active',
    joinedAt: daysAgo(365),
    responsibilities: 'بيانات تجريبية: الرؤية الاستراتيجية، المنتج، والتمويل.',
    skills: 'القيادة، إدارة المنتجات',
    notes: 'بيانات تجريبية',
    createdAt: daysAgo(365),
    updatedAt: daysAgo(10)
  },
  {
    id: 'tm2',
    name: 'مسؤول التقنية (Demo CTO)',
    role: 'Technology',
    department: 'Technology',
    email: 'cto@demo.com',
    phone: '0555000002',
    status: 'Active',
    joinedAt: daysAgo(300),
    responsibilities: 'بيانات تجريبية: البنية التحتية، التطوير، والأمن.',
    skills: 'React, Node.js, Architecture',
    notes: 'بيانات تجريبية',
    createdAt: daysAgo(300),
    updatedAt: daysAgo(5)
  },
  {
    id: 'tm3',
    name: 'مسؤول المبيعات (Demo Sales)',
    role: 'Sales',
    department: 'Sales',
    email: 'sales@demo.com',
    phone: '0555000003',
    status: 'Active',
    joinedAt: daysAgo(150),
    responsibilities: 'بيانات تجريبية: إدارة الفرص البيعية، التجارب (Pilots).',
    skills: 'B2B Sales, CRM, Negotiation',
    notes: 'بيانات تجريبية',
    createdAt: daysAgo(150),
    updatedAt: daysAgo(2)
  },
  {
    id: 'tm4',
    name: 'مصمم واجهات (Demo Designer)',
    role: 'Product',
    department: 'Product',
    email: 'design@demo.com',
    phone: '0555000004',
    status: 'External',
    joinedAt: daysAgo(90),
    responsibilities: 'بيانات تجريبية: تصميم واجهات وتجربة المستخدم.',
    skills: 'Figma, UI/UX',
    notes: 'بيانات تجريبية - متعاون خارجي',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1)
  }
];
