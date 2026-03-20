import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LOI, Product, STATUS_COLORS, LOIStatus, PRODUCT_CATEGORIES, ProductCategory } from '../types';
import { Plus, Trash2, Edit, CheckCircle2, X, Package, FileText, Send, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { productSchema } from '../schemas';
import { z } from 'zod';

export const Admin = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [lois, setLois] = useState<LOI[]>([]);
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STATUS_LABELS: Record<string, string> = {
    searching: t('dashboard.status.searching'),
    negotiating: t('dashboard.status.negotiating'),
    finalized: t('dashboard.status.finalized'),
    cancelled: t('dashboard.status.cancelled')
  };

  const [responseForm, setResponseForm] = useState({
    proposed_quantity: '',
    incoterm: 'CIF',
    location: '',
    price: '',
    delivery_time: '',
    status: 'searching' as LOIStatus
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchLois = async () => {
      const { data, error: fetchError } = await supabase
        .from('lois')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error("Admin LOI fetch error:", fetchError);
        setError(t('common.error'));
      } else {
        setLois(data as LOI[]);
        setError(null);
      }
    };

    fetchLois();

    const loisSub = supabase.channel('admin_lois').on('postgres_changes', { event: '*', schema: 'public', table: 'lois' }, fetchLois).subscribe();

    return () => {
      loisSub.unsubscribe();
    };
  }, [isAdmin]);

  const handleLoiResponse = async (loi: LOI) => {
    try {
      const newResponse = {
        proposed_quantity: responseForm.proposed_quantity,
        incoterm: responseForm.incoterm,
        location: responseForm.location,
        price: responseForm.price,
        delivery_time: responseForm.delivery_time,
        updated_at: new Date().toISOString()
      };

      let updatedResponses: any[] = [];
      if (Array.isArray(loi.admin_response)) {
        updatedResponses = [...loi.admin_response, newResponse];
      } else if (loi.admin_response) {
        updatedResponses = [loi.admin_response, newResponse];
      } else {
        updatedResponses = [newResponse];
      }

      const { error: responseError } = await supabase
        .from('lois')
        .update({
          status: responseForm.status,
          admin_response: updatedResponses
        })
        .eq('id', loi.id);
      
      if (responseError) throw responseError;

      // Send notification to the company
      await supabase.from('notifications').insert({
        user_id: loi.company_id,
        title: t('notifications.loi_updated.title'),
        message: t('notifications.loi_updated.message', { product: loi.product }),
        type: 'loi_updated',
        link: '/dashboard'
      });

      setExpandedLoiId(null);
    } catch (error) {
      console.error("LOI response error:", error);
    }
  };

  if (!isAdmin) return <div className="p-20 text-center">{t('admin_page.access_denied')}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <SEO 
        title={t('admin_page.title')} 
        description="Administration AFTRAS CI - Gestion des LOI."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-aftras-blue-border mb-12">{t('admin_page.title')}</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8">
            {error}
          </div>
        )}

        {/* LOI Management */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-aftras-blue-border mb-6">{t('admin_page.tabs.lois')} ({lois.length})</h2>
          {lois.map((loi) => (
            <div key={loi.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                onClick={() => {
                  setExpandedLoiId(expandedLoiId === loi.id ? null : loi.id);
                  const latestResponse = Array.isArray(loi.admin_response) 
                    ? loi.admin_response[loi.admin_response.length - 1] 
                    : loi.admin_response;

                  if (latestResponse) {
                    setResponseForm({
                      proposed_quantity: latestResponse.proposed_quantity,
                      incoterm: latestResponse.incoterm as any,
                      location: latestResponse.location,
                      price: latestResponse.price,
                      delivery_time: latestResponse.delivery_time,
                      status: loi.status
                    });
                  } else {
                    setResponseForm({ ...responseForm, status: loi.status });
                  }
                }}
                className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <FileText className="w-6 h-6 text-aftras-blue-text" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{loi.company_name}</h3>
                    <p className="text-sm text-gray-500">{loi.product} • {loi.quantity}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[loi.status]}`}>
                  {STATUS_LABELS[loi.status]}
                </span>
              </div>

              <AnimatePresence>
                {expandedLoiId === loi.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-gray-100 bg-gray-50/50 p-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Details */}
                      <div>
                        <h4 className="font-bold text-aftras-blue-border mb-4 uppercase text-xs tracking-widest">{t('admin_page.lois.details_title')}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <p className="text-gray-500">{t('loi_form.form.budget_label')}:</p><p className="font-medium">{loi.budget || 'N/A'}</p>
                          <p className="text-gray-500">{t('loi_form.form.incoterm_label')}:</p><p className="font-medium">{loi.incoterm || 'N/A'}</p>
                          <p className="text-gray-500">{t('loi_form.form.port_label')}:</p><p className="font-medium">{loi.port || 'N/A'}</p>
                          <p className="text-gray-500">{t('loi_form.form.deadline_label')}:</p><p className="font-medium">{loi.deadline || 'N/A'}</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-500 text-sm mb-1">{t('loi_form.sections.additional')}:</p>
                          <p className="text-gray-700 text-sm italic">{loi.additional_info || 'Aucune.'}</p>
                        </div>
                      </div>

                      {/* Response Form */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h4 className="font-bold text-aftras-blue-border mb-6 uppercase text-xs tracking-widest">{t('admin_page.lois.response_title')}</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">{t('admin_page.lois.form.status')}</label>
                              <select 
                                value={responseForm.status}
                                onChange={(e) => setResponseForm({...responseForm, status: e.target.value as LOIStatus})}
                                className="w-full p-2 border rounded-lg text-sm"
                              >
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.proposed_quantity')}</label>
                              <input 
                                type="text" 
                                value={responseForm.proposed_quantity}
                                onChange={(e) => setResponseForm({...responseForm, proposed_quantity: e.target.value})}
                                className="w-full p-2 border rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.proposed_price')}</label>
                              <input 
                                type="text" 
                                value={responseForm.price}
                                onChange={(e) => setResponseForm({...responseForm, price: e.target.value})}
                                className="w-full p-2 border rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.delivery_time')}</label>
                              <input 
                                type="text" 
                                value={responseForm.delivery_time}
                                onChange={(e) => setResponseForm({...responseForm, delivery_time: e.target.value})}
                                className="w-full p-2 border rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => handleLoiResponse(loi)}
                            className="w-full bg-aftras-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center"
                          >
                            <Send className="w-4 h-4 mr-2" /> {t('admin_page.lois.form.submit')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* History Section */}
                    {Array.isArray(loi.admin_response) && loi.admin_response.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="font-bold text-aftras-blue-border mb-6 uppercase text-xs tracking-widest">Historique des Réponses</h4>
                        <div className="space-y-4">
                          {loi.admin_response.slice().reverse().map((resp: any, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                <div>
                                  <p className="text-gray-400 text-[10px] uppercase font-bold">Quantité</p>
                                  <p className="font-medium">{resp.proposed_quantity}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-[10px] uppercase font-bold">Prix</p>
                                  <p className="font-medium">{resp.price}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-[10px] uppercase font-bold">Incoterm</p>
                                  <p className="font-medium">{resp.incoterm} - {resp.location}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-[10px] uppercase font-bold">Délai</p>
                                  <p className="font-medium">{resp.delivery_time}</p>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-[10px] text-gray-400">{new Date(resp.updated_at).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
