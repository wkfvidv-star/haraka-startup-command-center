import { useAppStore } from '../store';
import { Card, CardContent } from '../components/ui/card';
import { Target, TrendingUp, Users, ShieldAlert, BadgeDollarSign, Activity } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function MarketKPIs() {
  const { marketKPIs, leads, opportunities, pilots, customers, revenues } = useAppStore();
  
  if (!marketKPIs) {
    return <div className="p-8 text-center text-muted-foreground">جاري تحميل المؤشرات...</div>;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">مؤشرات السوق والمبيعات (Market KPIs)</h1>
        <p className="text-sm text-muted-foreground">مراقبة الأداء العام للمبيعات، التسويق، وصحة السوق.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Activity className="h-5 w-5" /> 
              <span className="font-semibold">صحة السوق (Market Health)</span>
            </div>
            <div className="flex items-end gap-2">
              <p className={`text-4xl font-bold ${marketKPIs.marketHealthScore >= 80 ? 'text-green-600' : marketKPIs.marketHealthScore >= 50 ? 'text-amber-500' : 'text-red-600'}`}>
                {marketKPIs.marketHealthScore}
              </p>
              <span className="text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress 
              value={marketKPIs.marketHealthScore} 
              className="mt-3" 
              colorOverride={marketKPIs.marketHealthScore >= 80 ? 'bg-green-500' : marketKPIs.marketHealthScore >= 50 ? 'bg-amber-400' : 'bg-red-500'} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-5 w-5" /> 
              <span className="font-semibold text-sm">معدل تحويل العملاء (Leads)</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{marketKPIs.leadConversionRate.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{leads.filter(l => l.status === 'Converted').length} محول من أصل {leads.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-5 w-5" /> 
              <span className="font-semibold text-sm">معدل إغلاق الصفقات (Win Rate)</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{marketKPIs.opportunityWinRate.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{opportunities.filter(o => o.stage === 'Won').length} رابح من أصل {opportunities.filter(o => o.stage === 'Won' || o.stage === 'Lost').length} مغلق</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ShieldAlert className="h-5 w-5" /> 
              <span className="font-semibold text-sm">نجاح التجارب (Pilot Success)</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{marketKPIs.pilotConversionRate.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{pilots.filter(p => p.status === 'Converted').length} محول من أصل {pilots.filter(p => p.status === 'Completed' || p.status === 'Failed' || p.status === 'Converted').length} منتهي</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <TrendingUp className="h-5 w-5" /> 
              <span className="font-semibold">توقعات المبيعات (Pipeline)</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">القيمة الإجمالية للفرص المفتوحة</span>
                  <span className="font-bold">{formatCurrency(marketKPIs.pipelineValue)}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">القيمة المرجحة (Weighted)</span>
                  <span className="font-bold text-green-600">{formatCurrency(marketKPIs.weightedPipeline)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">مبنية على احتمالية الإغلاق لكل فرصة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <BadgeDollarSign className="h-5 w-5" /> 
              <span className="font-semibold">المالية والمداخيل</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">متوسط قيمة الصفقة</p>
                  <p className="text-lg font-bold">{formatCurrency(marketKPIs.averageDealValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">إجمالي الإيرادات المحصلة</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(marketKPIs.wonRevenue)}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground uppercase mb-1">إيرادات متوقعة قيد التحصيل</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(marketKPIs.expectedRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
