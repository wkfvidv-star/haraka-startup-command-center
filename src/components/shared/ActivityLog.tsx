import React, { useEffect, useState } from 'react';
import { activityService, ActivityHistory } from '../../services/activityService';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityLog({ entityType, entityId }: { entityType: string, entityId: string }) {
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entityId) return;
    activityService.getActivities(entityType, entityId)
      .then(data => setActivities(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [entityId, entityType]);

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-slate-500 w-4 h-4" /></div>;

  if (activities.length === 0) return <div className="text-xs text-slate-500 text-center py-2">لا توجد نشاطات مسجلة بعد.</div>;

  return (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium text-slate-300">سجل النشاطات</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {activities.map(act => (
          <div key={act.id} className="flex gap-2 items-start text-xs border-l-2 border-slate-700 pl-2 ml-1">
            <div className="flex-1 space-y-1">
              <p className="text-slate-300">
                <span className="font-semibold text-primary">{act.user?.full_name || 'مستخدم'}</span>
                {' '} - {act.message || act.action_type}
              </p>
              <p className="text-[10px] text-slate-500">{format(new Date(act.created_at), 'yyyy/MM/dd HH:mm')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
