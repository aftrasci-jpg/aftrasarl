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
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'lois' | 'products'>('lois');
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STATUS_LABELS: Record<string, string> = {
    searching: t('dashboard.status.searching'),
    negotiating: t('dashboard.status.negotiating'),
    finalized: t('dashboard.status.finalized'),
    cancelled: t('dashboard.status.cancelled')
  };

  const CATEGORIES = PRODUCT_CATEGORIES.map(cat => ({
    id: cat,
    label: t(`catalog_page.category_list.${cat}`)
  }));

  // Form states
  const [productForm, setProductForm] = useState<{
    name: string;
    category: ProductCategory;
    description: string;
    image_url: string;
    is_featured: boolean;
  }>({
    name: '',
    category: PRODUCT_CATEGORIES[0],
    description: '',
    image_url: '',
    is_featured: false
  });

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

    const fetchProducts = async () => {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error("Admin products fetch error:", fetchError);
      } else {
        setProducts(data as Product[]);
      }
    };

    fetchLois();
    fetchProducts();

    const loisSub = supabase.channel('admin_lois').on('postgres_changes', { event: '*', schema: 'public', table: 'lois' }, fetchLois).subscribe();
    const prodsSub = supabase.channel('admin_prods').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts).subscribe();

    return () => {
      loisSub.unsubscribe();
      prodsSub.unsubscribe();
    };
  }, [isAdmin]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Validate with Zod
      productSchema.parse(productForm);

      if (!productForm.image_url) {
        setError(t('admin_page.products.modal.image_required'));
        return;
      }

      if (editingProduct) {
        const { error: saveError } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', editingProduct.id);
        if (saveError) throw saveError;
      } else {
        const { error: saveError } = await supabase
          .from('products')
          .insert([productForm]);
        if (saveError) throw saveError;
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: PRODUCT_CATEGORIES[0], description: '', image_url: '', is_featured: false });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        console.error("Product save error:", err);
        setError(t('common.error'));
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
    } catch (error) {
      console.error("Product delete error:", error);
      setError(t('common.error'));
    }
  };

  const handleLoiResponse = async (loi: LOI) => {
    try {
      const { error: responseError } = await supabase
        .from('lois')
        .update({
          status: responseForm.status,
          admin_response: {
            proposed_quantity: responseForm.proposed_quantity,
            incoterm: responseForm.incoterm,
            location: responseForm.location,
            price: responseForm.price,
            delivery_time: responseForm.delivery_time,
            updated_at: new Date().toISOString()
          }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setProductForm({ ...productForm, image_url: publicUrl });
    } catch (error: any) {
      console.error('Image upload error:', error);
      setError(t('admin_page.products.modal.upload_error'));
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) return <div className="p-20 text-center">{t('admin_page.access_denied')}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <SEO 
        title={t('admin_page.title')} 
        description="Administration AFTRAS CI - Gestion des LOI et du catalogue produits."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-aftras-blue-border mb-12">{t('admin_page.title')}</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('lois')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'lois' ? 'bg-aftras-blue-text text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin_page.tabs.lois')} ({lois.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products' ? 'bg-aftras-blue-text text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin_page.tabs.catalog')} ({products.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8">
            {error}
          </div>
        )}

        {/* LOI Management */}
        {activeTab === 'lois' && (
          <div className="space-y-6">
            {lois.map((loi) => (
              <div key={loi.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  onClick={() => {
                    setExpandedLoiId(expandedLoiId === loi.id ? null : loi.id);
                    if (loi.admin_response) {
                      setResponseForm({
                        proposed_quantity: loi.admin_response.proposed_quantity,
                        incoterm: loi.admin_response.incoterm as any,
                        location: loi.admin_response.location,
                        price: loi.admin_response.price,
                        delivery_time: loi.admin_response.delivery_time,
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Product Management */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-aftras-blue-border">{t('admin_page.products.title')}</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: PRODUCT_CATEGORIES[0], description: '', image_url: '', is_featured: false });
                  setIsProductModalOpen(true);
                }}
                className="bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> {t('admin_page.products.add_btn')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="h-40 overflow-hidden relative">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{t('catalog_page.featured_badge')}</div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-xs font-bold text-aftras-blue-text uppercase mb-1">
                      {t(`catalog_page.category_list.${product.category}`)}
                    </p>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                  </div>
                  <div className="p-4 border-t border-gray-50 flex justify-end space-x-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          name: product.name,
                          category: product.category as ProductCategory,
                          description: product.description || '',
                          image_url: product.image_url,
                          is_featured: product.is_featured
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="p-2 text-aftras-blue-text hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Modal */}
        <AnimatePresence>
          {isProductModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="bg-aftras-blue-text p-6 text-white flex justify-between items-center">
                  <h3 className="text-xl font-bold">{editingProduct ? t('admin_page.products.modal.edit_title') : t('admin_page.products.modal.add_title')}</h3>
                  <button onClick={() => setIsProductModalOpen(false)}><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.products.modal.name')}</label>
                      <input 
                        required
                        type="text" 
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.products.modal.category')}</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value as ProductCategory})}
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.products.modal.image_url')}</label>
                    <div className="space-y-4">
                      {productForm.image_url && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border">
                          <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setProductForm({...productForm, image_url: ''})}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aftras-blue-text" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 font-bold">{t('admin_page.products.modal.upload_label')}</p>
                                <p className="text-xs text-gray-400">PNG, JPG, GIF (Max. 5MB)</p>
                              </>
                            )}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          required
                          type="url" 
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                          className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                          placeholder={t('admin_page.products.modal.image_url_placeholder')}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin_page.products.modal.description')}</label>
                      <textarea 
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                      />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isFeatured"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                      className="w-5 h-5 text-aftras-blue-text rounded border-gray-300 focus:ring-aftras-blue-text"
                    />
                    <label htmlFor="isFeatured" className="ml-3 text-sm font-bold text-gray-700">{t('admin_page.products.modal.featured')}</label>
                  </div>
                  <button type="submit" className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                    {t('admin_page.products.modal.submit')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
