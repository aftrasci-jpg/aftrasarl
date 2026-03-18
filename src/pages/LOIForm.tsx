import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FileText, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LOIForm = () => {
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
    additionalInfo: '',
    serious: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!formData.serious) {
      alert("Veuillez confirmer le sérieux de votre demande.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'lois'), {
        companyId: user.uid,
        companyName: profile.companyName,
        product: formData.product,
        quantity: formData.quantity,
        budget: formData.budget,
        incoterm: formData.incoterm,
        port: formData.port,
        deadline: formData.deadline,
        additionalInfo: formData.additionalInfo,
        status: 'searching',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error("LOI submission error:", error);
      alert("Une erreur est survenue lors de l'envoi.");
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
          <h2 className="text-3xl font-bold text-aftras-blue-border mb-4">LOI Envoyée !</h2>
          <p className="text-gray-600 mb-8">Votre demande a été enregistrée avec succès. Nos représentants vont l'analyser et vous répondront prochainement.</p>
          <p className="text-sm text-aftras-blue-text font-medium">Redirection vers votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-aftras-blue-text p-10 text-white">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 mr-4" />
              <h1 className="text-3xl font-bold">Lettre d'Intention d'Achat (LOI)</h1>
            </div>
            <p className="text-blue-100">Veuillez remplir ce formulaire avec précision pour nous permettre de trouver le meilleur fournisseur.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Section 1: Produit */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">Informations sur le produit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Produit demandé *</label>
                  <input
                    required
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="Ex: Riz long grain, Noix de cajou..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantité souhaitée *</label>
                  <input
                    required
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="Ex: 500 MT, 2 conteneurs 40ft..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Commercial */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">Conditions commerciales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Budget estimé (USD/EUR)</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Ex: 450 USD / MT"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Incoterm souhaité</label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Port / Pays de destination</label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: e.target.value})}
                    placeholder="Ex: Port d'Abidjan, Côte d'Ivoire"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Délai de livraison souhaité</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    placeholder="Ex: Sous 30 jours"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Autres */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-aftras-blue-border border-b pb-2">Informations complémentaires</h3>
              <div>
                <textarea
                  rows={4}
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  placeholder="Spécifications techniques, certifications requises, etc."
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
                  Je déclare que cette demande est sérieuse et que mon entreprise dispose des fonds nécessaires pour conclure la transaction si les conditions sont acceptées.
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
                  <Send className="w-5 h-5 mr-2" /> Envoyer la LOI
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
