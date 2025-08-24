'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Image as ImageIcon, RefreshCw, ExternalLink, Download } from 'lucide-react';

interface LocalImage {
  name: string;
  path: string;
  size?: number;
  lastModified?: Date | string;
}

export default function LocalImagesDisplay() {
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocalImages();
  }, []);

  const fetchLocalImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/list-local-images');
      const result = await response.json();
      
      if (result.success) {
        setLocalImages(result.images);
      } else {
        setError(result.error || 'Erreur lors du chargement des images');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshImages = () => {
    fetchLocalImages();
  };

  // Fonction utilitaire pour formater la date de manière sécurisée
  const formatDate = (dateValue: Date | string | undefined): string => {
    if (!dateValue) return 'Date inconnue';
    
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-300">Chargement des images locales...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300">
            {localImages.length} image(s) synchronisée(s) dans <code className="bg-gray-700 px-2 py-1 rounded text-sm">/public/images/uploads/</code>
          </span>
        </div>
        <button
          onClick={refreshImages}
          className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {localImages.length === 0 ? (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Aucune image synchronisée</p>
          <p className="text-sm text-gray-500">
            Utilisez le nouveau gestionnaire Git pour ajouter des images
          </p>
          <a
            href="/admin/git-images"
            className="inline-flex items-center mt-3 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            🚀 Gestionnaire Git
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localImages.map((image, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {image.size ? `${(image.size / 1024).toFixed(1)} KB` : 'Taille inconnue'}
                  </p>
                </div>
              </div>
              
                             <div className="text-xs text-gray-400 space-y-1 mb-3">
                 <p><strong>Chemin :</strong> <code className="bg-gray-700 px-1 rounded">{image.path}</code></p>
                 {image.lastModified && (
                   <p><strong>Modifié :</strong> {formatDate(image.lastModified)}</p>
                 )}
               </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Synchronisée localement
                </div>
                <a
                  href={`/images/uploads/${image.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  title="Voir l'image"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="font-medium text-blue-300 mb-2">ℹ️ Informations</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Les images synchronisées sont stockées dans <code className="bg-blue-500/20 px-1 rounded">/public/images/uploads/</code></li>
          <li>• Elles sont accessibles via le composant <code className="bg-blue-500/20 px-1 rounded">MongoImage</code></li>
          <li>• Utilisez le bouton {'"'}Actualiser{'"'} pour voir les nouvelles images synchronisées</li>
          <li>• Les images sont servies localement pour de meilleures performances</li>
        </ul>
      </div>
    </div>
  );
}
