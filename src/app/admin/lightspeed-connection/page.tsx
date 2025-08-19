'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import StrictAdminProtected from '../../components/StrictAdminProtected';
import { 
  ArrowLeft, 
  CheckCircle, 
  Wifi, 
  Settings,
  Globe,
  Key,
  Database,
  Loader2
} from 'lucide-react';

export default function LightspeedConnectionPage() {
  const { data: _session } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour générer un token CSRF aléatoire
  const generateRandomCSRFToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Configuration OAuth pour Lightspeed
      const clientId = process.env.NEXT_PUBLIC_LIGHTSPEED_CLIENT_ID || "VOTRE_CLIENT_ID";
      const redirectUri = process.env.NEXT_PUBLIC_LIGHTSPEED_REDIRECT_URI || "https://votre-vps.com/oauth/callback";
      const scope = "read+write";
      const state = generateRandomCSRFToken();

      // Construire l'URL OAuth exacte comme spécifié
      const authUrl = `https://cloud.lightspeedapp.com/oauth/authorize.php?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;

      // Sauvegarder le state pour la sécurité
      localStorage.setItem('lightspeed_oauth_state', state);
      
      // Rediriger directement vers Lightspeed
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur lors de la redirection OAuth:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'initialisation de la connexion OAuth avec Lightspeed.');
      setIsConnecting(false);
    }
  };

  const renderAuthStep = () => (
    <div className="space-y-8">
      {/* Header avec logo */}
      <div className="text-center">
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="bg-white p-3 rounded-xl">
            <Image
              src="/lightspeedlogo.png"
              alt="Lightspeed"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Connexion Lightspeed</h1>
            <p className="text-gray-400">Synchronisez votre POS avec Delice Wand</p>
          </div>
        </div>
      </div>

      {/* Avantages de la connexion */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          Avantages de la connexion
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Database className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">Synchronisation automatique</h4>
              <p className="text-gray-400 text-sm">Vos produits et prix sont automatiquement mis à jour</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">Gestion centralisée</h4>
              <p className="text-gray-400 text-sm">Gérez tout depuis votre interface Lightspeed</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-purple-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">Multi-canal</h4>
              <p className="text-gray-400 text-sm">Vendez en ligne et en magasin avec les mêmes données</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Key className="w-5 h-5 text-orange-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">Sécurisé</h4>
              <p className="text-gray-400 text-sm">Connexion OAuth2 sécurisée et cryptée</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration de la synchronisation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Configuration de la synchronisation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <h4 className="text-white font-medium">Données à synchroniser</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300 text-sm">Produits et catalogue</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300 text-sm">Inventaire et stocks</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300 text-sm">Commandes en temps réel</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300 text-sm">Clients et contacts</span>
              </label>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-medium">Informations du restaurant</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div><span className="text-gray-400">ID:</span> RESTAURANT_001</div>
              <div><span className="text-gray-400">Nom:</span> Delice Wand</div>
              <div><span className="text-gray-400">Fuseau:</span> Europe/Paris</div>
              <div><span className="text-gray-400">Devise:</span> EUR</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Ces paramètres seront envoyés au serveur VPS pour configurer automatiquement la synchronisation
        </p>
      </div>

      {/* Étapes de connexion */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Étapes de connexion</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-gray-300">Authentification avec vos identifiants Lightspeed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-400">Autorisation des permissions d&apos;accès</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-400">Configuration automatique de la synchronisation</span>
          </div>
        </div>
      </div>

      {/* Bouton de connexion */}
      <div className="text-center">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-white hover:bg-gray-100 text-gray-900 py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-3 border-2 border-gray-300 hover:border-gray-400 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-semibold text-lg">Connexion en cours...</span>
            </>
          ) : (
            <>
              <Image
                src="/lightspeedlogo.png"
                alt="Lightspeed"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="font-semibold text-lg">Se connecter à Lightspeed</span>
            </>
          )}
        </button>
        
        <p className="text-sm text-gray-400 mt-4">
          Vous serez redirigé vers le portail OAuth Lightspeed pour vous authentifier en toute sécurité
        </p>
      </div>
    </div>
  );



  const renderContent = () => {
    return renderAuthStep();
  };

  return (
    <StrictAdminProtected>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                href="/admin?tab=settings"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour aux paramètres</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Connexion POS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            {renderContent()}
          </div>
        </div>
      </div>
    </StrictAdminProtected>
  );
}
