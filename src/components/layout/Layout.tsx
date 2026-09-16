import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '../../store';
import { UserGuide } from '../workspace/UserGuide';

export function Layout() {
  const init = useAppStore((s) => s.init);
  const error = useAppStore((s) => s.error);
  const isMobileMenuOpen = useAppStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);

  useEffect(() => { init(); }, [init]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative">
      <UserGuide />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden w-full h-full">
        <Topbar />
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 text-xs text-red-700">
            Error: {error}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
