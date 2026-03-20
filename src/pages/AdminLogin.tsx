import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginSchema } from '../schemas';
import { z } from 'zod';

export const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      loginSchema.parse({ email, password });

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        setError(t('cm_page.access_denied'));
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || t('login_page.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 flex items-center justify-center py-12 md:py-20 px-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8 md:mb-10">
          <Link to="/" className="inline-flex flex-col items-center mb-6">
            <img 
              src="https://res.cloudinary.com/dnpgvhq2t/image/upload/v1773972011/logaft_djawlr.jpg" 
              alt="Logo" 
              className="h-16 md:h-20 w-auto object-contain mb-2"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-aftras-blue-text">AFTRAS</span>
              <span className="text-xl md:text-2xl font-bold text-aftras-orange ml-1">CI</span>
            </div>
            <div className="flex items-center mt-2 px-3 py-1 bg-red-50 rounded-full">
              <ShieldCheck className="w-3 h-3 text-red-600 mr-1" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('admin_login_page.title')}</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">{t('admin_login_page.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center text-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_login_page.form.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="admin@aftras.ci"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_login_page.form.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" /> {t('admin_login_page.form.submit')}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-aftras-blue-text transition-colors">
            ← Retour au portail entreprise
          </Link>
        </div>
      </div>
    </div>
  );
};
