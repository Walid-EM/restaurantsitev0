import AdminNavigation from '@/components/ui/AdminNavigation';
import Link from 'next/link';
import { Image, Upload, RefreshCw, Eye, Settings, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminMigrateImagesPage() {
  const migrationSteps = [
    {
      step: 1,
      title: 'Configuration Cloudinary',
      description: 'Configurer les variables d\'environnement et le webhook',
      status: 'pending',
      icon: Settings,
      details: [
        'Ajouter CLOUDINARY_CLOUD_NAME',
        'Ajouter CLOUDINARY_API_KEY',
        'Ajouter CLOUDINARY_API_SECRET',
        'Configurer le webhook Cloudinary'
      ]
    },
    {
      step: 2,
      title: 'Installation des Dépendances',
      description: 'Installer le package Cloudinary',
      status: 'pending',
      icon: Upload,
      details: [
        'Exécuter npm install cloudinary',
        'Vérifier l\'installation'
      ]
    },
    {
      step: 3,
      title: 'Test d\'Upload',
      description: 'Tester l\'upload vers Cloudinary',
      status: 'pending',
      icon: Image,
      details: [
        'Aller sur /admin/test-images',
        'Uploader une image de test',
        'Vérifier qu\'elle apparaît dans MongoDB'
      ]
    },
    {
      step: 4,
      title: 'Test de Synchronisation',
      description: 'Tester la synchronisation locale',
      status: 'pending',
      icon: RefreshCw,
      details: [
        'Cliquer sur "Synchroniser et Rebuilder"',
        'Vérifier que l\'image apparaît dans /public/images/uploads/',
        'Vérifier le rebuild Vercel'
      ]
    },
    {
      step: 5,
      title: 'Test d\'Affichage',
      description: 'Tester l\'affichage avec MongoImage',
      status: 'pending',
      icon: Eye,
      details: [
        'Utiliser MongoImage avec le bon filePath',
        'Vérifier que l\'image s\'affiche correctement',
        'Tester sur différentes pages'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🚀 Migration vers Cloudinary
          </h1>
          <p className="text-xl text-gray-600">
            Guide étape par étape pour migrer vers le nouveau système d'images
          </p>
        </div>

        {/* Aperçu de la migration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">📋 Aperçu de la Migration</h2>
          <p className="text-blue-700 mb-4">
            Cette migration vous permet de passer du système d'images local vers Cloudinary avec synchronisation automatique.
            Suivez les étapes ci-dessous dans l'ordre pour une migration réussie.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📤</div>
              <div className="font-medium">Upload Cloudinary</div>
              <div className="text-blue-600">Images stockées dans le cloud</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium">Synchronisation</div>
              <div className="text-blue-600">Automatique + manuelle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="font-medium">Affichage Local</div>
              <div className="text-blue-600">Performance optimisée</div>
            </div>
          </div>
        </div>

        {/* Étapes de migration */}
        <div className="space-y-4">
          {migrationSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className={`border rounded-lg p-6 ${getStatusColor(step.status)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        Étape {step.step}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium text-gray-700 mb-2">Actions à effectuer :</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {step.details.map((detail, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/test-images"
              className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Image className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-800">Tester les Images</div>
                <div className="text-sm text-blue-600">Vérifier le système</div>
              </div>
            </Link>
            
            <Link
              href="/admin/images"
              className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <RefreshCw className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-green-800">Gérer les Images</div>
                <div className="text-sm text-green-600">Upload et sync</div>
              </div>
            </Link>
            
            <Link
              href="/admin/cloudinary-preview"
              className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Eye className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-purple-800">Prévisualiser</div>
                <div className="text-sm text-purple-600">Voir Cloudinary</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📚 Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Guides disponibles :</h3>
              <ul className="space-y-1">
                <li>• <code>CLOUDINARY_ARCHITECTURE.md</code> - Architecture technique</li>
                <li>• <code>CLOUDINARY_USAGE_GUIDE.md</code> - Guide d'utilisation</li>
                <li>• <code>migration-cloudinary-guide.md</code> - Guide de migration complet</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Variables d'environnement :</h3>
              <ul className="space-y-1">
                <li>• <code>CLOUDINARY_CLOUD_NAME</code></li>
                <li>• <code>CLOUDINARY_API_KEY</code></li>
                <li>• <code>CLOUDINARY_API_SECRET</code></li>
                <li>• <code>VERCEL_DEPLOY_HOOK</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Retour au dashboard */}
        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
