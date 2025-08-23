'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import MongoImage from './MongoImage';

interface AdminImageUploadProps {
  currentImage?: string;
  currentImageId?: string;
  onImageChange: (imageData: { imageId: string; filePath: string; originalName: string }) => void;
  className?: string;
  label?: string;
  required?: boolean;
}

interface UploadedImage {
  _id: string;  // MongoDB utilise _id
  id?: string;  // Compatibilité
  filename: string;
  originalName: string;
  filePath: string;
  size: number;
  uploadedAt: string;
}

export default function AdminImageUpload({
  currentImage,
  currentImageId,
  onImageChange,
  className = '',
  label = 'Image',
  required = false
}: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger toutes les images au démarrage
  useEffect(() => {
    loadAllImages();
  }, []);

  const loadAllImages = async () => {
    setIsLoadingImages(true);
    try {
      console.log('🔄 Chargement des images...');
      const response = await fetch('/api/images?limit=100');
      const result = await response.json();
      
      console.log('📡 Réponse API images:', result);
      
      if (result.success) {
        console.log('✅ Images chargées:', result.images.length);
        setUploadedImages(result.images);
      } else {
        console.error('❌ Erreur lors du chargement des images:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur de connexion lors du chargement des images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ type: 'error', message: 'Veuillez sélectionner un fichier image valide' });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'Le fichier est trop volumineux (max 5MB)' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newImage = result.image;
        setUploadedImages(prev => [newImage, ...prev]);
        setUploadStatus({ type: 'success', message: 'Image uploadée avec succès !' });
        
        // Sélectionner automatiquement la nouvelle image
        onImageChange({
          imageId: newImage.id,
          filePath: newImage.filePath,
          originalName: newImage.originalName
        });
        
        // Fermer le sélecteur d'images
        setShowImageSelector(false);
        
        // Réinitialiser l'input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Recharger la liste complète des images
        await loadAllImages();
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Erreur lors de l\'upload' });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadStatus({ type: 'error', message: 'Erreur de connexion lors de l\'upload' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Simuler un changement d'input file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          handleFileUpload({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }
  };

  const selectExistingImage = (image: UploadedImage) => {
    onImageChange({
      imageId: image._id || image.id || '',
      filePath: image.filePath,
      originalName: image.originalName
    });
    setShowImageSelector(false);
  };

  const removeCurrentImage = () => {
    onImageChange({
      imageId: '',
      filePath: '',
      originalName: ''
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Bouton pour ouvrir le sélecteur d'images */}
        <button
          type="button"
          onClick={() => setShowImageSelector(true)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ImageIcon className="w-4 h-4 mr-1.5" />
          Sélectionner
        </button>
      </div>

      {/* Image actuelle */}
      {currentImage && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Image actuellement sélectionnée :</h4>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                <MongoImage
                  imageId={currentImageId || ''}
                  filePath={currentImage}
                  alt="Image actuelle"
                  className="w-full h-full object-contain"
                  fallback={
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  }
                />
              </div>
              
              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={removeCurrentImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Supprimer l'image sélectionnée"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {currentImage.split('/').pop() || 'Image'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>ID :</strong> {currentImageId || 'Non défini'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Chemin :</strong> {currentImage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zone d'upload rapide */}
      {!currentImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Glissez-déposez votre image ici
              </h3>
              <p className="text-gray-500">
                ou cliquez pour sélectionner un fichier
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="quick-upload"
            />
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Upload en cours...' : 'Sélectionner une image'}
            </motion.button>
            
            <p className="text-sm text-gray-400">
              Formats supportés: JPG, PNG, GIF, WebP • Taille max: 5MB
            </p>
          </div>
        </motion.div>
      )}

      {/* Messages de statut */}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-md text-sm ${
            uploadStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {uploadStatus.message}
        </motion.div>
      )}

      {/* Modal de sélection d'images */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Sélectionner une image
              </h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Upload de nouvelle image */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Uploader une nouvelle image</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="modal-upload"
                  />
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Upload en cours...' : 'Sélectionner une image'}
                  </motion.button>
                </div>
              </div>

              {/* Images existantes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Images disponibles</h4>
                  <button
                    onClick={loadAllImages}
                    disabled={isLoadingImages}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingImages ? 'Chargement...' : 'Actualiser'}
                  </button>
                </div>
                
                {isLoadingImages ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                    <p>Chargement des images...</p>
                  </div>
                                 ) : uploadedImages.length > 0 ? (
                                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {uploadedImages.map((image, index) => (
                        <motion.div
                          key={`${image._id || image.id}-${index}`}
                          whileHover={{ scale: 1.05 }}
                          className="relative cursor-pointer group"
                          onClick={() => selectExistingImage(image)}
                        >
                          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-colors">
                            <MongoImage
                              imageId={image._id || image.id || ''}
                              filePath={image.filePath}
                              alt={image.originalName}
                              className="w-full h-full object-contain p-2"
                              fallback={
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              }
                            />
                            {/* Overlay sur l'image seulement */}
                            <div className="absolute inset-0 bg-black/10 bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center pointer-events-none">
                              <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 truncate text-center" title={image.originalName}>
                            {image.originalName}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Aucune image disponible</p>
                    <p className="text-sm">Uploadez votre première image ci-dessus</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowImageSelector(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
