import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LOI, STATUS_COLORS } from '../types';
import { Plus, ChevronDown, ChevronUp, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [lois, setLois] = useState<LOI[]>([]);
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATUS_LABELS: Record<string, string> = {
    searching: t('dashboard.status.searching'),
    negotiating: t('dashboard.status.negotiating'),
    finalized: t('dashboard.status.finalized'),
    cancelled: t('dashboard.status.cancelled')
  };

  useEffect(() => {
    if (!user) return;

    const fetchLois = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('lois')
          .select('*')
          .eq('company_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setLois(data as LOI[]);
        setError(null);
      } catch (err: any) {
        console.error("LOI fetch error:", err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchLois();

    // Subscribe to changes
    const subscription = supabase
      .channel('lois_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lois',
        filter: `company_id=eq.${user.id}`
      }, () => {
        fetchLois();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedLoiId(expandedLoiId === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <SEO 
        title="Tableau de Bord | AFTRAS CI"
        description="Gérez vos demandes de sourcing (LOI), suivez l'état de vos dossiers et recevez des offres personnalisées de nos experts en négoce international."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-aftras-blue-border">{t('dashboard.title')}</h1>
            <p className="text-gray-600 mt-1">{t('dashboard.welcome')}, {profile?.company_name}</p>
          </div>
          <Link 
            to="/loi" 
            className="flex items-center bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-aftras-orange/20"
          >
            <Plus className="w-5 h-5 mr-2" /> {t('dashboard.new_loi')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.total')}</p>
            <p className="text-3xl font-bold text-aftras-blue-text mt-2">{lois.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.ongoing')}</p>
            <p className="text-3xl font-bold text-aftras-orange mt-2">
              {lois.filter(l => l.status !== 'finalized').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.finalized')}</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {lois.filter(l => l.status === 'finalized').length}
            </p>
          </div>
        </div>

        {/* LOI List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-aftras-blue-border mb-6">{t('dashboard.my_lois')}</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aftras-blue-text" />
            </div>
          ) : lois.length > 0 ? (
            lois.map((loi) => (
              <div key={loi.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Badge Header */}
                <div 
                  onClick={() => toggleExpand(loi.id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <FileText className="w-6 h-6 text-aftras-blue-text" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{loi.product}</h3>
                      <p className="text-sm text-gray-500">{t('dashboard.loi_card.quantity')}: {loi.quantity} • {new Date(loi.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[loi.status]}`}>
                      {STATUS_LABELS[loi.status]}
                    </span>
                    {expandedLoiId === loi.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Details (Collapsible) */}
                <AnimatePresence>
                  {expandedLoiId === loi.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-8 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t('loi_form.form.budget_label')}</p>
                            <p className="text-gray-900 font-medium">{loi.budget || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t('loi_form.form.incoterm_label')}</p>
                            <p className="text-gray-900 font-medium">{loi.incoterm || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t('loi_form.form.port_label')}</p>
                            <p className="text-gray-900 font-medium">{loi.port || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t('loi_form.form.deadline_label')}</p>
                            <p className="text-gray-900 font-medium">{loi.deadline || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t('loi_form.sections.additional')}</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{loi.additional_info || t('dashboard.loi_card.no_additional')}</p>
                          </div>
                        </div>

                        {/* Admin Response */}
                        {loi.admin_response ? (
                          <div className="space-y-6">
                            {/* Latest Response */}
                            <div className="bg-aftras-blue-text text-white rounded-2xl p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CheckCircle2 className="w-32 h-32" />
                              </div>
                              <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                                    <AlertCircle className="w-6 h-6 text-white" />
                                  </div>
                                  <h4 className="text-xl font-bold">{t('dashboard.admin_response.title')}</h4>
                                </div>
                                {(() => {
                                  const latest = Array.isArray(loi.admin_response) 
                                    ? loi.admin_response[loi.admin_response.length - 1] 
                                    : loi.admin_response;
                                  
                                  return (
                                    <>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                          <p className="text-blue-200 text-xs font-bold uppercase mb-1">{t('dashboard.admin_response.proposed_quantity')}</p>
                                          <p className="font-bold">{latest.proposed_quantity}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-xs font-bold uppercase mb-1">{t('dashboard.admin_response.proposed_price')}</p>
                                          <p className="font-bold">{latest.price}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-xs font-bold uppercase mb-1">{t('dashboard.admin_response.incoterm_location')}</p>
                                          <p className="font-bold">{latest.incoterm} - {latest.location}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-xs font-bold uppercase mb-1">{t('dashboard.admin_response.delivery_time')}</p>
                                          <p className="font-bold">{latest.delivery_time} {t('dashboard.admin_response.days')}</p>
                                        </div>
                                      </div>
                                      <p className="text-blue-100 text-[10px] mt-6 text-right italic">
                                        {t('dashboard.admin_response.last_update')} {new Date(latest.updated_at).toLocaleString()}
                                      </p>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* History (if multiple responses) */}
                            {Array.isArray(loi.admin_response) && loi.admin_response.length > 1 && (
                              <div className="mt-8">
                                <h4 className="text-sm font-bold text-aftras-blue-border mb-4 uppercase tracking-widest">Historique des offres précédentes</h4>
                                <div className="space-y-3">
                                  {loi.admin_response.slice(0, -1).reverse().map((resp: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center text-sm shadow-sm">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                        <div>
                                          <p className="text-gray-400 text-[10px] uppercase font-bold">Quantité</p>
                                          <p className="font-medium text-gray-700">{resp.proposed_quantity}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[10px] uppercase font-bold">Prix</p>
                                          <p className="font-medium text-gray-700">{resp.price}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[10px] uppercase font-bold">Incoterm</p>
                                          <p className="font-medium text-gray-700">{resp.incoterm}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[10px] uppercase font-bold">Délai</p>
                                          <p className="font-medium text-gray-700">{resp.delivery_time}</p>
                                        </div>
                                      </div>
                                      <div className="text-right ml-4">
                                        <p className="text-[10px] text-gray-400">{new Date(resp.updated_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">{t('dashboard.admin_response.waiting')}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.no_lois.title')}</h3>
              <p className="text-gray-500 mb-8">{t('dashboard.no_lois.desc')}</p>
              <Link to="/loi" className="bg-aftras-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                {t('dashboard.no_lois.cta')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
