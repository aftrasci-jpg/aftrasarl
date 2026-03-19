import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { SEO } from '../components/SEO';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a session (Supabase automatically handles the hash in the URL)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, the link might be invalid or expired
        // But we'll let the update attempt fail if it's the case
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('register_page.error_password'));
      return;
    }

    if (password.length < 6) {
      setError(t('register_page.form.password_placeholder'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setSuccess(true);
      
      // Redirect to login after a few seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={t('reset_password_page.title')} 
        description={t('reset_password_page.subtitle')} 
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t('reset_password_page.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('reset_password_page.subtitle')}
            </p>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('reset_password_page.success_title')}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {t('reset_password_page.success_desc')}
              </p>
              <p className="text-xs text-gray-500">
                {t('loi_form.redirecting')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('reset_password_page.new_password')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  {t('reset_password_page.confirm_password')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? t('common.loading') : t('reset_password_page.submit')}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
