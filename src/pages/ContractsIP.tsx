import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Scroll, Shield, Plus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { ContractStatus, IPProtectionStatus } from '../types/governance';

export function ContractsIP() {
  const { contracts, ipAssets, deleteContract, deleteIPAsset } = useAppStore();

  const getContractColor = (s: ContractStatus) => {
    switch (s) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getIPColor = (s: IPProtectionStatus) => {
    switch (s) {
      case 'Protected': return 'bg-green-100 text-green-800';
      case 'Not Protected': return 'bg-red-100 text-red-800';
      case 'Review Required': return 'bg-orange-100 text-orange-800';
      case 'In Process': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">العقود والملكية الفكرية (Contracts & IP)</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة العقود وتتبع حماية الأصول الفكرية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contracts */}
        <Card>
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Scroll className="h-4 w-4 text-primary" /> العقود (DEMO DATA)
            </CardTitle>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" /> إضافة</Button>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {contracts.map(c => (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
                        <Badge variant="outline" className={`text-[10px] ${getContractColor(c.status)} border-none`}>{c.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">الطرف الآخر: {c.counterparty}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-red-600" onClick={() => deleteContract(c.id)}>
                      ×
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>النوع: {c.type}</span>
                    <span className={c.status === 'Expired' || c.status === 'Expiring' ? 'text-red-600 font-bold' : ''}>
                      الانتهاء: {format(new Date(c.endDate), 'dd MMM yyyy', { locale: ar })}
                    </span>
                  </div>
                </div>
              ))}
              {contracts.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">لا توجد عقود.</div>}
            </div>
          </CardContent>
        </Card>

        {/* IP Assets */}
        <Card>
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> الملكية الفكرية (DEMO DATA)
            </CardTitle>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" /> إضافة</Button>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {ipAssets.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-sm">{a.name}</h3>
                        <Badge variant="outline" className={`text-[10px] ${getIPColor(a.protectionStatus)} border-none`}>{a.protectionStatus}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">{a.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-red-600" onClick={() => deleteIPAsset(a.id)}>
                      ×
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>النوع: {a.type}</span>
                    {a.reviewDate && (
                      <span className={a.protectionStatus === 'Review Required' ? 'text-orange-600 font-bold' : ''}>
                        المراجعة: {format(new Date(a.reviewDate), 'dd MMM yyyy', { locale: ar })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {ipAssets.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">لا توجد أصول ملكية فكرية.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
