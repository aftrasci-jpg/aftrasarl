import React from 'react';
import { motion } from 'framer-motion';
import { Search, Handshake, ShieldCheck, Truck, BarChart3, Globe2 } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      title: 'Recherche de Fournisseurs Fiables',
      desc: 'Nous identifions et auditons des fournisseurs globaux pour garantir la qualité et la fiabilité de vos approvisionnements.',
      icon: Search,
      color: 'bg-blue-50 text-aftras-blue-text'
    },
    {
      title: 'Négociation Commerciale',
      desc: 'Nos experts négocient pour vous les meilleurs prix, délais et conditions de paiement auprès des fournisseurs.',
      icon: BarChart3,
      color: 'bg-orange-50 text-aftras-orange'
    },
    {
      title: 'Intermédiation Commerciale',
      desc: 'Nous agissons comme tiers de confiance pour sécuriser les transactions entre acheteurs et vendeurs.',
      icon: Handshake,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Organisation Logistique',
      desc: 'Suivi complet de l’expédition, de l’enlèvement à la livraison finale, incluant les formalités douanières.',
      icon: Truck,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Accompagnement Stratégique',
      desc: 'Conseils sur les marchés internationaux, les incoterms et les régulations commerciales.',
      icon: Globe2,
      color: 'bg-red-100 text-red-800'
    },
    {
      title: 'Sécurisation des Transactions',
      desc: 'Mise en place de mécanismes de garantie et vérification de la conformité des documents.',
      icon: ShieldCheck,
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-aftras-blue-text text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920" 
            alt="Logistics" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-8 py-4 rounded-2xl border-2 border-aftras-orange bg-aftras-blue-text/50 backdrop-blur-sm mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Nos Services d'Expertise
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Des solutions sur mesure pour optimiser vos opérations de négoce international.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-3xl border-2 border-aftras-orange shadow-sm hover:shadow-xl hover:shadow-aftras-orange/10 transition-all group bg-white"
              >
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-8 border border-aftras-orange group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-aftras-blue-text mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-aftras-blue-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Notre Approche</h2>
            <p className="text-blue-200">Comment nous garantissons la réussite de vos projets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            {[
              { num: '01', title: 'Écoute', desc: 'Compréhension de vos besoins spécifiques.' },
              { num: '02', title: 'Analyse', desc: 'Étude de faisabilité et sourcing.' },
              { num: '03', title: 'Action', desc: 'Négociation et contractualisation.' },
              { num: '04', title: 'Suivi', desc: 'Contrôle qualité et logistique.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-aftras-blue-text p-6 text-center">
                <div className="w-12 h-12 bg-aftras-orange rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  {item.num}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
