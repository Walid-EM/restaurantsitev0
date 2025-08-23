import Link from 'next/link';
import { Image, Upload, RefreshCw, Eye, Settings } from 'lucide-react';

export default function AdminImagesDashboardPage() {
  const adminFeatures = [
    {
      title: 'Gestion des Images',
      description: 'Upload, synchronisation et gestion des images Cloudinary',
      icon: Image,
      href: '/admin/images',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Prévisualisation Cloudinary',
      description: 'Voir les images directement depuis Cloudinary (admin uniquement)',
      icon: Eye,
      href: '/admin/cloudinary-preview',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Configuration',
      description: 'Paramètres et configuration du système',
      icon: Settings,
      href: '/admin/setup',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Gestion des Images
        </h1>
        <p className="text-xl text-gray-600">
          Administration complète du système Cloudinary
        </p>
      </div>

      {/* Section Images */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <Image className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fonctionnalités</h2>
            <p className="text-gray-600">Système Cloudinary avec synchronisation locale</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group block"
              >
                <div className={`${feature.color} ${feature.hoverColor} transition-all duration-200 rounded-lg p-6 text-white transform group-hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-90">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Informations importantes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Architecture des Images</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Upload</strong> : Directement vers Cloudinary</li>
            <li>• <strong>Synchronisation</strong> : Automatique via webhook + manuelle via bouton admin</li>
            <li>• <strong>Affichage public</strong> : Uniquement depuis les images synchronisées localement</li>
            <li>• <strong>Prévisualisation admin</strong> : Directement depuis Cloudinary</li>
          </ul>
        </div>
      </div>

      {/* Section Statut */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Statut du Système</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-800 font-medium">Images Cloudinary</span>
            </div>
            <p className="text-sm text-green-600 mt-1">Système opérationnel</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-green-800 font-medium">Synchronisation</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">Webhook + manuel</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-purple-800 font-medium">Affichage</span>
            </div>
            <p className="text-sm text-purple-600 mt-1">Local uniquement</p>
          </div>
        </div>
      </div>

      {/* Section Actions Rapides */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/images"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Synchroniser les Images
          </Link>
          
          <Link
            href="/admin/cloudinary-preview"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser Cloudinary
          </Link>
          
          <Link
            href="/admin/setup"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Link>
        </div>
      </div>
    </div>
  );
}
