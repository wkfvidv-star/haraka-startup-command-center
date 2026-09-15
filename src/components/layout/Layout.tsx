import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '../../store';

export function Layout() {
  const init = useAppStore((s) => s.init);
  const error = useAppStore((s) => s.error);

  useEffect(() => { init(); }, [init]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar />
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 text-xs text-red-700">
            Error: {error}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
