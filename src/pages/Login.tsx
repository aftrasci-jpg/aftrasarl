import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../schemas';
import { z } from 'zod';

export const Login = () => {
  const { t } = useTranslation();
  const { profile, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect after successful login when profile loads from AuthContext
  useEffect(() => {
    if (!authLoading && !formLoading && profile && !error) {
      console.log('🔍 Login redirect - Profile loaded:', {
        role: profile.role,
        email: profile.email,
        redirectTo: profile.role === 'admin' ? '/admin' : '/dashboard'
      });

      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [profile, authLoading, formLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    
    try {
      // Validate form
      loginSchema.parse({ email, password });

      // Authenticate
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || t('login_page.error'));
        throw authError;
      }

      // Success - AuthContext will load profile and trigger useEffect redirect
      console.log('✅ Auth success - Waiting for profile from AuthContext...');
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || t('login_page.error'));
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading if auth/profile loading or redirecting
  if (authLoading || redirectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aftras-blue-text mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {redirectLoading ? 'Redirection en cours...' : 'Chargement...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-aftras-blue-text">AFTRAS</span>
              <span className="text-2xl font-bold text-orange-500 ml-1">CI</span>
            </div>
            <span className="text-[10px] font-medium text-gray-500 -mt-1 tracking-wider uppercase">
              {t('common.slogan')}
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('login_page.title')}</h1>
          <p className="text-gray-500 mt-2">{t('login_page.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center text-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('login_page.form.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                placeholder={t('login_page.form.email_placeholder')}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">{t('login_page.form.password')}</label>
              <Link to="/forgot-password" id="forgot-password-link" className="text-xs font-bold text-aftras-blue-text hover:underline">
                {t('login_page.form.forgot_password')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={formLoading}
            type="submit"
            className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg shadow-aftras-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            {formLoading ? 'Connexion...' : t('login_page.form.submit')}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm">
          {t('login_page.no_account')}{' '}
          <Link to="/register" className="text-aftras-blue-text font-bold hover:underline">
            {t('login_page.create_account')}
          </Link>
        </p>
      </div>
    </div>
  );
};
