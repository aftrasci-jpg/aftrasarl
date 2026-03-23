import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LOI, Product, STATUS_COLORS, LOIStatus, PRODUCT_CATEGORIES, ProductCategory } from '../types';
import { Plus, Trash2, Edit, CheckCircle2, X, Package, FileText, Send, Image as ImageIcon, Upload, AlertCircle, Users, UserPlus, Shield, Briefcase, Mail, Lock, Building2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { productSchema } from '../schemas';
import { z } from 'zod';
import { Modal } from '../components/Modal';

export const Admin = () => {
  const { t } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'lois' | 'companies' | 'users'>('lois');
  const [lois, setLois] = useState<LOI[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [loiSearchTerm, setLoiSearchTerm] = useState('');
  const [loiToDelete, setLoiToDelete] = useState<string | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const adminClientRef = React.useRef<any>(null);

  // Create a temporary client for user creation to avoid signing out the admin
  const getAdminAuthClient = () => {
    if (adminClientRef.current) return adminClientRef.current;

    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
    adminClientRef.current = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { 
        persistSession: false,
        storageKey: 'sb-admin-auth-token' // Use a different storage key to avoid warnings
      }
    });
    return adminClientRef.current;
  };

  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    role: 'community_manager' as 'admin' | 'company' | 'community_manager',
    company_name: '',
    country: '',
    city: '',
    business_registry_number: '',
    representative_name: '',
    position: '',
    phone: ''
  });

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
        // Filter out LOIs hidden by admin
        const filteredLois = (data as LOI[]).filter(loi => !loi.additional_info?.includes('[ADMIN_HIDDEN]'));
        setLois(filteredLois);
        setError(null);
      }
    };

    fetchLois();

    const fetchProfiles = async () => {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error("Admin profiles fetch error:", fetchError);
      } else {
        setProfiles(data);
      }
    };

    fetchProfiles();

    const loisSub = supabase.channel('admin_lois').on('postgres_changes', { event: '*', schema: 'public', table: 'lois' }, fetchLois).subscribe();
    const profilesSub = supabase.channel('admin_profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfiles).subscribe();

    return () => {
      loisSub.unsubscribe();
      profilesSub.unsubscribe();
    };
  }, [isAdmin]);

  const getLoiImage = (loi: LOI) => {
    if (loi.product_image) return loi.product_image;
    if (loi.additional_info?.includes('[IMAGE_URL]:')) {
      const match = loi.additional_info.match(/\[IMAGE_URL\]:\s*(https?:\/\/[^\s\n]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

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

  const handleDeleteLoi = async () => {
    if (!loiToDelete) return;
    try {
      const loi = lois.find(l => l.id === loiToDelete);
      if (!loi) return;

      // Soft delete for admin: hide it from admin view but keep it for the company
      const updatedInfo = (loi.additional_info || '') + ' [ADMIN_HIDDEN]';
      
      const { error: deleteError } = await supabase
        .from('lois')
        .update({ additional_info: updatedInfo })
        .eq('id', loiToDelete);

      if (deleteError) throw deleteError;
      
      setLois(prev => prev.filter(loi => loi.id !== loiToDelete));
      setLoiToDelete(null);
    } catch (error) {
      console.error("Delete LOI error:", error);
      setError(t('common.error'));
      setLoiToDelete(null);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;
    // Prevent self-deletion
    if (user?.id === profileToDelete) {
      setError(t('admin_page.users.cannotDeleteSelf'));
      setProfileToDelete(null);
      return;
    }

    try {
      setError(null);
      // Use RPC to delete from auth.users (which cascades to profiles)
      const { error: rpcError } = await supabase.rpc('delete_user', { target_user_id: profileToDelete });

      if (rpcError) {
        // Fallback to direct profile deletion if RPC fails
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profileToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Update local state immediately
      setProfiles(prev => prev.filter(p => p.id !== profileToDelete));
      setProfileToDelete(null);
      setSuccess(t('admin_page.users.deleteSuccess'));
      setTimeout(() => setSuccess(null), 3000);

      // Also manually refresh to be absolutely sure
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (profilesData) setProfiles(profilesData);

    } catch (error: any) {
      console.error("Delete profile error:", error);
      setError(error.message || t('admin_page.users.deleteError'));
      setProfileToDelete(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const adminAuthClient = getAdminAuthClient();
      
      // 1. Create the Auth user using the temporary client
      // This prevents the current admin from being signed out
      const { data: authData, error: authError } = await adminAuthClient.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
        options: {
          data: {
            role: newUserForm.role,
            company_name: newUserForm.role === 'company' ? newUserForm.company_name : (newUserForm.company_name || 'AFTRAS Staff'),
            country: newUserForm.country,
            city: newUserForm.city,
            business_registry_number: newUserForm.business_registry_number,
            representative_name: newUserForm.representative_name,
            position: newUserForm.position,
            phone: newUserForm.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Update the profile using the main client (where admin is still logged in)
        // We wait a tiny bit to ensure the trigger has created the initial profile
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            email: newUserForm.email,
            role: newUserForm.role,
            company_name: newUserForm.role === 'company' ? newUserForm.company_name : (newUserForm.company_name || 'AFTRAS Staff'),
            country: newUserForm.country,
            city: newUserForm.city,
            business_registry_number: newUserForm.business_registry_number,
            representative_name: newUserForm.representative_name,
            position: newUserForm.position,
            phone: newUserForm.phone
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error("Profile update error:", profileError);
          // If update fails, we still show success but warn about the role
          setSuccess("Utilisateur créé. Note: La mise à jour automatique du rôle a échoué, veuillez le modifier manuellement dans la liste.");
        } else {
          setSuccess("Utilisateur créé avec succès avec le rôle: " + newUserForm.role);
        }
        
        setIsUserModalOpen(false);
        setNewUserForm({ 
          email: '', 
          password: '', 
          role: 'community_manager', 
          company_name: '',
          country: '',
          city: '',
          business_registry_number: '',
          representative_name: '',
          position: '',
          phone: ''
        });
        
        // Refresh profiles list manually
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (profilesData) setProfiles(profilesData);
      }
    } catch (err: any) {
      console.error("User creation error:", err);
      setError(err.message || t('common.error'));
    }
  };

  if (!isAdmin) return <div className="p-20 text-center">{t('admin_page.access_denied')}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <SEO 
        title={t('admin_page.title')} 
        description="Administration AFTRAS CI - Gestion des LOI."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-aftras-blue-border">{t('admin_page.title')}</h1>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
            <button 
              onClick={() => setActiveTab('lois')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap ${activeTab === 'lois' ? 'bg-aftras-blue-text text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <FileText className="w-4 h-4 mr-2 flex-shrink-0" /> {t('admin_page.tabs.lois')}
            </button>
            <button 
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap ${activeTab === 'companies' ? 'bg-aftras-blue-text text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Building2 className="w-4 h-4 mr-2 flex-shrink-0" /> {t('admin_page.tabs.companies')}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap ${activeTab === 'users' ? 'bg-aftras-blue-text text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Users className="w-4 h-4 mr-2 flex-shrink-0" /> {t('admin_page.tabs.users')}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-6 rounded-2xl border border-green-100 mb-8 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            {success}
          </div>
        )}

        {activeTab === 'lois' && (
          /* LOI Management */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-aftras-blue-border">{t('admin_page.tabs.lois')} ({lois.length})</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder={t('admin_page.lois.search_placeholder')}
                  value={loiSearchTerm}
                  onChange={(e) => setLoiSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                />
              </div>
            </div>
            {lois
              .filter(loi => loi.company_name?.toLowerCase().includes(loiSearchTerm.toLowerCase()))
              .map((loi) => (
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
                  <div className="flex items-center space-x-3 md:space-x-4">
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-aftras-blue-text/10 text-aftras-blue-text border border-aftras-blue-text/20">
                          {loi.company_name}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">{loi.product}</h3>
                      <p className="text-xs md:text-sm text-gray-500">{loi.quantity} • {new Date(loi.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLoiToDelete(loi.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[loi.status]}`}>
                      {STATUS_LABELS[loi.status]}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedLoiId === loi.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-gray-100 bg-gray-50/50 p-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Details */}
                        <div>
                          <h4 className="font-bold text-aftras-blue-border mb-4 uppercase text-[10px] md:text-xs tracking-widest">{t('admin_page.lois.details_title')}</h4>
                          <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                            <p className="text-gray-500">Entreprise:</p><p className="font-bold text-aftras-blue-text">{loi.company_name}</p>
                            <p className="text-gray-500">{t('loi_form.form.budget_label')}:</p><p className="font-medium">{loi.budget || 'N/A'}</p>
                            <p className="text-gray-500">{t('loi_form.form.incoterm_label')}:</p><p className="font-medium">{loi.incoterm || 'N/A'}</p>
                            <p className="text-gray-500">{t('loi_form.form.port_label')}:</p><p className="font-medium">{loi.port || 'N/A'}</p>
                            <p className="text-gray-500">{t('loi_form.form.deadline_label')}:</p><p className="font-medium">{loi.deadline || 'N/A'}</p>
                          </div>
                          <div className="mt-4">
                            <p className="text-gray-500 text-xs md:text-sm mb-1">{t('loi_form.sections.additional')}:</p>
                            <p className="text-gray-700 text-xs md:text-sm italic">
                              {loi.additional_info?.split('[IMAGE_URL]:')[0].replace('[ADMIN_HIDDEN]', '').replace('[COMPANY_HIDDEN]', '').trim() || 'Aucune.'}
                            </p>
                          </div>
                        </div>

                        {/* Response Form */}
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                          <h4 className="font-bold text-aftras-blue-border mb-6 uppercase text-[10px] md:text-xs tracking-widest">{t('admin_page.lois.response_title')}</h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 mb-1">{t('admin_page.lois.form.status')}</label>
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
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.proposed_quantity')}</label>
                                <input 
                                  type="text" 
                                  value={responseForm.proposed_quantity}
                                  onChange={(e) => setResponseForm({...responseForm, proposed_quantity: e.target.value})}
                                  className="w-full p-2 border rounded-lg text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.proposed_price')}</label>
                                <input 
                                  type="text" 
                                  value={responseForm.price}
                                  onChange={(e) => setResponseForm({...responseForm, price: e.target.value})}
                                  className="w-full p-2 border rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 mb-1">{t('dashboard.admin_response.delivery_time')}</label>
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
                              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
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
                                <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
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
        )}

        {activeTab === 'companies' && (
          /* Company Management */
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-aftras-blue-border">{t('admin_page.tabs.companies')} ({profiles.filter(p => p.role === 'company').length})</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {profiles.filter(p => p.role === 'company').map((profile) => (
                <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div 
                    onClick={() => setSelectedProfileId(selectedProfileId === profile.id ? null : profile.id)}
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-600">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{profile.company_name}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{profile.country}</p>
                        <p className="text-sm font-medium text-gray-600">{profile.city}</p>
                      </div>
                      
                      {user?.id !== profile.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileToDelete(profile.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedProfileId === profile.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('admin_page.companies.info_title')}</h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.name')}</p>
                                <p className="font-bold text-gray-900">{profile.company_name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.registry')}</p>
                                <p className="font-medium text-gray-900">{profile.business_registry_number || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.location')}</p>
                                <p className="font-medium text-gray-900">{profile.city}, {profile.country}</p>
                              </div>
                              {profile.website && (
                                <div>
                                  <p className="text-xs text-gray-500">{t('auth.fields.website')}</p>
                                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-aftras-blue-text hover:underline font-medium">
                                    {profile.website}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('admin_page.companies.rep_title')}</h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.rep_name')}</p>
                                <p className="font-bold text-gray-900">{profile.representative_name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.position')}</p>
                                <p className="font-medium text-gray-900">{profile.position}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.email')}</p>
                                <p className="font-medium text-gray-900">{profile.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{t('admin_page.companies.phone')}</p>
                                <p className="font-medium text-gray-900">{profile.phone}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('admin_page.companies.stats_title')}</h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">{t('admin_page.companies.lois_sent')}</span>
                                <span className="font-bold text-aftras-blue-text">{lois.filter(l => l.company_id === profile.id).length}</span>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-aftras-blue-text h-full" 
                                  style={{ width: `${Math.min(100, (lois.filter(l => l.company_id === profile.id).length / 10) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 italic">{t('admin_page.companies.joined_on')} {new Date(profile.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          /* Staff Management */
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-aftras-blue-border">{t('admin_page.tabs.users')} ({profiles.filter(p => p.role !== 'company').length})</h2>
              <button 
                onClick={() => {
                  setNewUserForm({ ...newUserForm, role: 'community_manager' });
                  setIsUserModalOpen(true);
                }}
                className="bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center shadow-lg shadow-orange-600/20"
              >
                <UserPlus className="w-5 h-5 mr-2" /> {t('admin_page.staff.add_btn')}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {profiles.filter(p => p.role !== 'company').map((profile) => (
                <div key={profile.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${profile.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {profile.role === 'admin' ? <Shield className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{profile.email}</h3>
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        profile.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {profile.role === 'admin' ? t('admin_page.staff.admin') : t('admin_page.staff.cm')}
                      </div>
                    </div>
                  </div>

                  {user?.id !== profile.id && (
                    <button
                      onClick={() => setProfileToDelete(profile.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Creation Modal */}
        <AnimatePresence>
          {isUserModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] my-auto"
              >
                <div className="bg-aftras-blue-text p-6 text-white flex justify-between items-center flex-shrink-0">
                  <h3 className="text-xl font-bold">
                    {newUserForm.role === 'company' ? t('admin_page.companies.add_btn') : t('admin_page.staff.add_btn')}
                  </h3>
                  <button onClick={() => setIsUserModalOpen(false)}><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleCreateUser} className="p-8 space-y-6 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.users.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        required
                        type="email" 
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                        placeholder="email@aftras.ci"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.users.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        required
                        type="password" 
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.users.role')}</label>
                    <select 
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value as any})}
                      className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                    >
                      <option value="community_manager">{t('admin_page.staff.cm')}</option>
                      <option value="admin">{t('admin_page.staff.admin')}</option>
                      <option value="company">{t('admin_page.staff.company') || 'Entreprise'}</option>
                    </select>
                  </div>

                  {newUserForm.role === 'company' && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="font-bold text-aftras-blue-text text-sm uppercase tracking-wider">Informations Entreprise</h4>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Nom de l'entreprise</label>
                        <input 
                          required
                          type="text" 
                          value={newUserForm.company_name}
                          onChange={(e) => setNewUserForm({...newUserForm, company_name: e.target.value})}
                          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Pays</label>
                          <input 
                            required
                            type="text" 
                            value={newUserForm.country}
                            onChange={(e) => setNewUserForm({...newUserForm, country: e.target.value})}
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Ville</label>
                          <input 
                            required
                            type="text" 
                            value={newUserForm.city}
                            onChange={(e) => setNewUserForm({...newUserForm, city: e.target.value})}
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">N° Registre de Commerce</label>
                        <input 
                          required
                          type="text" 
                          value={newUserForm.business_registry_number}
                          onChange={(e) => setNewUserForm({...newUserForm, business_registry_number: e.target.value})}
                          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Nom du Représentant</label>
                          <input 
                            required
                            type="text" 
                            value={newUserForm.representative_name}
                            onChange={(e) => setNewUserForm({...newUserForm, representative_name: e.target.value})}
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Fonction</label>
                          <input 
                            required
                            type="text" 
                            value={newUserForm.position}
                            onChange={(e) => setNewUserForm({...newUserForm, position: e.target.value})}
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone / WhatsApp</label>
                        <input 
                          required
                          type="text" 
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed">
                    <p className="font-bold mb-1">{t('admin_page.users.note_title')}</p>
                    {t('admin_page.users.note_desc')}
                  </div>
                  <button type="submit" className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-orange-600/20">
                    {newUserForm.role === 'company' ? t('admin_page.companies.add_btn') : t('admin_page.staff.add_btn')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Modal
          isOpen={!!loiToDelete}
          onClose={() => setLoiToDelete(null)}
          onConfirm={handleDeleteLoi}
          title={t('dashboard.loi_card.delete_confirm')}
          message={t('dashboard.loi_card.delete_desc')}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          type="danger"
        />

        <Modal
          isOpen={!!profileToDelete}
          onClose={() => setProfileToDelete(null)}
          onConfirm={handleDeleteProfile}
          title={t('admin_page.users.confirm_delete')}
          message={t('admin_page.users.deleteConfirm')}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          type="danger"
        />
      </div>
    </div>
  );
};
