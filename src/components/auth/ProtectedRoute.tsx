import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// ============================================================
// ProtectedRoute — Demo mode only.
// Entry is allowed ONLY if a role was selected from RoleSelector.
// No Supabase auth required.
// ============================================================

export const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    // Check if a role has been selected from RoleSelector
    const demoRole = localStorage.getItem('haraka_demo_role');
    const demoMember = localStorage.getItem('haraka_demo_member');

    if (demoRole && demoMember) {
      setCanEnter(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-white font-black text-xl">H</span>
          </div>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // No role selected → go to role selector
  if (!canEnter) {
    return <Navigate to="/select-role" replace />;
  }

  return <Outlet />;
};
