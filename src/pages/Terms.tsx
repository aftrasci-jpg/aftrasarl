import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export const Terms = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <SEO title="Conditions Générales d'Utilisation" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-6 md:mb-8">Conditions Générales d'Utilisation (CGU)</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Objet</h2>
              <p>Les présentes CGU régissent l'utilisation de la plateforme AFTRAS CI, une solution de négoce international facilitant les échanges commerciaux entre entreprises.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Services d'intermédiation</h2>
              <p>AFTRAS CI agit comme intermédiaire entre acheteurs et fournisseurs. Les contrats finaux et les paiements sont réalisés directement entre les parties concernées. AFTRAS CI ne peut être tenu responsable de l'inexécution des obligations contractuelles des tiers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Inscription et Compte</h2>
              <p>L'inscription est réservée aux entreprises dûment enregistrées. Vous êtes responsable de la confidentialité de vos identifiants et de l'exactitude des informations fournies lors de la création de votre compte.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Lettres d'Intention (LOI)</h2>
              <p>Toute LOI soumise via la plateforme doit être sérieuse et refléter un besoin réel. L'utilisateur s'engage à disposer des fonds nécessaires pour conclure la transaction si les conditions proposées sont acceptées.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation de responsabilité</h2>
              <p>AFTRAS CI s'efforce de fournir des informations précises mais ne garantit pas l'absence d'erreurs ou d'omissions. L'utilisation de la plateforme se fait sous l'entière responsabilité de l'utilisateur.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
