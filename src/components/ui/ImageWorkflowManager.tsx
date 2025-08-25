'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, X, RefreshCw, Image as ImageIcon, GitBranch } from 'lucide-react';

interface UploadStats {
  total: number;
  compressed: number;
  savedSpace: string;
  totalOriginalSize: string;
  totalCompressedSize: string;
  compressionRatio: string;
}

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>('');

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-400/50 transition-all hover:scale-105">
      <div className="space-y-3">
        <img src={preview} alt={file.name} className="w-full h-24 object-cover rounded-lg" />
        <div className="text-center">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <button 
        onClick={onRemove} 
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const ProgressBar: React.FC<{ progress: number; currentFile?: File; totalFiles: number }> = ({ 
  progress, 
  currentFile, 
  totalFiles 
}) => (
  <div className="space-y-3">
    <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600">
      <div 
        className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{ width: `${progress}%` }}
      >
        {progress > 15 && (
          <span className="text-white text-xs font-medium">
            {progress.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
    <div className="flex justify-between items-center text-sm">
      {currentFile && (
        <span className="text-gray-300">
          📁 {currentFile.name}
        </span>
      )}
      <span className="text-gray-400">
        {totalFiles} image(s) traitée(s)
      </span>
    </div>
  </div>
);

const UploadStats: React.FC<{ stats: UploadStats }> = ({ stats }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
      Statistiques d'Upload
    </h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
        <p className="text-xs text-gray-300">Images</p>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-green-400">{stats.compressed}</p>
        <p className="text-xs text-gray-300">Compressées</p>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-purple-400">{stats.compressionRatio}</p>
        <p className="text-xs text-gray-300">Économies</p>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-sm font-medium text-gray-300">{stats.totalOriginalSize}</p>
        <p className="text-xs text-gray-400">Taille originale</p>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-sm font-medium text-gray-300">{stats.totalCompressedSize}</p>
        <p className="text-xs text-gray-400">Taille finale</p>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-sm font-medium text-green-400">{stats.savedSpace}</p>
        <p className="text-xs text-gray-400">Économisé</p>
      </div>
    </div>
  </div>
);

const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl text-white font-medium shadow-2xl transition-all duration-300 transform translate-x-full`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  
  notification.className += ` ${bgColor}`;
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-lg">${icon}</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:opacity-70 transition-opacity">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto-remove après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(full)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
};

export default function ImageWorkflowManager() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction de compression automatique (préservant la transparence)
  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calcul du ratio de réduction
        const reductionRatio = Math.sqrt(4.5 / (file.size / (1024 * 1024))) * 0.9;
        const newWidth = Math.round(img.width * reductionRatio);
        const newHeight = Math.round(img.height * reductionRatio);
        
        // Redimensionnement
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Préservation du format et transparence
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const outputQuality = file.type === 'image/png' ? 1.0 : 0.85;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Erreur de compression'));
          }
        }, outputFormat, outputQuality);
      };
      
      img.onerror = () => reject(new Error('Erreur de chargement'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Fonction d'upload vers Git
  const uploadToGit = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/admin/upload-to-git', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l&apos;upload');
    }

    return await response.json();
  }, []);

  // Validation des types de fichiers
  const isValidImageFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 50 * 1024 * 1024; // 50 MB max
    
    if (!validTypes.includes(file.type)) {
      showNotification('error', `Type de fichier non supporté: ${file.name}`);
      return false;
    }
    
    if (file.size > maxSize) {
      showNotification('error', `Fichier trop volumineux: ${file.name} (${formatBytes(file.size)})`);
      return false;
    }
    
    return true;
  }, []);

  // Gestion du glisser-déposer
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(isValidImageFile);
    
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      showNotification('info', `${files.length} image(s) ajoutée(s)`);
    }
  }, [isValidImageFile]);

  // Gestion de la sélection de fichiers
  const handleSelectFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(isValidImageFile);
    
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      showNotification('info', `${files.length} image(s) sélectionnée(s)`);
    }
    
    // Réinitialiser l'input
    if (e.target) {
      e.target.value = '';
    }
  }, [isValidImageFile]);

  // Suppression d'une image
  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Fonction d'upload unifiée
  const handleAddToGit = useCallback(async () => {
    if (selectedImages.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    setCurrentFile(undefined);
    
    let compressedCount = 0;
    let totalSavedBytes = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        setCurrentFile(file);
        
        // Mise à jour de la progression
        setProgress((i / selectedImages.length) * 100);
        
        // Compression automatique si nécessaire
        let processedFile = file;
        totalOriginalSize += file.size;
        
        if (file.size > 4.5 * 1024 * 1024) {
          processedFile = await compressImage(file);
          compressedCount++;
          totalSavedBytes += file.size - processedFile.size;
          totalCompressedSize += processedFile.size;
          console.log(`🔄 Image compressée: ${file.name}`);
        } else {
          totalCompressedSize += file.size;
        }
        
        // Upload vers Git
        await uploadToGit(processedFile);
        
        // Mise à jour des statistiques
        setUploadStats({
          total: selectedImages.length,
          compressed: compressedCount,
          savedSpace: formatBytes(totalSavedBytes),
          totalOriginalSize: formatBytes(totalOriginalSize),
          totalCompressedSize: formatBytes(totalCompressedSize),
          compressionRatio: totalOriginalSize > 0 ? `${((totalSavedBytes / totalOriginalSize) * 100).toFixed(1)}%` : '0%'
        });
      }
      
      // Succès
      setProgress(100);
      showNotification('success', `${selectedImages.length} images ajoutées à Git avec succès !`);
      
      // Réinitialiser après succès
      setTimeout(() => {
        setSelectedImages([]);
        setUploadStats(null);
        setProgress(0);
        setCurrentFile(undefined);
      }, 3000);
      
    } catch (error) {
      showNotification('error', `Erreur lors de l&apos;upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsUploading(false);
      setProgress(0);
      setCurrentFile(undefined);
    }
  }, [selectedImages, compressImage, uploadToGit]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 mr-3 text-blue-400" />
          Gestion des Images
        </h2>
        <p className="text-gray-300 text-lg">
          Workflow automatique pour l'upload et la compression d'images
        </p>
      </div>

      {/* Zone de glisser-déposer */}
      <div 
        className={`border-3 border-dashed rounded-2xl p-8 lg:p-10 text-center transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : 'border-gray-300 hover:border-blue-400/50 hover:bg-white/5'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xl lg:text-2xl font-medium text-white">
              Glissez-déposez vos images ici
            </p>
            <p className="text-gray-400 text-lg">OU</p>
          </div>
          
          <button 
            onClick={handleSelectFiles}
            className="px-8 py-4 lg:px-10 lg:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all text-lg lg:text-xl font-medium hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-3"
          >
            <ImageIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            <span>Sélectionner des Images</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <p className="text-gray-400 text-sm">
            Formats supportés : JPEG, PNG, GIF, WebP (max 50 MB)
          </p>
        </div>
      </div>

      {/* Liste des images sélectionnées */}
      {selectedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-blue-400" />
            Images sélectionnées ({selectedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <ImagePreview 
                key={index} 
                file={file} 
                onRemove={() => removeImage(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      {selectedImages.length > 0 && (
        <div className="text-center">
          <button 
            onClick={handleAddToGit}
            disabled={isUploading}
            className="px-8 py-5 lg:px-10 lg:py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-2xl transition-all text-xl lg:text-2xl font-medium hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-3 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <RefreshCw className="w-6 h-6 lg:w-8 lg:h-8 animate-spin" />
            ) : (
              <GitBranch className="w-6 h-6 lg:w-8 lg:h-8" />
            )}
            <span>
              {isUploading ? 'Traitement en cours...' : `🚀 Ajouter ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} à Git`}
            </span>
          </button>
        </div>
      )}

      {/* Progression */}
      {isUploading && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-400 mr-2 animate-spin" />
            Progression de l'Upload
          </h4>
          <ProgressBar 
            progress={progress} 
            currentFile={currentFile} 
            totalFiles={selectedImages.length} 
          />
        </div>
      )}

      {/* Statistiques */}
      {uploadStats && (
        <UploadStats stats={uploadStats} />
      )}

      {/* Information sur la compression automatique */}
      <div className="bg-green-500/10 border-2 border-green-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
            ✅
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-2">
              Compression Automatique Intelligente
            </h4>
            <p className="text-green-300 text-sm leading-relaxed">
              <strong>Détection automatique :</strong> Les images &gt; 4.5 MB sont automatiquement compressées côté client.<br/>
              <strong>Préservation de la qualité :</strong> Les PNG gardent leur transparence, les JPEG sont optimisés intelligemment.<br/>
              <strong>Upload sécurisé :</strong> Respect automatique des limites Vercel pour éviter les erreurs 413.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
