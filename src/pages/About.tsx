import React from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { Target, Eye, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <SEO 
        title="À Propos | AFTRAS CI"
        description="Découvrez AFTRAS CI, votre partenaire de confiance en Côte d'Ivoire pour le négoce international, le sourcing et l'accompagnement commercial."
      />
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-aftras-blue-text text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=1920" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center relative mb-8 md:mb-10 group max-w-full"
          >
            <div className="relative px-6 py-3 md:px-12 md:py-6 rounded-full overflow-hidden shadow-2xl border border-white/30 backdrop-blur-md">
              {/* Background Image for the Badge */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-aftras-blue-text/80 to-aftras-blue-border/80" />
              
              <h1 className="relative z-10 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight whitespace-normal text-center leading-tight">
                {t('about.title')}
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm font-medium text-aftras-orange tracking-[0.2em] uppercase mb-6 md:mb-8"
          >
            {t('common.slogan')}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-4 md:mb-6">{t('about.who_are_we.title')}</h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  {t('about.who_are_we.p1')}
                </p>
                <p>
                  {t('about.who_are_we.p2')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400" alt="Team" className="rounded-2xl shadow-lg w-full" />
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400" alt="Meeting" className="rounded-2xl shadow-lg mt-8 w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Eye className="w-6 h-6 md:w-8 md:h-8 text-aftras-blue-text" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-aftras-blue-border mb-3 md:mb-4">{t('about.vision_mission.vision.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('about.vision_mission.vision.desc')}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-aftras-blue-border mb-3 md:mb-4">{t('about.vision_mission.mission.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('about.vision_mission.mission.desc')}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-aftras-blue-border mb-3 md:mb-4">{t('about.vision_mission.engagement.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('about.vision_mission.engagement.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
