import React, { useEffect, useState } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { ProductSlider } from '../components/ProductSlider';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { Search, Handshake, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const q = query(collection(db, 'products'), where('isFeatured', '==', true), limit(10));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(products);
    };
    fetchFeatured();
  }, []);

  const steps = [
    { title: 'Analyse des besoins', desc: 'Nous étudions vos spécifications techniques et volumes.', icon: Search },
    { title: 'Sourcing fournisseurs', desc: 'Identification des meilleurs partenaires globaux.', icon: Handshake },
    { title: 'Négociation & Sécurisation', desc: 'Optimisation des prix et sécurisation des contrats.', icon: ShieldCheck },
    { title: 'Logistique & Livraison', desc: 'Suivi complet jusqu’à destination finale.', icon: Zap },
  ];

  const services = [
    { title: 'Recherche Fournisseurs', desc: 'Accès à un réseau mondial de fournisseurs certifiés.' },
    { title: 'Négociation Commerciale', desc: 'Expertise pour obtenir les meilleures conditions.' },
    { title: 'Intermédiation', desc: 'Facilitateur de confiance entre acheteur et vendeur.' },
    { title: 'Logistique & Suivi', desc: 'Gestion du transport et des formalités douanières.' },
  ];

  return (
    <div className="bg-white">
      <HeroSlider />

      {/* How we work */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-aftras-blue-border mb-4">Comment nous travaillons</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            Un processus structuré pour garantir le succès de vos opérations d'import-export.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border-2 border-aftras-orange hover:shadow-xl hover:shadow-aftras-orange/10 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-aftras-blue-text" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-aftras-blue-border mb-2">Produits Vedettes</h2>
            <p className="text-gray-600">Découvrez une sélection de nos produits les plus demandés.</p>
          </div>
          <Link to="/catalog" className="text-aftras-blue-text font-bold flex items-center hover:text-aftras-orange transition-colors">
            Voir tout le catalogue <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <ProductSlider products={featuredProducts} />
      </section>

      {/* Services Summary */}
      <section className="py-20 bg-aftras-blue-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Nos Services d'Expertise</h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                AFTRAS CI offre un accompagnement de bout en bout pour vos besoins en négoce international.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <CheckCircle2 className="w-6 h-6 text-aftras-orange flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">{service.title}</h4>
                      <p className="text-blue-200 text-sm">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/services" 
                className="inline-block mt-12 bg-aftras-orange hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-bold transition-all"
              >
                En savoir plus sur nos services
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" 
                alt="Logistics" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ShieldCheck className="w-8 h-8 text-aftras-orange" />
                  </div>
                  <div>
                    <p className="text-aftras-blue-text font-bold text-2xl">100%</p>
                    <p className="text-gray-500 text-sm">Sécurisé & Fiable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-aftras-blue-border mb-16">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
                <Globe className="w-10 h-10 text-aftras-blue-text" />
              </div>
              <h3 className="text-xl font-bold mb-4">Réseau International</h3>
              <p className="text-gray-600">Accès privilégié à des fournisseurs en Asie, Europe et Amérique.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
                <ShieldCheck className="w-10 h-10 text-aftras-orange" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expertise & Sécurisation</h3>
              <p className="text-gray-600">Maîtrise des risques et des procédures internationales.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 transform rotate-6">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Optimisation des Coûts</h3>
              <p className="text-gray-600">Négociation agressive pour maximiser vos marges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-aftras-blue-border mb-6">Prêt à lancer votre demande ?</h2>
          <p className="text-gray-600 text-lg mb-10">
            Créez votre compte entreprise dès aujourd'hui et envoyez votre première Lettre d'Intention (LOI).
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-aftras-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all">
              Créer mon compte
            </Link>
            <Link to="/login" className="bg-white text-aftras-blue-text border-2 border-aftras-blue-text px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-all">
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
