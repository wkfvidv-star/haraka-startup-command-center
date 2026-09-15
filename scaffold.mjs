import fs from 'fs';
import path from 'path';

const pages = [
  { name: 'MarketIntelligence', title: 'قطاعات السوق' },
  { name: 'Leads', title: 'العملاء المحتملين' },
  { name: 'Pipeline', title: 'المبيعات' },
  { name: 'Pilots', title: 'التجارب التشغيلية' },
  { name: 'Customers', title: 'العملاء' },
  { name: 'Offers', title: 'العروض' },
  { name: 'Marketing', title: 'الحملات التسويقية' },
  { name: 'Content', title: 'المحتوى' },
  { name: 'Partnerships', title: 'الشراكات' },
  { name: 'Revenue', title: 'الإيرادات' },
  { name: 'MarketKPIs', title: 'مؤشرات السوق' }
];

const dir = 'c:/Users/User/Desktop/HARAKA STARTUP COMMAND CENTER/src/pages';

pages.forEach(p => {
  const content = `import { useAppStore } from '../store/useAppStore';

export function ${p.name}() {
  const store = useAppStore();
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">${p.title}</h1>
        <p className="text-slate-500 mt-2">إدارة ${p.title} - المرحلة 3</p>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 text-center text-slate-500">
        قيد الإنشاء...
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${p.name}.tsx`), content);
});

console.log('Pages created successfully.');
