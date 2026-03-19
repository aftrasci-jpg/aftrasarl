import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { SEO } from '../components/SEO';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={t('forgot_password_page.title')} 
        description={t('forgot_password_page.subtitle')} 
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t('forgot_password_page.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('forgot_password_page.subtitle')}
            </p>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('forgot_password_page.success_title')}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {t('forgot_password_page.success_desc')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('forgot_password_page.back_to_login')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('forgot_password_page.email_label')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="email@entreprise.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? t('common.loading') : t('forgot_password_page.submit')}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('forgot_password_page.back_to_login')}
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
