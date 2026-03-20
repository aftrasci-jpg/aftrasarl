import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export const Privacy = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <SEO title="Politique de Confidentialité" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-aftras-blue-border mb-6 md:mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Collecte des données</h2>
              <p>Nous collectons les informations que vous nous fournissez lors de la création de votre compte entreprise, notamment le nom de l'entreprise, l'adresse email professionnelle, le numéro de téléphone et les détails de vos demandes d'achat (LOI).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Utilisation des données</h2>
              <p>Vos données sont utilisées exclusivement pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gérer votre compte et vos demandes de sourcing.</li>
                <li>Vous contacter concernant l'évolution de vos dossiers.</li>
                <li>Améliorer nos services d'intermédiation commerciale.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Protection des données</h2>
              <p>AFTRAS CI met en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification ou suppression.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Vos droits</h2>
              <p>Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits en nous contactant via notre formulaire de contact.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
