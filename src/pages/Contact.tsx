import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, Globe, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    region: 'africa',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const representatives = [
    {
      region: t('footer.contacts.africa.region'),
      name: 'Mr. Evariste Cyr Major Kahiba GNONSKAN',
      whatsapp: '+225 0141 354 860',
      icon: Globe
    },
    {
      region: t('footer.contacts.asia.region'),
      name: 'Mr. Quevin ZOH',
      whatsapp: '+91 96259 16929',
      icon: Globe
    },
    {
      region: t('footer.contacts.europe.region'),
      name: 'Mme. Merfeuh NGUEYEP',
      whatsapp: '+41 77 920 83 18',
      icon: Globe
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-white">
      <SEO 
        title="Contactez-nous | AFTRAS CI"
        description="Besoin d'un sourcing spécifique ou d'un accompagnement commercial ? Contactez nos représentants en Afrique, Asie et Europe pour vos projets de négoce international."
      />
      {/* Hero */}
      <section className="py-24 bg-aftras-blue-text text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('contact_page.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            {t('contact_page.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Representatives List */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-2xl font-bold text-aftras-blue-border mb-8">{t('contact_page.offices')}</h2>
              {representatives.map((rep, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <rep.icon className="w-6 h-6 text-aftras-blue-text" />
                    </div>
                    <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">{rep.region}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{rep.name}</h3>
                    <a 
                      href={`https://wa.me/${rep.whatsapp.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-aftras-blue-text font-bold hover:text-aftras-orange transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      {t('contact_page.form.whatsapp_label')} {rep.whatsapp}
                    </a>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-aftras-blue-border mb-8">{t('contact_page.form_title')}</h2>
                
                {success ? (
                  <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">{t('contact_page.success_title')}</h3>
                    <p className="text-green-700">{t('contact_page.success_desc')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.company')}</label>
                        <input
                          required
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.name')}</label>
                        <input
                          required
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.email')}</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.phone')}</label>
                        <input
                          required
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.region')}</label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                      >
                        <option value="africa">{t('contact_page.regions.africa')}</option>
                        <option value="asia">{t('contact_page.regions.asia')}</option>
                        <option value="europe">{t('contact_page.regions.europe')}</option>
                        <option value="other">{t('contact_page.regions.other')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact_page.form.message')}</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                      />
                    </div>
                      <button
                        type="submit"
                        className="w-full bg-aftras-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg shadow-aftras-orange/20"
                      >
                        <Send className="w-5 h-5 mr-2" /> {t('contact_page.form.submit')}
                      </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
