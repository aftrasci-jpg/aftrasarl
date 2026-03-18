import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Facebook, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-aftras-blue-text text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex flex-col mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">AFTRAS</span>
                <span className="text-2xl font-bold text-aftras-orange ml-1">CI</span>
              </div>
              <span className="text-[10px] font-medium text-blue-200 -mt-1 tracking-wider uppercase">
                Transparence-Fiabilité-Croissance
              </span>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Africa Trading Solutions Côte d'Ivoire SARL. Votre partenaire de négoce international fiable. Nous facilitons les échanges commerciaux entre l'Afrique et le reste du monde.
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
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">Liens Rapides</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-blue-100 hover:text-aftras-orange transition-colors">Accueil</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-aftras-orange transition-colors">À propos</Link></li>
              <li><Link to="/services" className="text-blue-100 hover:text-aftras-orange transition-colors">Nos Services</Link></li>
              <li><Link to="/catalog" className="text-blue-100 hover:text-aftras-orange transition-colors">Catalogue Produits</Link></li>
              <li><Link to="/contact" className="text-blue-100 hover:text-aftras-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">Nos Services</h3>
            <ul className="space-y-4">
              <li className="text-blue-100">Recherche de Fournisseurs</li>
              <li className="text-blue-100">Négociation Commerciale</li>
              <li className="text-blue-100">Intermédiation</li>
              <li className="text-blue-100">Logistique & Suivi</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2">Contact</h3>
            <div className="space-y-6">
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">Afrique</p>
                <p className="text-white text-sm font-medium">Mr. Evariste Cyr Major Kahiba GNONSKAN</p>
                <a href="https://wa.me/2250141354860" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> WhatsApp : +225 0141 354 860
                </a>
              </div>
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">Asie</p>
                <p className="text-white text-sm font-medium">Mr. Quevin ZOH</p>
                <a href="https://wa.me/919625916929" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> WhatsApp : +91 96259 16929
                </a>
              </div>
              <div>
                <p className="text-aftras-orange font-bold text-xs uppercase tracking-wider mb-1">Europe</p>
                <p className="text-white text-sm font-medium">Mme. Merfeuh NGUEYEP</p>
                <a href="https://wa.me/41779208318" className="text-blue-200 text-xs hover:text-aftras-orange transition-colors flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-2" /> WhatsApp : +41 77 920 83 18
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-blue-200 text-xs">
            &copy; {new Date().getFullYear()} Africa Trading Solutions Côte d'Ivoire SARL. Tous droits réservés.
          </p>
          <p className="text-blue-300 text-[10px] mt-2 italic">
            AFTRAS CI agit comme intermédiaire. Les contrats et paiements sont réalisés directement entre les parties.
          </p>
        </div>
      </div>
    </footer>
  );
};
