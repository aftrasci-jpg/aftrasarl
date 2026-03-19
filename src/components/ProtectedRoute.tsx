import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aftras-blue-text" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

// Vérifier si l'utilisateur a un profil d'entreprise complet
if (!adminOnly && (!profile || !profile.company_name || !profile.country)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profil incomplet</h2>
          <p className="text-gray-600 mb-6">Veuillez compléter votre profil d'entreprise avant d'accéder au dashboard.</p>
          <button 
            onClick={() => window.location.href = '/profile'}
            className="bg-aftras-blue-text text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
          >
            Compléter mon profil
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};