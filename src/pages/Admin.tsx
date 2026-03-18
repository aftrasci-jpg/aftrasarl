import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LOI, Product, STATUS_COLORS, STATUS_LABELS, LOIStatus } from '../types';
import { Plus, Trash2, Edit, CheckCircle2, X, Package, FileText, Send, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Admin = () => {
  const { isAdmin } = useAuth();
  const [lois, setLois] = useState<LOI[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'lois' | 'products'>('lois');
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Céréales & Grains',
    description: '',
    imageUrl: '',
    isFeatured: false
  });

  const [responseForm, setResponseForm] = useState({
    proposedQuantity: '',
    incoterm: 'CIF',
    location: '',
    price: '',
    deliveryTime: '',
    status: 'searching' as LOIStatus
  });

  useEffect(() => {
    if (!isAdmin) return;

    const unsubLois = onSnapshot(query(collection(db, 'lois'), orderBy('createdAt', 'desc')), (snap) => {
      setLois(snap.docs.map(d => ({ id: d.id, ...d.data() } as LOI)));
    });

    const unsubProds = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });

    return () => {
      unsubLois();
      unsubProds();
    };
  }, [isAdmin]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productForm);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productForm,
          createdAt: new Date().toISOString()
        });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Céréales & Grains', description: '', imageUrl: '', isFeatured: false });
    } catch (error) {
      console.error("Product save error:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Supprimer ce produit ?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const handleLoiResponse = async (loi: LOI) => {
    try {
      await updateDoc(doc(db, 'lois', loi.id), {
        status: responseForm.status,
        adminResponse: {
          proposedQuantity: responseForm.proposedQuantity,
          incoterm: responseForm.incoterm,
          location: responseForm.location,
          price: responseForm.price,
          deliveryTime: responseForm.deliveryTime,
          updatedAt: new Date().toISOString()
        }
      });
      setExpandedLoiId(null);
    } catch (error) {
      console.error("LOI response error:", error);
    }
  };

  if (!isAdmin) return <div className="p-20 text-center">Accès refusé.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-aftras-blue-border mb-12">Administration</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('lois')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'lois' ? 'bg-aftras-blue-text text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gestion des LOI ({lois.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products' ? 'bg-aftras-blue-text text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gestion Catalogue ({products.length})
          </button>
        </div>

        {/* LOI Management */}
        {activeTab === 'lois' && (
          <div className="space-y-6">
            {lois.map((loi) => (
              <div key={loi.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  onClick={() => {
                    setExpandedLoiId(expandedLoiId === loi.id ? null : loi.id);
                    if (loi.adminResponse) {
                      setResponseForm({
                        proposedQuantity: loi.adminResponse.proposedQuantity,
                        incoterm: loi.adminResponse.incoterm as any,
                        location: loi.adminResponse.location,
                        price: loi.adminResponse.price,
                        deliveryTime: loi.adminResponse.deliveryTime,
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
                      <h3 className="text-lg font-bold text-gray-900">{loi.companyName}</h3>
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
                          <h4 className="font-bold text-aftras-blue-border mb-4 uppercase text-xs tracking-widest">Détails de la demande</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p className="text-gray-500">Budget:</p><p className="font-medium">{loi.budget || 'N/A'}</p>
                            <p className="text-gray-500">Incoterm:</p><p className="font-medium">{loi.incoterm || 'N/A'}</p>
                            <p className="text-gray-500">Port:</p><p className="font-medium">{loi.port || 'N/A'}</p>
                            <p className="text-gray-500">Délai:</p><p className="font-medium">{loi.deadline || 'N/A'}</p>
                          </div>
                          <div className="mt-4">
                            <p className="text-gray-500 text-sm mb-1">Infos complémentaires:</p>
                            <p className="text-gray-700 text-sm italic">{loi.additionalInfo || 'Aucune.'}</p>
                          </div>
                        </div>

                        {/* Response Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                          <h4 className="font-bold text-aftras-blue-border mb-6 uppercase text-xs tracking-widest">Réponse automatisée</h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Statut</label>
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
                                <label className="block text-xs font-bold text-gray-500 mb-1">Quantité proposée</label>
                                <input 
                                  type="text" 
                                  value={responseForm.proposedQuantity}
                                  onChange={(e) => setResponseForm({...responseForm, proposedQuantity: e.target.value})}
                                  className="w-full p-2 border rounded-lg text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Prix proposé</label>
                                <input 
                                  type="text" 
                                  value={responseForm.price}
                                  onChange={(e) => setResponseForm({...responseForm, price: e.target.value})}
                                  className="w-full p-2 border rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Délai (jours)</label>
                                <input 
                                  type="text" 
                                  value={responseForm.deliveryTime}
                                  onChange={(e) => setResponseForm({...responseForm, deliveryTime: e.target.value})}
                                  className="w-full p-2 border rounded-lg text-sm"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => handleLoiResponse(loi)}
                              className="w-full bg-aftras-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center"
                            >
                              <Send className="w-4 h-4 mr-2" /> Mettre à jour & Envoyer
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
              <h2 className="text-xl font-bold text-aftras-blue-border">Catalogue Produits</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Céréales & Grains', description: '', imageUrl: '', isFeatured: false });
                  setIsProductModalOpen(true);
                }}
                className="bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Ajouter un produit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="h-40 overflow-hidden relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {product.isFeatured && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">VEDETTE</div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-xs font-bold text-aftras-blue-text uppercase mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                  </div>
                  <div className="p-4 border-t border-gray-50 flex justify-end space-x-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          name: product.name,
                          category: product.category,
                          description: product.description || '',
                          imageUrl: product.imageUrl,
                          isFeatured: product.isFeatured
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
                  <h3 className="text-xl font-bold">{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
                  <button onClick={() => setIsProductModalOpen(false)}><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
                      <input 
                        required
                        type="text" 
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                      >
                        <option value="Céréales & Grains">Céréales & Grains</option>
                        <option value="Légumineuses">Légumineuses</option>
                        <option value="Noix & Oléagineux">Noix & Oléagineux</option>
                        <option value="Produits d’export">Produits d’export</option>
                        <option value="Épices & Condiments">Épices & Condiments</option>
                        <option value="Fruits & Légumes">Fruits & Légumes</option>
                        <option value="Produits transformés">Produits transformés</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">URL de l'image (Cloudinary)</label>
                    <div className="flex space-x-2">
                      <div className="flex-grow relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          required
                          type="url" 
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                          className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-aftras-blue-text"
                          placeholder="https://res.cloudinary.com/..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
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
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({...productForm, isFeatured: e.target.checked})}
                      className="w-5 h-5 text-aftras-blue-text rounded border-gray-300 focus:ring-aftras-blue-text"
                    />
                    <label htmlFor="isFeatured" className="ml-3 text-sm font-bold text-gray-700">Produit Vedette (Slider)</label>
                  </div>
                  <button type="submit" className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                    Enregistrer le produit
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
