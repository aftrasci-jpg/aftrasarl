import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LOI, STATUS_COLORS } from '../types';
import { Plus, ChevronDown, ChevronUp, Clock, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
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

  const deleteLoi = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding the card when clicking delete
    
    if (!window.confirm(t('dashboard.loi_card.delete_confirm'))) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('lois')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setLois(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      console.error("Error deleting LOI:", err);
      alert(t('common.error'));
    }
  };

  const getLoiImage = (loi: LOI) => {
    if (loi.product_image) return loi.product_image;
    if (loi.additional_info?.includes('[IMAGE_URL]:')) {
      const match = loi.additional_info.match(/\[IMAGE_URL\]:\s*(https?:\/\/[^\s\n]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-12">
      <SEO 
        title="Tableau de Bord | AFTRAS CI"
        description="Gérez vos demandes de sourcing (LOI), suivez l'état de vos dossiers et recevez des offres personnalisées de nos experts en négoce international."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-aftras-blue-border">{t('dashboard.title')}</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {t('dashboard.welcome')} <span className="font-bold text-aftras-blue-text">{profile?.company_name}</span>
            </p>
          </div>
          <Link 
            to="/loi" 
            className="w-full md:w-auto flex items-center justify-center bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-aftras-orange/20"
          >
            <Plus className="w-5 h-5 mr-2" /> {t('dashboard.new_loi')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.total')}</p>
            <p className="text-2xl md:text-3xl font-bold text-aftras-blue-text mt-2">{lois.length}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.ongoing')}</p>
            <p className="text-2xl md:text-3xl font-bold text-aftras-orange mt-2">
              {lois.filter(l => l.status !== 'finalized').length}
            </p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">{t('dashboard.stats.finalized')}</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
              {lois.filter(l => l.status === 'finalized').length}
            </p>
          </div>
        </div>

        {/* LOI List */}
        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-aftras-blue-border mb-4 md:mb-6">{t('dashboard.my_lois')}</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 md:p-6 rounded-2xl border border-red-100 mb-6">
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
                  className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {getLoiImage(loi) ? (
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img 
                          src={getLoiImage(loi)!} 
                          alt={loi.product} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="p-2 md:p-3 bg-blue-50 rounded-xl">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-aftras-blue-text" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-1">{loi.product}</h3>
                      <p className="text-xs md:text-sm text-gray-500">{t('dashboard.loi_card.quantity')}: {loi.quantity} • {new Date(loi.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <span className={`px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[loi.status]}`}>
                      {STATUS_LABELS[loi.status]}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => deleteLoi(loi.id, e)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedLoiId === loi.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
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
                      <div className="p-4 md:p-8 bg-gray-50/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('loi_form.form.budget_label')}</p>
                            <p className="text-sm md:text-base text-gray-900 font-medium">{loi.budget || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('loi_form.form.incoterm_label')}</p>
                            <p className="text-sm md:text-base text-gray-900 font-medium">{loi.incoterm || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('loi_form.form.port_label')}</p>
                            <p className="text-sm md:text-base text-gray-900 font-medium">{loi.port || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('loi_form.form.deadline_label')}</p>
                            <p className="text-sm md:text-base text-gray-900 font-medium">{loi.deadline || t('dashboard.loi_card.not_specified')}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('loi_form.sections.additional')}</p>
                            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                              {loi.additional_info?.split('[IMAGE_URL]:')[0].trim() || t('dashboard.loi_card.no_additional')}
                            </p>
                          </div>
                        </div>

                        {/* Admin Response */}
                        {loi.admin_response ? (
                          <div className="space-y-6">
                            {/* Latest Response */}
                            <div className="bg-aftras-blue-text text-white rounded-2xl p-5 md:p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10 hidden md:block">
                                <CheckCircle2 className="w-32 h-32" />
                              </div>
                              <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 md:mr-4">
                                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                  </div>
                                  <h4 className="text-lg md:text-xl font-bold">{t('dashboard.admin_response.title')}</h4>
                                </div>
                                {(() => {
                                  const latest = Array.isArray(loi.admin_response) 
                                    ? loi.admin_response[loi.admin_response.length - 1] 
                                    : loi.admin_response;
                                  
                                  return (
                                    <>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                        <div>
                                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">{t('dashboard.admin_response.proposed_quantity')}</p>
                                          <p className="text-sm md:text-base font-bold">{latest.proposed_quantity}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">{t('dashboard.admin_response.proposed_price')}</p>
                                          <p className="text-sm md:text-base font-bold">{latest.price}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">{t('dashboard.admin_response.incoterm_location')}</p>
                                          <p className="text-sm md:text-base font-bold">{latest.incoterm} - {latest.location}</p>
                                        </div>
                                        <div>
                                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">{t('dashboard.admin_response.delivery_time')}</p>
                                          <p className="text-sm md:text-base font-bold">{latest.delivery_time} {t('dashboard.admin_response.days')}</p>
                                        </div>
                                      </div>
                                      <p className="text-blue-100 text-[9px] md:text-[10px] mt-6 text-right italic">
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
                                <h4 className="text-[10px] md:text-sm font-bold text-aftras-blue-border mb-4 uppercase tracking-widest">Historique des offres précédentes</h4>
                                <div className="space-y-3">
                                  {loi.admin_response.slice(0, -1).reverse().map((resp: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm shadow-sm gap-4">
                                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                                        <div>
                                          <p className="text-gray-400 text-[9px] md:text-[10px] uppercase font-bold">Quantité</p>
                                          <p className="font-medium text-gray-700">{resp.proposed_quantity}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[9px] md:text-[10px] uppercase font-bold">Prix</p>
                                          <p className="font-medium text-gray-700">{resp.price}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[9px] md:text-[10px] uppercase font-bold">Incoterm</p>
                                          <p className="font-medium text-gray-700">{resp.incoterm}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-[9px] md:text-[10px] uppercase font-bold">Délai</p>
                                          <p className="font-medium text-gray-700">{resp.delivery_time}</p>
                                        </div>
                                      </div>
                                      <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                                        <p className="text-[9px] md:text-[10px] text-gray-400">{new Date(resp.updated_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-2xl p-6 md:p-8 text-center border-2 border-dashed border-gray-200">
                            <Clock className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm md:text-base text-gray-500 font-medium">{t('dashboard.admin_response.waiting')}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 md:p-16 text-center border-2 border-dashed border-gray-200">
              <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('dashboard.no_lois.title')}</h3>
              <p className="text-sm md:text-base text-gray-500 mb-8">{t('dashboard.no_lois.desc')}</p>
              <Link to="/loi" className="inline-block bg-aftras-orange text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all text-sm md:text-base">
                {t('dashboard.no_lois.cta')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
