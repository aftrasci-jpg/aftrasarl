import React from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { Search, Handshake, ShieldCheck, Truck, BarChart3, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t('services_page.items.0.title'),
      desc: t('services_page.items.0.desc'),
      icon: Search,
      color: 'bg-blue-50 text-aftras-blue-text'
    },
    {
      title: t('services_page.items.1.title'),
      desc: t('services_page.items.1.desc'),
      icon: BarChart3,
      color: 'bg-orange-50 text-aftras-orange'
    },
    {
      title: t('services_page.items.2.title'),
      desc: t('services_page.items.2.desc'),
      icon: Handshake,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: t('services_page.items.3.title'),
      desc: t('services_page.items.3.desc'),
      icon: Truck,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: t('services_page.items.4.title'),
      desc: t('services_page.items.4.desc'),
      icon: Globe2,
      color: 'bg-red-100 text-red-800'
    },
    {
      title: t('services_page.items.5.title'),
      desc: t('services_page.items.5.desc'),
      icon: ShieldCheck,
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="Nos Services | AFTRAS CI - Sourcing & Négoce"
        description="Découvrez nos services d'intermédiation commerciale : sourcing de produits, logistique internationale, accompagnement stratégique et sécurisation des transactions."
      />
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-aftras-blue-text text-white overflow-hidden">
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
            className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-2xl border-2 border-aftras-orange bg-aftras-blue-text/50 backdrop-blur-sm mb-6 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
              {t('services_page.title')}
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
          >
            {t('services_page.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 md:p-10 rounded-3xl border-2 border-aftras-orange shadow-sm hover:shadow-xl hover:shadow-aftras-orange/10 transition-all group bg-white"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-aftras-orange group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
                  <service.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-aftras-blue-text mb-3 md:mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-20 bg-aftras-blue-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('services_page.approach.title')}</h2>
            <p className="text-blue-200 text-sm md:text-base">{t('services_page.approach.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            {[
              { num: '01', title: t('services_page.approach.steps.0.title'), desc: t('services_page.approach.steps.0.desc') },
              { num: '02', title: t('services_page.approach.steps.1.title'), desc: t('services_page.approach.steps.1.desc') },
              { num: '03', title: t('services_page.approach.steps.2.title'), desc: t('services_page.approach.steps.2.desc') },
              { num: '04', title: t('services_page.approach.steps.3.title'), desc: t('services_page.approach.steps.3.desc') },
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-aftras-blue-text p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-aftras-orange rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 font-bold text-lg md:text-xl">
                  {item.num}
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-blue-200 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
