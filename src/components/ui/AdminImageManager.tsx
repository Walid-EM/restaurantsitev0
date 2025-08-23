'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Trash2, Eye, Plus } from 'lucide-react';
import MongoImage from './MongoImage';

interface AdminImage {
  _id: string;
  filename: string;
  originalName: string;
  filePath: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export default function AdminImageManager() {
  const [images, setImages] = useState<AdminImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setImages(data.images || []);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedImages.length} image(s) ?`)) {
      return;
    }

    try {
      const deletePromises = selectedImages.map(id => 
        fetch(`/api/images/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      setSelectedImages([]);
      fetchImages();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.filename.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || image.contentType.startsWith(filterType);
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement des images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Images</h2>
          <p className="text-gray-600">
            {images.length} image(s) au total • {selectedImages.length} sélectionnée(s)
          </p>
        </div>
        
        <div className="flex space-x-3">
          {selectedImages.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ({selectedImages.length})</span>
            </button>
          )}
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtre par type */}
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/gif">GIF</option>
              <option value="image/webp">WebP</option>
              <option value="image/svg">SVG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des images */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Aucune image trouvée</p>
          <p className="text-sm">Essayez de modifier vos filtres ou ajoutez une nouvelle image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Checkbox de sélection */}
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image._id)}
                  onChange={() => handleImageSelection(image._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <MongoImage
                  imageId={image._id}
                  filePath={image.filePath}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-8 h-8" />
                    </div>
                  }
                />
              </div>

              {/* Informations */}
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-gray-800 truncate" title={image.originalName}>
                  {image.originalName}
                </h3>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Type: {image.contentType.split('/')[1].toUpperCase()}</p>
                  <p>Taille: {formatFileSize(image.size)}</p>
                  <p>Uploadé: {formatDate(image.uploadedAt)}</p>
                </div>

                {/* Actions rapides */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => window.open(image.filePath, '_blank')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs transition-colors"
                    title="Voir l'image"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Voir
                  </button>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = image.filePath;
                      link.download = image.originalName;
                      link.click();
                    }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-3 h-3 inline mr-1" />
                    DL
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination ou "Charger plus" */}
      {filteredImages.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-600">
            Affichage de {filteredImages.length} image(s) sur {images.length} total
          </p>
        </div>
      )}
    </div>
  );
}









