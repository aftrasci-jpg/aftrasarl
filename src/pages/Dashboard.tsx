import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { LOI, STATUS_COLORS, STATUS_LABELS } from '../types';
import { Plus, ChevronDown, ChevronUp, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [lois, setLois] = useState<LOI[]>([]);
  const [expandedLoiId, setExpandedLoiId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'lois'),
      where('companyId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLois(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LOI)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedLoiId(expandedLoiId === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-aftras-blue-border">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {profile?.companyName}</p>
          </div>
          <Link 
            to="/loi" 
            className="flex items-center bg-aftras-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-aftras-orange/20"
          >
            <Plus className="w-5 h-5 mr-2" /> Nouvelle Demande (LOI)
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Demandes</p>
            <p className="text-3xl font-bold text-aftras-blue-text mt-2">{lois.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">En cours</p>
            <p className="text-3xl font-bold text-aftras-orange mt-2">
              {lois.filter(l => l.status !== 'finalized').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Finalisées</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {lois.filter(l => l.status === 'finalized').length}
            </p>
          </div>
        </div>

        {/* LOI List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-aftras-blue-border mb-6">Mes Lettres d'Intention</h2>
          
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
                      <p className="text-sm text-gray-500">Quantité: {loi.quantity} • {new Date(loi.createdAt).toLocaleDateString()}</p>
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
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Budget estimé</p>
                            <p className="text-gray-900 font-medium">{loi.budget || 'Non spécifié'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Incoterm</p>
                            <p className="text-gray-900 font-medium">{loi.incoterm || 'Non spécifié'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Port / Pays de destination</p>
                            <p className="text-gray-900 font-medium">{loi.port || 'Non spécifié'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Délai souhaité</p>
                            <p className="text-gray-900 font-medium">{loi.deadline || 'Non spécifié'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Informations complémentaires</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{loi.additionalInfo || 'Aucune information supplémentaire.'}</p>
                          </div>
                        </div>

                        {/* Admin Response */}
                        {loi.adminResponse ? (
                          <div className="bg-aftras-blue-text text-white rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <CheckCircle2 className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                              <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                                  <AlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold">Réponse d'AFTRAS CI</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                  <p className="text-blue-200 text-xs font-bold uppercase mb-1">Quantité proposée</p>
                                  <p className="font-bold">{loi.adminResponse.proposedQuantity}</p>
                                </div>
                                <div>
                                  <p className="text-blue-200 text-xs font-bold uppercase mb-1">Prix proposé</p>
                                  <p className="font-bold">{loi.adminResponse.price}</p>
                                </div>
                                <div>
                                  <p className="text-blue-200 text-xs font-bold uppercase mb-1">Incoterm / Lieu</p>
                                  <p className="font-bold">{loi.adminResponse.incoterm} - {loi.adminResponse.location}</p>
                                </div>
                                <div>
                                  <p className="text-blue-200 text-xs font-bold uppercase mb-1">Délai de livraison</p>
                                  <p className="font-bold">{loi.adminResponse.deliveryTime} jours</p>
                                </div>
                              </div>
                              <p className="text-blue-100 text-[10px] mt-6 text-right italic">
                                Dernière mise à jour le {new Date(loi.adminResponse.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">En attente de réponse de nos représentants...</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune LOI envoyée</h3>
              <p className="text-gray-500 mb-8">Commencez par envoyer une Lettre d'Intention pour sourcer un produit.</p>
              <Link to="/loi" className="bg-aftras-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                Envoyer ma première LOI
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
