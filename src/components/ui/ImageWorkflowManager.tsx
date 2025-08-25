'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';

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
    <div className="image-preview">
      <div className="image-preview-content">
        <img src={preview} alt={file.name} className="preview-image" />
        <div className="preview-info">
          <p className="preview-name">{file.name}</p>
          <p className="preview-size">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <button onClick={onRemove} className="remove-button">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ProgressBar: React.FC<{ progress: number; currentFile?: File; totalFiles: number }> = ({ 
  progress, 
  currentFile, 
  totalFiles 
}) => (
  <div className="progress-container">
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="progress-text">
      {currentFile && (
        <span>📁 {currentFile.name} ({progress.toFixed(1)}%)</span>
      )}
      <span className="progress-count">
        {totalFiles} image(s) traitée(s)
      </span>
    </div>
  </div>
);

const UploadStats: React.FC<{ stats: UploadStats }> = ({ stats }) => (
  <div className="upload-stats">
    <div className="stat-item">
      <span className="stat-label">Images sélectionnées:</span>
      <span className="stat-value">{stats.total}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Compressées:</span>
      <span className="stat-value">{stats.compressed}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Taille originale:</span>
      <span className="stat-value">{stats.totalOriginalSize}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Taille finale:</span>
      <span className="stat-value">{stats.totalCompressedSize}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Espace économisé:</span>
      <span className="stat-value">{stats.savedSpace}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Ratio de compression:</span>
      <span className="stat-value">{stats.compressionRatio}</span>
    </div>
  </div>
);

const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
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
      throw new Error(errorData.error || 'Erreur lors de l\'upload');
    }

    return await response.json();
  }, []);

  // Validation des types de fichiers
  const isValidImageFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 50 * 1024 * 1024; // 50 MB max
    
    if (!validTypes.includes(file.type)) {
      showNotification('error', `❌ Type de fichier non supporté: ${file.name}`);
      return false;
    }
    
    if (file.size > maxSize) {
      showNotification('error', `❌ Fichier trop volumineux: ${file.name} (${formatBytes(file.size)})`);
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
      showNotification('success', `✅ ${selectedImages.length} images ajoutées à Git`);
      
      // Réinitialiser après succès
      setTimeout(() => {
        setSelectedImages([]);
        setUploadStats(null);
        setProgress(0);
        setCurrentFile(undefined);
      }, 2000);
      
    } catch (error) {
      showNotification('error', `❌ Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
    <div className="image-workflow-manager">
      {/* En-tête */}
      <div className="workflow-header">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🖼️ Gestion des Images</h1>
        <p className="text-gray-600">Glissez-déposez vos images ou sélectionnez-les pour les ajouter à Git</p>
      </div>
      
      {/* Zone de glisser-déposer */}
      <div 
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-zone-content">
          <Upload className="drop-zone-icon" />
          <p className="text-lg text-gray-700 mb-2">Glissez-déposez vos images ici</p>
          <p className="text-gray-500 mb-4">OU</p>
          <button onClick={handleSelectFiles} className="select-button">
            📁 Sélectionner des Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Liste des images sélectionnées */}
      {selectedImages.length > 0 && (
        <div className="selected-images">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Images sélectionnées ({selectedImages.length})
          </h3>
          <div className="image-list">
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
        <div className="upload-section">
          <button 
            onClick={handleAddToGit}
            disabled={isUploading}
            className="upload-button"
          >
            {isUploading ? '⏳ Traitement...' : '🚀 Ajouter à Git'}
          </button>
        </div>
      )}
      
      {/* Progression */}
      {isUploading && (
        <div className="progress-section">
          <ProgressBar 
            progress={progress} 
            currentFile={currentFile} 
            totalFiles={selectedImages.length} 
          />
        </div>
      )}
      
      {/* Statistiques */}
      {uploadStats && (
        <div className="stats-section">
          <UploadStats stats={uploadStats} />
        </div>
      )}
    </div>
  );
}
