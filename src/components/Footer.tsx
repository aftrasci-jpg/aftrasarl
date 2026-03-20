import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-aftras-blue-text text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="mb-6 flex items-center group">
              <div className="bg-white p-1.5 rounded-lg mr-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src="https://res.cloudinary.com/dnpgvhq2t/image/upload/v1773972011/logaft_djawlr.jpg" 
                  alt="Logo" 
                  className="h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-white">AFTRAS</span>
                  <span className="text-2xl font-bold text-aftras-orange ml-1">CI</span>
                </div>
                <span className="text-[10px] font-medium text-blue-200 -mt-1 tracking-wider uppercase">
                  {t('common.slogan')}
                </span>
              </div>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              {t('footer.company_desc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-aftras-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-aftras-orange transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-aftras-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">{t('footer.quick_links')}</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-blue-100 hover:text-aftras-orange transition-colors">{t('common.home')}</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-aftras-orange transition-colors">{t('common.about')}</Link></li>
              <li><Link to="/services" className="text-blue-100 hover:text-aftras-orange transition-colors">{t('common.services')}</Link></li>
              <li><Link to="/catalog" className="text-blue-100 hover:text-aftras-orange transition-colors">{t('common.catalog')}</Link></li>
              <li><Link to="/contact" className="text-blue-100 hover:text-aftras-orange transition-colors">{t('common.contact')}</Link></li>
              <li className="pt-2 border-t border-white/10">
                <Link to="/admin-login" className="text-xs font-medium text-blue-300 hover:text-aftras-orange transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {t('footer.admin_login')}
                </Link>
              </li>
              <li>
                <Link to="/cm-login" className="text-xs font-medium text-blue-300 hover:text-aftras-orange transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  {t('footer.cm_login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">{t('footer.our_services')}</h3>
            <ul className="space-y-4">
              <li className="text-blue-100">{t('services_page.items.0.title')}</li>
              <li className="text-blue-100">{t('services_page.items.1.title')}</li>
              <li className="text-blue-100">{t('services_page.items.2.title')}</li>
              <li className="text-blue-100">{t('services_page.items.3.title')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">{t('footer.contact')}</h3>
            <div className="space-y-6">
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">{t('contact_page.regions.africa')}</p>
                <p className="text-white text-sm font-medium">Mr. Evariste Cyr Major Kahiba GNONSKAN</p>
                <a href="https://wa.me/2250141354860" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> {t('contact_page.form.whatsapp_label')} +225 0141 354 860
                </a>
                <a href="mailto:kahibacyr@gmail.com" className="text-blue-300 text-[10px] hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-2" /> kahibacyr@gmail.com
                </a>
              </div>
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">{t('contact_page.regions.asia')}</p>
                <p className="text-white text-sm font-medium">Mr. Quevin ZOH</p>
                <a href="https://wa.me/919625916929" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> {t('contact_page.form.whatsapp_label')} +91 96259 16929
                </a>
                <a href="mailto:zohquevin77@gmail.com" className="text-blue-300 text-[10px] hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-2" /> zohquevin77@gmail.com
                </a>
              </div>
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">{t('contact_page.regions.europe')}</p>
                <p className="text-white text-sm font-medium">Mme. Merfeuh NGUEYEP</p>
                <a href="https://wa.me/41779208318" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> {t('contact_page.form.whatsapp_label')} +41 77 920 83 18
                </a>
                <a href="mailto:rbbsucces@gmail.com" className="text-blue-300 text-[10px] hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-2" /> rbbsucces@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/privacy" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors">Politique de Confidentialité</Link>
            <Link to="/terms" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors">Conditions Générales</Link>
          </div>
          <p className="text-blue-200 text-xs">
            &copy; {new Date().getFullYear()} Africa Trading Solutions Côte d'Ivoire SARL. {t('common.all_rights_reserved')}
          </p>
          <p className="text-blue-300 text-[10px] mt-2 italic">
            {t('common.footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};
