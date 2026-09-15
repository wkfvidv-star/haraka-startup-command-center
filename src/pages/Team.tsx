import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Plus, Edit2, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import { useAppStore } from '../store';
import { Badge } from '../components/ui/badge';

export function Team() {
  const { teamMembers } = useAppStore();

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">فريق العمل</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة بيانات أفراد الفريق والأدوار</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> عضو جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamMembers.map(m => (
          <Card key={m.id} className="overflow-hidden">
            <div className={`h-12 w-full ${m.status === 'Active' ? 'bg-primary/10' : 'bg-slate-100'}`}></div>
            <CardContent className="px-5 pb-5 pt-0 relative text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full border-4 border-white shadow-sm -mt-8 flex items-center justify-center text-primary text-xl font-bold overflow-hidden">
                {m.name.charAt(0)}
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mt-2">{m.name}</h3>
              <p className="text-xs text-primary font-medium mt-0.5">{m.role}</p>
              
              <div className="flex justify-center mt-2">
                <Badge variant={m.status === 'Active' ? 'success' : m.status === 'External' ? 'warning' : 'secondary'} className="text-[10px]">
                  {m.status === 'Active' ? 'نشط' : m.status === 'External' ? 'خارجي' : 'مغادر'}
                </Badge>
              </div>
              
              <div className="space-y-2 mt-4 text-xs text-slate-600 text-right bg-slate-50 p-3 rounded text-right border border-slate-100">
                <p className="flex items-center gap-2 justify-start"><Briefcase className="h-3.5 w-3.5 text-slate-400" /> قسم: {m.department}</p>
                <p className="flex items-center gap-2 justify-start"><Mail className="h-3.5 w-3.5 text-slate-400" /> {m.email}</p>
                <p className="flex items-center gap-2 justify-start"><Phone className="h-3.5 w-3.5 text-slate-400" /> {m.phone}</p>
              </div>

              <div className="flex justify-center gap-3 mt-4 pt-4 border-t text-slate-400">
                <button className="hover:text-primary transition-colors"><Edit2 className="h-4 w-4" /></button>
                <button className="hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
