'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import MongoImage from './MongoImage';

interface UploadedImage {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;        // Chemin local ou Git
  gitPath?: string;        // Nouveau champ pour Git
  size: number;
  uploadedAt: string;
}

export default function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Mise à jour avec les nouveaux champs
        const newImage = {
          ...result.image,
          gitPath: result.image.gitPath
        };
        
        setUploadedImages(prev => [newImage, ...prev]);
        setUploadStatus({ type: 'success', message: 'Image uploadée avec succès ! Utilisez le gestionnaire Git pour l\'upload direct vers Git.' });
        
        // Réinitialiser l'input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Upload d&apos;Images Dynamique
        </h1>
        <p className="text-gray-600">
          Glissez-déposez ou sélectionnez des images pour les stocker dans MongoDB
        </p>
      </motion.div>

      {/* Zone d'upload */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl text-gray-400 mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700">
            Glissez-déposez votre image ici
          </h3>
          <p className="text-gray-500">
            ou cliquez pour sélectionner un fichier
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Upload en cours...' : 'Sélectionner une image'}
          </motion.button>
          
          <p className="text-sm text-gray-400">
            Formats supportés: JPG, PNG, GIF, WebP • Taille max: 5MB
          </p>
        </div>
      </motion.div>

      {/* Messages de statut */}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            uploadStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {uploadStatus.message}
        </motion.div>
      )}

      {/* Liste des images uploadées */}
      {uploadedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Images Uploadées ({uploadedImages.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Affichage de l'image */}
                <div className="aspect-square bg-gray-100">
                  <MongoImage
                    imageId={image.id}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                    filePath={image.filePath}
                    fallback={
                      <div className="text-gray-500 text-center p-4">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm">Image non disponible</p>
                      </div>
                    }
                  />
                </div>
                
                {/* Informations de l'image */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800 truncate" title={image.originalName}>
                    {image.originalName}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Taille: {formatFileSize(image.size)}</p>
                    <p>Uploadé: {formatDate(image.uploadedAt)}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      ID: {image.id.slice(-8)}...
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
