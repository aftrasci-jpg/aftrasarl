import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LOIForm } from './pages/LOIForm';
import { Admin } from './pages/Admin';
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

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <AuthProvider>
          <Router>
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
