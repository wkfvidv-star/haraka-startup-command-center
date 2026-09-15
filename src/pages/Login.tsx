import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { Rocket, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const init = useAppStore(state => state.init);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!supabase) throw new Error('تعذّر الاتصال بقاعدة البيانات.');
      
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          await init();
          navigate('/');
        } else {
          setMessage('تم إنشاء الحساب بنجاح! إذا كان تأكيد البريد مفعلًا، يُرجى مراجعة صندوق الوارد.');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة. إذا لم تكن تملك حساباً، اختر "حساب جديد".');
          }
          throw signInError;
        }

        if (data.session) {
          await init();
          navigate('/');
        }
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('rate limit')) {
        setError('تم تجاوز الحد الأقصى لإرسال رسائل التأكيد مؤقتاً من Supabase. يرجى الانتظار دقائق قليلة، أو جرب الانتقال لتبويب "تسجيل الدخول" إن كان الحساب قد أُنشئ.');
      } else {
        setError(errMsg || 'حدث خطأ أثناء المصادقة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white dir-rtl">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-blue-950/30">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white mb-4 shadow-lg shadow-blue-500/25">
              <Rocket className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              HARAKA Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              مركز تسيير عمليات شركة HARAKA
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@haraka.app"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  دخول
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  إنشاء حساب جديد
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
