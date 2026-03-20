import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { HeroSlider } from '../components/HeroSlider';
import { ProductSlider } from '../components/ProductSlider';
import { supabase } from '../supabase';
import { Product } from '../types';
import { Search, Handshake, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(10);
      
      if (error) {
        console.error("Error fetching featured products:", error);
      } else {
        setFeaturedProducts(data as Product[]);
      }
    };
    fetchFeatured();
  }, []);

  const steps = [
    { title: t('home.how_we_work.steps.0.title'), desc: t('home.how_we_work.steps.0.desc'), icon: Search },
    { title: t('home.how_we_work.steps.1.title'), desc: t('home.how_we_work.steps.1.desc'), icon: Handshake },
    { title: t('home.how_we_work.steps.2.title'), desc: t('home.how_we_work.steps.2.desc'), icon: ShieldCheck },
    { title: t('home.how_we_work.steps.3.title'), desc: t('home.how_we_work.steps.3.desc'), icon: Zap },
  ];

  const services = [
    { title: t('services_page.items.0.title'), desc: t('services_page.items.0.desc') },
    { title: t('services_page.items.1.title'), desc: t('services_page.items.1.desc') },
    { title: t('services_page.items.2.title'), desc: t('services_page.items.2.desc') },
    { title: t('services_page.items.3.title'), desc: t('services_page.items.3.desc') },
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="Accueil | AFTRAS CI - Négoce International & Sourcing"
        description="AFTRAS CI facilite vos échanges commerciaux internationaux. Sourcing de produits, logistique et accompagnement sur mesure en Côte d'Ivoire et à l'international."
      />
      <HeroSlider />

      {/* How we work */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-4">{t('home.how_we_work.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 md:mb-16 text-sm md:text-base">
            {t('home.how_we_work.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-aftras-orange hover:shadow-xl hover:shadow-aftras-orange/10 transition-all group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 md:w-8 md:h-8 text-aftras-blue-text" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-2">{t('home.featured_products.title')}</h2>
            <p className="text-gray-600 text-sm md:text-base">{t('home.featured_products.subtitle')}</p>
          </div>
          <Link to="/catalog" className="text-aftras-blue-text font-bold flex items-center hover:text-aftras-orange transition-colors text-sm md:text-base">
            {t('home.featured_products.view_all')} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <ProductSlider products={featuredProducts} />
      </section>

      {/* Services Summary */}
      <section className="py-12 md:py-20 bg-aftras-blue-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.services_summary.title')}</h2>
              <p className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                {t('home.services_summary.desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-aftras-orange flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-base md:text-lg mb-1">{service.title}</h4>
                      <p className="text-blue-200 text-xs md:text-sm">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/services" 
                className="inline-block w-full md:w-auto text-center mt-10 md:mt-12 bg-aftras-orange hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-aftras-orange/20"
              >
                {t('home.services_summary.cta')}
              </Link>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" 
                alt="Logistics" 
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="p-2 md:p-3 bg-orange-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-aftras-orange" />
                  </div>
                  <div>
                    <p className="text-aftras-blue-text font-bold text-xl md:text-2xl">100%</p>
                    <p className="text-gray-500 text-xs md:text-sm">{t('home.services_summary.secure_reliable')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Sourcing Section */}
      <section className="py-12 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-aftras-blue-text rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-16 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-aftras-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-aftras-orange/20 text-aftras-orange text-[10px] md:text-sm font-bold mb-6 border border-aftras-orange/30">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {t('home.custom_sourcing.subtitle')}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                  {t('home.custom_sourcing.title')}
                </h2>
                <p className="text-blue-100 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                  {t('home.custom_sourcing.desc')}
                </p>
                <Link 
                  to="/loi" 
                  className="inline-flex items-center justify-center w-full md:w-auto bg-white text-aftras-blue-text px-8 py-4 rounded-xl font-bold hover:bg-aftras-orange hover:text-white transition-all group shadow-xl"
                >
                  {t('home.custom_sourcing.cta')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400" 
                      alt="Industrial" 
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1494412574743-0192490282a9?auto=format&fit=crop&q=80&w=400" 
                      alt="Raw materials" 
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400" 
                      alt="Equipment" 
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="bg-aftras-orange p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                      <Globe className="w-12 h-12 text-white mb-4" />
                      <p className="font-bold text-white text-sm">Réseau Mondial de Sourcing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-10 md:mb-16">{t('home.why_choose_us.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transform rotate-3">
                <Globe className="w-8 h-8 md:w-10 md:h-10 text-aftras-blue-text" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{t('home.why_choose_us.items.0.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t('home.why_choose_us.items.0.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transform -rotate-3">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-aftras-orange" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{t('home.why_choose_us.items.1.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t('home.why_choose_us.items.1.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transform rotate-6">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{t('home.why_choose_us.items.2.title')}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t('home.why_choose_us.items.2.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-4 md:mb-6">{t('home.cta.title')}</h2>
          <p className="text-gray-600 text-base md:text-lg mb-8 md:mb-10">
            {t('home.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-aftras-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-aftras-orange/20">
              {t('home.cta.register')}
            </Link>
            <Link to="/login" className="bg-white text-aftras-blue-text border-2 border-aftras-blue-text px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
              {t('home.cta.login')}
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
