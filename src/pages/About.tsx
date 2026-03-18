import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Rocket } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-aftras-blue-text text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=1920" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            À Propos d'AFTRAS CI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Votre partenaire stratégique pour le négoce international et l'intermédiation commerciale.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-aftras-blue-border mb-6">Qui sommes-nous ?</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Africa Trading Solutions Côte d'Ivoire SARL (AFTRAS CI) est une société de négoce international spécialisée dans l'intermédiation commerciale et le sourcing de produits de haute qualité. Basés stratégiquement pour servir les marchés africains et internationaux, nous agissons comme un pont fiable entre les producteurs mondiaux et les acheteurs exigeants.
                </p>
                <p>
                  Notre expertise repose sur une connaissance approfondie des chaînes d'approvisionnement mondiales et une capacité unique à naviguer dans les complexités du commerce international. Nous ne nous contentons pas de trouver des produits ; nous bâtissons des relations durables basées sur la confiance et la performance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400" alt="Team" className="rounded-2xl shadow-lg" />
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400" alt="Meeting" className="rounded-2xl shadow-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-aftras-blue-text" />
              </div>
              <h3 className="text-2xl font-bold text-aftras-blue-border mb-4">Notre Vision</h3>
              <p className="text-gray-600">
                Devenir un acteur panafricain majeur du négoce international, reconnu pour son intégrité et son efficacité opérationnelle.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-aftras-blue-border mb-4">Notre Mission</h3>
              <p className="text-gray-600">
                Faciliter les échanges commerciaux internationaux en offrant des solutions de sourcing et de logistique optimisées et sécurisées.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-aftras-blue-border mb-4">Notre Engagement</h3>
              <p className="text-gray-600">
                Accompagner nos clients à chaque étape pour garantir des transactions fluides et des résultats concrets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
