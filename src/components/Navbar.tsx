import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Globe, ArrowLeft, Package } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, isCommunityManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const showBackButton = location.pathname !== '/';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('common.home'), path: '/' },
    { name: t('common.about'), path: '/about' },
    { name: t('common.services'), path: '/services' },
    { name: t('common.catalog'), path: '/catalog' },
    { name: t('common.contact'), path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={() => navigate(-1)}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors text-aftras-blue-text"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://res.cloudinary.com/dnpgvhq2t/image/upload/v1773972011/logaft_djawlr.jpg" 
                alt="Logo" 
                className="h-12 w-auto object-contain mr-3"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-aftras-blue-text">AFTRAS</span>
                  <span className="text-2xl font-bold text-aftras-orange ml-1">CI</span>
                </div>
                <span className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-500 -mt-0.5 md:-mt-1 tracking-wider uppercase whitespace-nowrap">
                  {t('common.slogan')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-aftras-orange",
                    isActive ? "text-aftras-blue-text border-b-2 border-aftras-blue-text" : "text-gray-600"
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-sm font-bold text-aftras-blue-text hover:text-aftras-orange transition-colors"
            >
              <Globe className="w-4 h-4 mr-1" />
              {i18n.language.toUpperCase().substring(0, 2)}
            </button>

            {user ? (
              <div className="flex items-center space-x-6">
                <NotificationBell />
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center text-sm font-medium text-aftras-blue-text hover:text-aftras-orange"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    {t('common.admin')}
                  </Link>
                )}
                {isCommunityManager && (
                  <Link
                    to="/community-manager"
                    className="flex items-center text-sm font-medium text-aftras-blue-text hover:text-aftras-orange"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    {t('common.cm')}
                  </Link>
                )}
                {!isAdmin && !isCommunityManager && (
                  <Link
                    to="/dashboard"
                    className="flex items-center text-sm font-medium text-aftras-blue-text hover:text-aftras-orange"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    {t('common.dashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-aftras-blue-text"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-aftras-blue-text text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
                >
                  {t('navbar.create_account')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && <NotificationBell />}
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-sm font-bold text-aftras-blue-text"
            >
              <Globe className="w-4 h-4 mr-1" />
              {i18n.language.toUpperCase().substring(0, 2)}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden relative z-50 shadow-lg"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block px-4 py-3 rounded-xl text-base font-bold transition-all",
                        isActive 
                          ? "bg-aftras-blue-text text-white shadow-md transform scale-[1.02]" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-aftras-blue-text"
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-2">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-bold text-aftras-blue-text hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 mr-3" />
                          {t('common.admin')}
                        </Link>
                      )}
                      {isCommunityManager && (
                        <Link
                          to="/community-manager"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-bold text-aftras-blue-text hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-5 h-5 mr-3" />
                          {t('common.cm')}
                        </Link>
                      )}
                      {!isAdmin && !isCommunityManager && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-bold text-aftras-blue-text hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 mr-3" />
                          {t('common.dashboard')}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        {t('common.logout')}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {t('common.login')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold bg-aftras-blue-text text-white hover:bg-opacity-90 shadow-md transition-all"
                      >
                        {t('navbar.create_account')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
