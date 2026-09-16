import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    const check = async () => {
      // DEMO MODE: if a role was selected from RoleSelector, allow entry
      const demoRole = localStorage.getItem('haraka_demo_role');
      if (demoRole) {
        setCanEnter(true);
        setLoading(false);
        return;
      }

      // SUPABASE AUTH: fallback for real auth
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCanEnter(true);
      }
      setLoading(false);
    };

    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!canEnter) {
    return <Navigate to="/select-role" replace />;
  }

  return <Outlet />;
};
