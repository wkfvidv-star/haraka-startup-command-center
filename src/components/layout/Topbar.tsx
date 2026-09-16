import { useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useAppStore } from '../../store';

const pageTitles: Record<string, string> = {
  '/':         'Founder Dashboard',
  '/today':    'Today — Priority View',
  '/status':   'Company Status',
  '/roadmap':  'Startup Roadmap',
  '/tasks':    'Task Management',
  '/projects': 'Projects',
};

export function Topbar() {
  const { pathname } = useLocation();
  const { tasks, config, setMobileMenuOpen } = useAppStore();

  const overdueCount = tasks.filter(
    (t) => t.status !== 'مكتملة' && new Date(t.deadline) < new Date()
  ).length;

  const title = pageTitles[pathname] ?? 'HARAKA';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Mobile only) */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Page title */}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {config && (
          <span className="hidden sm:inline text-xs text-muted-foreground">
            Stage:{' '}
            <span className="font-semibold text-primary">{config.currentStage}</span>
          </span>
        )}

        {/* Alerts */}
        <div className="relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {overdueCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {overdueCount}
            </span>
          )}
        </div>

        {/* Demo badge */}
        <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
          Demo
        </span>
      </div>
    </header>
  );
}
