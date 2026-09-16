import React, { useEffect, useState } from 'react';
import { notificationService, AppNotification } from '../../services/notificationService';
import { Bell, Check, CheckCircle2, Loader2, Info, Target, CheckSquare, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAppStore } from '../../store';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentMember, currentUserRole } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only load notifications if user is fully logged in via real Supabase Auth
    // Since demo mode bypasses auth, we wrap in try/catch and fail gracefully if not authed.
    let unsubscribe: any;
    
    const initNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data);

        // Sub to realtime
        const userId = await notificationService.getUserId();
        unsubscribe = notificationService.subscribeToNotifications(
          userId,
          (newNotif) => setNotifications(prev => [newNotif, ...prev]),
          (updatedNotif) => setNotifications(prev => prev.map(n => n.id === updatedNotif.id ? updatedNotif : n))
        );
      } catch (err) {
        console.warn('Real notifications disabled in Demo Mode or missing Auth', err);
      } finally {
        setLoading(false);
      }
    };

    initNotifications();

    return () => {
      if (unsubscribe && unsubscribe.unsubscribe) unsubscribe.unsubscribe();
    };
  }, [currentUserRole, currentMember]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.is_read) {
      handleMarkAsRead(notif.id);
    }
    setIsOpen(false);
    
    if (notif.entity_type === 'TASK') navigate('/tasks');
    else if (notif.entity_type === 'PROJECT') navigate('/projects');
    else if (notif.entity_type === 'LEAD') navigate('/pipeline');
  };

  const getIcon = (type: string) => {
    if (type.includes('TASK')) return <CheckSquare className="w-4 h-4 text-primary" />;
    if (type.includes('PROJECT')) return <Target className="w-4 h-4 text-emerald-400" />;
    if (type.includes('SYSTEM')) return <Settings className="w-4 h-4 text-slate-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Bell className="h-5 w-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="font-semibold text-slate-200">الإشعارات</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10" onClick={handleMarkAllAsRead}>
                  <Check className="w-3 h-3 mr-1" />
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">لا توجد إشعارات حالياً</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <div className={`p-2 rounded-full ${!notif.is_read ? 'bg-primary/20' : 'bg-slate-800'}`}>
                          {getIcon(notif.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm truncate ${!notif.is_read ? 'font-semibold text-slate-200' : 'font-medium text-slate-300'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                        {notif.message && (
                          <p className={`text-xs line-clamp-2 ${!notif.is_read ? 'text-slate-300' : 'text-slate-400'}`}>
                            {notif.message}
                          </p>
                        )}
                      </div>
                      {!notif.is_read && (
                        <div className="shrink-0 flex items-center justify-center">
                          <button 
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="p-1 rounded-full text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="تحديد كمقروء"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
