import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Building2, User, Mail, Lock, Globe, Phone, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { registerSchema } from '../schemas';
import { z } from 'zod';

export const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    address: '',
    website: '',
    representativeName: '',
    position: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('register_page.error_password'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Validate with Zod
      registerSchema.parse({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        phone: formData.phone,
      });

      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (authError) throw authError;
      if (!user) throw new Error('Signup failed');

      // Profile is created by trigger, but we update the extra fields
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.companyName,
          country: formData.country,
          address: formData.address,
          website: formData.website,
          representative_name: formData.representativeName,
          position: formData.position,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || t('register_page.error_generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center mb-6">
            <img 
              src="https://res.cloudinary.com/dnpgvhq2t/image/upload/v1773972011/logaft_djawlr.jpg" 
              alt="Logo" 
              className="h-24 w-auto object-contain mb-2"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center">
              <span className="text-3xl font-bold text-aftras-blue-text">AFTRAS</span>
              <span className="text-3xl font-bold text-aftras-orange ml-1">CI</span>
            </div>
            <span className="text-xs font-medium text-gray-500 mt-1 tracking-wider uppercase">
              {t('common.slogan')}
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('register_page.title')}</h1>
          <p className="text-gray-500 mt-2">{t('register_page.subtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleRegister} className="p-10 space-y-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Section: Entreprise */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border flex items-center border-b pb-2">
                <Building2 className="w-5 h-5 mr-2" /> {t('register_page.sections.company')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.company_name')}</label>
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.country')}</label>
                  <input
                    required
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.address')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.website')}</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Représentant */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border flex items-center border-b pb-2">
                <User className="w-5 h-5 mr-2" /> {t('register_page.sections.representative')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.rep_name')}</label>
                  <input
                    required
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({...formData, representativeName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.position')}</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Sécurité */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border flex items-center border-b pb-2">
                <Lock className="w-5 h-5 mr-2" /> {t('register_page.sections.security')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.password')}</label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                    placeholder={t('register_page.form.password_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('register_page.form.confirm_password')}</label>
                  <input
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-aftras-orange text-white py-5 rounded-2xl font-bold text-xl hover:bg-opacity-90 transition-all shadow-xl shadow-aftras-orange/20"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto" />
              ) : (
                t('register_page.form.submit')
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-600">
          {t('register_page.has_account')}{' '}
          <Link to="/login" className="text-aftras-blue-text font-bold hover:underline">
            {t('register_page.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};
