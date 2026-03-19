import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { FileText, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { loiSchema } from '../schemas';
import { z } from 'zod';

export const LOIForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [formData, setFormData] = useState({
    product: location.state?.product || '',
    quantity: '',
    budget: '',
    incoterm: 'CIF',
    port: '',
    deadline: '',
    additional_info: '',
    serious: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || !profile) return;
    if (!formData.serious) {
      setError(t('loi_form.error_serious'));
      return;
    }

    setLoading(true);
    try {
      // Validate with Zod
      loiSchema.parse({
        productName: formData.product,
        quantity: formData.quantity,
        specifications: formData.additional_info || 'Demande de sourcing standard',
        targetPrice: formData.budget,
        destination: formData.port || 'À définir',
      });

      const { error: submitError } = await supabase
        .from('lois')
        .insert({
          company_id: user.id,
          company_name: profile.company_name,
          product: formData.product,
          quantity: formData.quantity,
          budget: formData.budget,
          incoterm: formData.incoterm,
          port: formData.port,
          deadline: formData.deadline,
          additional_info: formData.additional_info,
          status: 'searching'
        });

      if (submitError) throw submitError;

      // Send notifications to all admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          title: t('notifications.loi_created.title'),
          message: t('notifications.loi_created.message', { 
            company: profile.company_name, 
            product: formData.product 
          }),
          type: 'loi_created',
          link: '/admin'
        }));

        await supabase.from('notifications').insert(notifications);
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err: any) {
      console.error("LOI submission error:", err);
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(t('loi_form.error_generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-aftras-blue-border mb-4">{t('loi_form.success_title')}</h2>
          <p className="text-gray-600 mb-8">{t('loi_form.success_desc')}</p>
          <p className="text-sm text-aftras-blue-text font-medium">{t('loi_form.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <SEO 
        title="Soumettre une LOI | AFTRAS CI"
        description="Soumettez votre lettre d'intention (LOI) pour un sourcing de produit spécifique. Notre équipe vous accompagnera dans la recherche des meilleurs fournisseurs."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-aftras-blue-text p-10 text-white">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 mr-4" />
              <h1 className="text-3xl font-bold">{t('loi_form.title')}</h1>
            </div>
            <p className="text-blue-100">{t('loi_form.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Section 1: Produit */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">{t('loi_form.sections.product')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.product_label')}</label>
                  <input
                    required
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder={t('loi_form.form.product_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.quantity_label')}</label>
                  <input
                    required
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder={t('loi_form.form.quantity_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Commercial */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">{t('loi_form.sections.commercial')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.budget_label')}</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder={t('loi_form.form.budget_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.incoterm_label')}</label>
                  <select
                    value={formData.incoterm}
                    onChange={(e) => setFormData({...formData, incoterm: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  >
                    <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.port_label')}</label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: e.target.value})}
                    placeholder={t('loi_form.form.port_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('loi_form.form.deadline_label')}</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    placeholder={t('loi_form.form.deadline_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Autres */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">{t('loi_form.sections.additional')}</h3>
              <div>
                <textarea
                  rows={4}
                  value={formData.additional_info}
                  onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                  placeholder={t('loi_form.form.additional_placeholder')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                />
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <label className="flex items-start cursor-pointer">
                <input
                  required
                  type="checkbox"
                  checked={formData.serious}
                  onChange={(e) => setFormData({...formData, serious: e.target.checked})}
                  className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-orange-900 leading-relaxed">
                  {t('loi_form.form.declaration')}
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg shadow-aftras-orange/20"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" /> {t('loi_form.form.submit')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
