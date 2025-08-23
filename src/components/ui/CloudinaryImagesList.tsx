'use client';

import { useState, useEffect } from 'react';
import { Cloud, Download, RefreshCw, ChevronLeft, ChevronRight, Folder, Tag, Calendar, Image as ImageIcon } from 'lucide-react';
import SingleImageSync from './SingleImageSync';

interface CloudinaryImage {
  publicId: string;
  url: string;
  thumbnailUrl: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  folder: string;
}

interface PaginationInfo {
  nextCursor: string;
  hasMore: boolean;
  totalCount: number;
}

export default function CloudinaryImagesList() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCloudinaryImages();
  }, []);

  const fetchCloudinaryImages = async (cursor?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        max_results: '20' // Limiter à 20 images par page pour de meilleures performances
      });
      
      if (cursor) {
        params.append('next_cursor', cursor);
      }

      const response = await fetch(`/api/admin/list-cloudinary-images?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setImages(result.images);
        setPagination(result.pagination);
        setIsConfigured(true);
        
        // Extraire les dossiers uniques
        const uniqueFolders = [...new Set(result.images.map((img: CloudinaryImage) => img.folder))] as string[];
        setFolders(uniqueFolders);
      } else {
        setError(result.error || 'Erreur lors du chargement des images Cloudinary');
        setIsConfigured(false);
      }
    } catch (error) {
      setError('Erreur de connexion');
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshImages = () => {
    fetchCloudinaryImages();
    setCurrentPage(1);
  };

  const loadNextPage = () => {
    if (pagination?.hasMore && pagination.nextCursor) {
      fetchCloudinaryImages(pagination.nextCursor);
      setCurrentPage(prev => prev + 1);
    }
  };

  const loadPreviousPage = () => {
    if (currentPage > 1) {
      // Pour simplifier, on recharge depuis le début
      fetchCloudinaryImages();
      setCurrentPage(1);
    }
  };

  // Filtrer les images selon la recherche et le dossier
  const filteredImages = images.filter(image => {
    const matchesSearch = image.publicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || image.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  if (isLoading && images.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement des images Cloudinary...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cloud className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                Images Cloudinary Disponibles
              </h3>
              <p className="text-sm text-blue-600">
                {pagination?.totalCount || images.length} image(s) trouvée(s)
              </p>
            </div>
          </div>
          <button
            onClick={refreshImages}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtre par dossier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dossier
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les dossiers</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder === 'racine' ? 'Racine' : folder}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={loadPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {currentPage}
              </span>
              <button
                onClick={loadNextPage}
                disabled={!pagination?.hasMore}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message de configuration */}
      {isConfigured === false && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium mb-2">⚠️ Configuration Cloudinary Requise</p>
          <p className="text-yellow-700 text-sm mb-3">
            Pour afficher vos images Cloudinary, vous devez configurer vos variables d'environnement.
          </p>
          <div className="bg-white border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800 mb-2">Variables à ajouter dans <code>.env.local</code> :</p>
            <div className="space-y-1 text-xs text-gray-700">
              <p><code>CLOUDINARY_CLOUD_NAME=dpdk1zur0</code></p>
              <p><code>CLOUDINARY_API_KEY=votre_api_key</code></p>
              <p><code>CLOUDINARY_API_SECRET=votre_api_secret</code></p>
            </div>
          </div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm font-medium mb-2">❌ Erreur de chargement</p>
          <p className="text-red-600 text-sm mb-3">{error}</p>
          {error.includes('cloud_name') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>💡 Solution :</strong> Configurez vos variables d'environnement Cloudinary dans le fichier <code>.env.local</code>
              </p>
              <div className="mt-2 text-xs text-yellow-700">
                <p>CLOUDINARY_CLOUD_NAME=dpdk1zur0</p>
                <p>CLOUDINARY_API_KEY=votre_api_key</p>
                <p>CLOUDINARY_API_SECRET=votre_api_secret</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grille des images */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {images.length === 0 ? 'Aucune image trouvée dans Cloudinary' : 'Aucune image ne correspond aux filtres'}
          </p>
          <p className="text-sm text-gray-500">
            {images.length === 0 
              ? 'Vérifiez votre configuration Cloudinary ou ajoutez des images'
              : 'Essayez de modifier vos critères de recherche'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.publicId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Thumbnail de l'image */}
              <div className="aspect-square bg-gray-100 relative group">
                <img
                  src={image.thumbnailUrl}
                  alt={image.publicId}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    Voir l'image
                  </a>
                </div>
              </div>

              {/* Informations de l'image */}
              <div className="p-4 space-y-3">
                {/* Nom et format */}
                <div>
                  <h4 className="font-medium text-gray-900 truncate" title={image.publicId}>
                    {image.publicId.split('/').pop() || image.publicId}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {image.format.toUpperCase()} • {image.width}×{image.height}
                  </p>
                </div>

                {/* Métadonnées */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-3 h-3" />
                    <span>{image.folder === 'racine' ? 'Racine' : image.folder}</span>
                  </div>
                  
                  {image.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-3 h-3" />
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="text-gray-400">+{image.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(image.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="text-xs">
                    Taille: {(image.size / 1024).toFixed(1)} KB
                  </div>
                </div>

                {/* Bouton de synchronisation */}
                <div className="pt-2">
                  <SingleImageSync
                    cloudinaryUrl={image.url}
                    imageName={`${image.publicId.split('/').pop() || 'image'}.${image.format}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination en bas */}
      {pagination && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Affichage de {filteredImages.length} image(s) sur {pagination.totalCount}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage}
            </span>
            
            <button
              onClick={loadNextPage}
              disabled={!pagination.hasMore}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
