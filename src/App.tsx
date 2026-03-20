import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Catalog } from './pages/Catalog';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { CommunityManagerLogin } from './pages/CommunityManagerLogin';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LOIForm } from './pages/LOIForm';
import { Admin } from './pages/Admin';
import { CommunityManager } from './pages/CommunityManager';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ProtectedRoute } from './components/ProtectedRoute';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oups ! Une erreur est survenue</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-aftras-blue-text text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
const hasValidSupabase = Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

function SupabaseSetupGuide() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-xl w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuration Supabase Requise</h2>
          <p className="text-gray-600">Pour faire fonctionner l'application, vous devez configurer vos clés Supabase.</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">🚀</span> Étapes de configuration :
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-blue-800 text-sm">
              <li>Ouvrez les <strong>Paramètres</strong> (icône ⚙️ en haut à droite)</li>
              <li>Allez dans la section <strong>Secrets</strong></li>
              <li>Ajoutez <code>VITE_SUPABASE_URL</code> avec votre URL de projet</li>
              <li>Ajoutez <code>VITE_SUPABASE_ANON_KEY</code> avec votre clé anonyme</li>
            </ol>
          </div>
          
          <div className="text-center text-xs text-gray-400">
            L'application se reconstruira automatiquement une fois les secrets ajoutés.
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    const scroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    requestAnimationFrame(scroll);
  }, [pathname]);

  return null;
}

export default function App() {
  if (!hasValidSupabase) {
    return <SupabaseSetupGuide />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/cm-login" element={<CommunityManagerLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Protected Company Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/loi" element={<LOIForm />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={<ProtectedRoute adminOnly />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>

                  {/* Protected Community Manager Routes */}
                  <Route element={<ProtectedRoute communityManagerOnly />}>
                    <Route path="/community-manager" element={<CommunityManager />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
