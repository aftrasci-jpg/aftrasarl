import React, { useState, useEffect } from 'react';
// Logo moved to public/

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleLanguage = async () => {
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
            <Link to="/" className="flex-shrink-0 flex flex-col">
              <div className="flex items-center mb-1">
                <img 
                  src="https://res.cloudinary.com/dnpgvhq2t/image/upload/v1773972011/logaft_djawlr.jpg" 
                  alt="AFTRAS CI Logo" 
                  className="h-10 w-auto sm:h-12 mr-2 object-contain flex-shrink-0"
                />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-aftras-blue-text">AFTRAS</span>
                    <span className="text-2xl font-bold text-aftras-orange ml-1">CI</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-500 -mt-1 tracking-wider uppercase">
                {t('common.slogan')}
              </span>
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
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center text-sm font-medium text-aftras-blue-text hover:text-aftras-orange"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  {isAdmin ? t('common.admin') : t('common.dashboard')}
                </Link>
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
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive ? "bg-blue-50 text-aftras-blue-text" : "text-gray-600 hover:bg-gray-50 hover:text-aftras-blue-text"
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-aftras-blue-text hover:bg-gray-50"
                >
                  {isAdmin ? t('common.admin') : t('common.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-aftras-blue-text hover:bg-gray-50"
                >
                  {t('navbar.create_account')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
