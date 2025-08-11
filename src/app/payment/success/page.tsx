"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('id');
    
    if (paymentId) {
      // Ici vous pourriez faire un appel API pour récupérer les détails du paiement
      setPaymentDetails({ id: paymentId });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Carte principale */}
        <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header avec animation */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            {/* Effet de particules */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-8 left-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
            </div>
            
            {/* Icône de succès */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Paiement réussi !</h1>
              <p className="text-green-100 text-lg">Votre commande a été confirmée</p>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8 space-y-6">
            {/* Détails du paiement */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Détails de votre commande
              </h2>
              
              {paymentDetails && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Numéro de commande</span>
                    <span className="text-white font-mono bg-gray-600 px-3 py-1 rounded-lg text-sm">
                      {paymentDetails.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Statut</span>
                    <span className="text-green-400 font-semibold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Confirmé
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Date</span>
                    <span className="text-white">{new Date().toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prochaines étapes */}
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Prochaines étapes
              </h3>
              <div className="space-y-3 text-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p>Vous recevrez un email de confirmation avec tous les détails</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p>Notre équipe prépare votre commande</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p>Vous serez notifié dès que votre commande sera prête</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
                Besoin d'aide ?
              </h3>
              <p className="text-gray-300 mb-4">
                Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+33123456789"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler
                </a>
                <a
                  href="mailto:contact@restaurant.com"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-center transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-700 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
              >
                ← Retour à l'accueil
              </Link>
              
              <Link
                href="/Commande"
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Nouvelle commande
              </Link>
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Merci de votre confiance ! 🍕
          </p>
        </div>
      </div>
    </div>
  );
}
