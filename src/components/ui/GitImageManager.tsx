'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, GitBranch, RefreshCw, X, CheckCircle } from 'lucide-react';

interface GitImage {
  imageId: string;
  fileName: string;
  gitPath: string;
  githubUrl?: string;
  category: string;
  uploadDate: Date;
}

interface PendingImage {
  id: string;
  file: File;
  preview: string;
}

export default function GitImageManager() {
  const [images, setImages] = useState<GitImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Logger l'état des images
  useEffect(() => {
    console.log('🔍 État images actuel:', images);
    console.log('🔍 Nombre d\'images:', images.length);
  }, [images]);

  // Gestion de la sélection multiple d'images
  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    
    const newPendingImages: PendingImage[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPendingImages(prev => [...prev, ...newPendingImages]);
  };

  // Supprimer une image en attente
  const removePendingImage = (id: string) => {
    setPendingImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // Upload en lot de toutes les images en attente
  const uploadAllImages = async () => {
    if (pendingImages.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadProgress({ current: 0, total: pendingImages.length });
    
    try {
      const uploadedImages: GitImage[] = [];
      let successCount = 0;
      let errorCount = 0;
      
      // Uploader chaque fichier individuellement pour éviter l'erreur 413
      for (let i = 0; i < pendingImages.length; i++) {
        const pendingImage = pendingImages[i];
        try {
          console.log(`📁 Upload fichier ${i + 1}/${pendingImages.length}: ${pendingImage.file.name}`);
          
          // Upload individuel pour chaque fichier
          const formData = new FormData();
          formData.append('image', pendingImage.file);
          
          const response = await fetch('/api/admin/upload-to-git', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
              const uploadedImage: GitImage = {
                imageId: result.imageId,
                fileName: result.fileName,
                gitPath: result.gitPath,
                githubUrl: result.githubUrl,
                category: 'uploads',
                uploadDate: new Date()
              };
              
              uploadedImages.push(uploadedImage);
              successCount++;
              console.log(`✅ Succès: ${pendingImage.file.name}`);
            } else {
              errorCount++;
              console.error(`❌ Erreur: ${pendingImage.file.name}`, result.error);
            }
          } else {
            errorCount++;
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Erreur HTTP: ${pendingImage.file.name}`, errorData);
          }
          
          // Mettre à jour le progrès
          setUploadProgress({ current: i + 1, total: pendingImages.length });
          
        } catch (error) {
          errorCount++;
          console.error(`❌ Erreur upload ${pendingImage.file.name}:`, error);
        }
      }
      
      // Mettre à jour l'état avec les images uploadées
      if (uploadedImages.length > 0) {
        setImages(prev => {
          const newImages = [...prev, ...uploadedImages];
          console.log('📊 État images mis à jour:', newImages);
          return newImages;
        });
        
        setUploadStatus('success');
        console.log(`🎉 Upload séquentiel réussi: ${uploadedImages.length} images ajoutées`);
        
        if (errorCount > 0) {
          console.warn(`⚠️ ${errorCount} fichier(s) en erreur`);
        }
      } else {
        setUploadStatus('error');
        console.error('❌ Aucune image n\'a pu être uploadée');
      }
      
    } catch (error) {
      setUploadStatus('error');
      console.error('❌ Erreur générale upload séquentiel:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      setPendingImages([]); // Toujours nettoyer les images en attente
    }
  };

  // Suppression d'images depuis Git
  const handleImageDelete = async (imageId: string) => {
    try {
      const image = images.find(img => img.imageId === imageId);
      if (!image) return;
      
      // Supprimer l'image du repository Git
      const response = await fetch('/api/admin/delete-from-git', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageId,
          filePath: image.gitPath 
        })
      });
      
      if (response.ok) {
        setImages(prev => prev.filter(img => img.imageId !== imageId));
        console.log('✅ Image supprimée du repository Git');
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone d'upload multiple */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelection(e.target.files)}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? (
            <RefreshCw className="w-5 h-5 animate-spin inline mr-2" />
          ) : (
            <Upload className="w-5 h-5 inline mr-2" />
          )}
          {isUploading ? 'Upload en cours...' : '📁 Sélectionner des images'}
        </button>
        
        <p className="text-sm text-gray-500 mt-2">
          Vous pouvez sélectionner plusieurs images à la fois
        </p>
        <p className="text-xs text-blue-600 mt-1">
           🚀 Upload en lot optimisé : toutes les images sont ajoutées en un seul commit GitHub
         </p>
        
        {/* Bouton d'upload en lot */}
        {pendingImages.length > 0 && (
          <div className="mt-4">
            <button
              onClick={uploadAllImages}
              disabled={isUploading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin inline mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 inline mr-2" />
              )}
              {isUploading ? 'Upload en cours...' : `🚀 Ajouter ${pendingImages.length} image${pendingImages.length > 1 ? 's' : ''} à Git`}
            </button>
          </div>
        )}
        
        {/* Barre de progression */}
        {isUploading && uploadProgress.total > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {uploadProgress.current} / {uploadProgress.total} images uploadées
            </p>
          </div>
        )}
        
        {/* Status de l'upload */}
        {uploadStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
            ✅ Images ajoutées au repository Git avec succès !
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
            ❌ Erreur lors de l&apos;ajout des images
            <p className="text-sm mt-2">
              Vérifiez la console pour plus de détails sur les erreurs
            </p>
          </div>
        )}
      </div>

      {/* Images en attente */}
      {pendingImages.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            📋 Images en attente d&apos;upload ({pendingImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pendingImages.map((pendingImage) => (
              <div key={pendingImage.id} className="relative">
                <img 
                  src={pendingImage.preview} 
                  alt={pendingImage.file.name}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => removePendingImage(pendingImage.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {pendingImage.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des images uploadées */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🖼️ Images dans le Repository Git ({images.length})
          </h3>
          
          {/* Affichage simple du nombre d'images */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✅ {images.length} image{images.length > 1 ? 's' : ''} ajoutée{images.length > 1 ? 's' : ''} au repository Git
            </p>
            
            {/* Liste textuelle des images */}
            <div className="mt-3 space-y-1">
              {images.map((image) => (
                <div key={image.imageId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    📁 {image.fileName}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleImageDelete(image.imageId)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Supprimer
                    </button>
                    {image.githubUrl && (
                      <a
                        href={image.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                      >
                        <GitBranch className="w-3 h-3 inline mr-1" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
