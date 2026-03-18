import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, Globe } from 'lucide-react';

const representatives = [
  {
    region: 'Afrique',
    name: 'Mr. Evariste Cyr Major Kahiba GNONSKAN',
    whatsapp: '+225 0141 354 860',
    icon: Globe
  },
  {
    region: 'Asie',
    name: 'Mr. Quevin ZOH',
    whatsapp: '+91 96259 16929',
    icon: Globe
  },
  {
    region: 'Europe',
    name: 'Mme. Merfeuh NGUEYEP',
    whatsapp: '+41 77 920 83 18',
    icon: Globe
  }
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    region: 'Afrique',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 bg-aftras-blue-text text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Contactez nos représentants
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Pour toute demande ou assistance, contactez le représentant dans votre région.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Representatives List */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-2xl font-bold text-aftras-blue-border mb-8">Nos Bureaux Régionaux</h2>
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
                    WhatsApp : {rep.whatsapp}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-aftras-blue-border mb-8">Formulaire de contact rapide</h2>
                
                {success ? (
                  <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">Message envoyé !</h3>
                    <p className="text-green-700">Merci de nous avoir contactés. Un représentant prendra contact avec vous très prochainement.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom de l'entreprise</label>
                        <input
                          required
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom du contact</label>
                        <input
                          required
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone / WhatsApp</label>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">Région concernée</label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aftras-blue-text outline-none"
                      >
                        <option value="Afrique">Afrique</option>
                        <option value="Asie">Asie</option>
                        <option value="Europe">Europe</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Votre message</label>
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
                        <Send className="w-5 h-5 mr-2" /> Envoyer le message
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

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
