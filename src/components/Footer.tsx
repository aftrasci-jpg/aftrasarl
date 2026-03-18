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
            <Link to="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white">AFTRAS</span>
              <span className="text-2xl font-bold text-aftras-orange ml-1">CI</span>
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
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-aftras-orange mr-3 mt-1 flex-shrink-0" />
                <span className="text-blue-100 text-sm">Abidjan, Côte d'Ivoire / Genève, Suisse</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-aftras-orange mr-3 flex-shrink-0" />
                <span className="text-blue-100 text-sm">+225 0141 354 860</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-aftras-orange mr-3 flex-shrink-0" />
                <span className="text-blue-100 text-sm">contact@africatrading.com</span>
              </li>
            </ul>
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
