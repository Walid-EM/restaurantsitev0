'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Link, 
  Cloud, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface LocalImage {
  id: string;
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
  status: 'existing' | 'added' | 'removed';
}

interface CloudinaryImageManagerProps {
  onImagesChange: (images: LocalImage[]) => void;
  initialImages: LocalImage[];
}

export default function CloudinaryImageManager({ onImagesChange, initialImages }: CloudinaryImageManagerProps) {
  const [images, setImages] = useState<LocalImage[]>(initialImages.map(img => ({
    ...img,
    // S'assurer que chaque image a un ID unique
    id: img.id || `fallback-${img.publicId.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`,
    status: 'existing' as const
  })));
  
  // État pour le suivi des modifications
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onImagesChange(images);
    
    // Debug: vérifier que toutes les images ont des IDs uniques
    const ids = images.map(img => img.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('⚠️ Images avec IDs dupliqués détectées:', {
        total: ids.length,
        unique: uniqueIds.size,
        duplicates: ids.filter((id, index) => ids.indexOf(id) !== index)
      });
    }
  }, [images, onImagesChange]);

  // Ajouter une image depuis un fichier
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
                     const newImage: LocalImage = {
             id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
             publicId: `local/${file.name}`,
             url: e.target?.result as string,
             thumbnailUrl: e.target?.result as string,
             format: file.name.split('.').pop() || 'unknown',
             width: img.width,
             height: img.height,
             size: file.size,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             tags: [],
             folder: 'local',
             status: 'added'
           };

                     setImages(prev => [...prev, newImage]);
           setHasChanges(true);
           setShowUploadModal(false);
           setUploadFile(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Ajouter une image depuis une URL
  const handleUrlUpload = async () => {
    if (!uploadUrl.trim()) return;

    try {
      setIsUploading(true);
      
      // Vérifier que l'URL est valide
      const response = await fetch(uploadUrl);
      if (!response.ok) throw new Error('URL invalide');

      const blob = await response.blob();
      const file = new File([blob], 'image-from-url.jpg', { type: blob.type });
      
      await handleFileUpload(file);
      setUploadUrl('');

    } catch (error) {
      console.error('Erreur lors de l\'upload depuis URL:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Supprimer une image localement
  const removeImage = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, status: 'removed' as const }
        : img
    ));
    setHasChanges(true);
    
    // Feedback visuel immédiat
    console.log(`🗑️ Image "${imageId}" marquée pour suppression`);
  };

  // Restaurer une image supprimée
  const restoreImage = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, status: 'existing' as const }
        : img
    ));
    setHasChanges(true);
  };

  // Réinitialiser tous les changements
  const resetChanges = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      status: 'existing' as const
    })));
    setHasChanges(false);
  };

  // Synchroniser avec Cloudinary
  const syncWithCloudinary = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('idle');

      const addedImages = images.filter(img => img.status === 'added');
      const removedImages = images.filter(img => img.status === 'removed');

      if (addedImages.length === 0 && removedImages.length === 0) {
        setSyncStatus('idle');
        return;
      }

      console.log('🔄 Synchronisation avec Cloudinary:', {
        ajouts: addedImages.length,
        suppressions: removedImages.length
      });

      // Appeler l'API de synchronisation
                   console.log('📤 Données envoyées à l\'API:', {
               addedImages: addedImages.map(img => ({
                 id: img.id,
                 publicId: img.publicId,
                 url: img.url
               })),
               removedImages: removedImages.map(img => ({
                 id: img.id,
                 publicId: img.publicId,
                 url: img.url
               }))
             });

             const response = await fetch('/api/admin/sync-cloudinary-images', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 addedImages: addedImages.map(img => ({
                   id: img.id,
                   publicId: img.publicId,
                   url: img.url,
                   format: img.format,
                   width: img.width,
                   height: img.height,
                   size: img.size,
                   tags: img.tags,
                   folder: img.folder
                 })),
                 removedImages: removedImages.map(img => ({
                   id: img.id,
                   publicId: img.publicId,
                   url: img.url
                 }))
               })
             });

                   const result = await response.json();
             console.log('📥 Réponse de l\'API:', result);

             if (result.success) {
               console.log('✅ Synchronisation réussie:', result);
        
                 // Mettre à jour le statut des images
         setImages(prev => prev.map(img => {
           if (img.status === 'added') {
             return { ...img, status: 'existing' as const };
           }
           if (img.status === 'removed') {
             return { ...img, status: 'removed' as const };
           }
           return img;
         }));

         // Réinitialiser l'état des changements
         setHasChanges(false);
         setSyncStatus('success');
         setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        throw new Error(result.error || 'Erreur lors de la synchronisation');
      }

    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Statistiques
  const stats = {
    total: images.length,
    added: images.filter(img => img.status === 'added').length,
    removed: images.filter(img => img.status === 'removed').length,
    existing: images.filter(img => img.status === 'existing').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Gestionnaire d'Images Cloudinary
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter Image</span>
            </button>
                         <button
               onClick={syncWithCloudinary}
               disabled={isSyncing || !hasChanges}
               className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
             >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser'}</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.existing}</div>
            <div className="text-sm text-blue-600">Existantes</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-800">{stats.added}</div>
            <div className="text-sm text-green-600">À ajouter</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-800">{stats.removed}</div>
            <div className="text-sm text-red-600">À supprimer</div>
          </div>
        </div>

        {/* Indicateur de changements */}
        {hasChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  ⚠️ Changements en attente de synchronisation
                </span>
              </div>
              <button
                onClick={resetChanges}
                className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm rounded-lg transition-colors"
              >
                Annuler les changements
              </button>
            </div>
            <p className="text-yellow-700 text-sm mt-2">
              Cliquez sur "Synchroniser" pour appliquer vos modifications à Cloudinary.
            </p>
          </div>
        )}

        {/* Statut de synchronisation */}
        {syncStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            syncStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {syncStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {syncStatus === 'success' 
                ? 'Synchronisation réussie !' 
                : 'Erreur lors de la synchronisation'
              }
            </span>
          </div>
        )}

        {/* Section des images supprimées (récupérables) */}
        {stats.removed > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-red-800">
                🗑️ Images Supprimées ({stats.removed})
              </h4>
              <button
                onClick={() => {
                  // Restaurer toutes les images supprimées
                  setImages(prev => prev.map(img => 
                    img.status === 'removed' 
                      ? { ...img, status: 'existing' as const }
                      : img
                  ));
                  setHasChanges(false);
                }}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded-lg transition-colors"
              >
                Restaurer tout
              </button>
            </div>
            <p className="text-red-700 text-sm mb-3">
              Ces images sont marquées pour suppression. Cliquez sur "Restaurer" pour les récupérer, ou synchronisez pour les supprimer définitivement de Cloudinary.
            </p>
            
            {/* Grille des images supprimées */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images
                .filter(image => image.status === 'removed')
                .map((image) => (
                  <div 
                    key={image.id}
                    className="bg-white border border-red-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    {/* Thumbnail de l'image supprimée */}
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={image.thumbnailUrl}
                        alt={image.publicId}
                        className="w-full h-full object-cover opacity-60"
                        loading="lazy"
                      />
                      
                      {/* Bouton de restauration */}
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <button
                          onClick={() => restoreImage(image.id)}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                          title="Restaurer l'image"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Informations de l'image */}
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 truncate text-sm" title={image.publicId}>
                        {image.publicId.split('/').pop() || image.publicId}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {image.format.toUpperCase()} • {image.width}×{image.height}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Grille des images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images
          .filter(image => image.status !== 'removed') // Filtrer les images supprimées
          .map((image, index) => {
          // S'assurer que chaque image a une clé unique et valide
          const uniqueKey = image.id || `fallback-${index}-${image.publicId}`;
          
          return (
            <div 
              key={uniqueKey}
              className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                image.status === 'added' ? 'border-green-300 bg-green-50' :
                'border-gray-200'
              }`}
            >
            {/* Thumbnail de l'image */}
            <div className="aspect-square bg-gray-100 relative group">
              <img
                src={image.thumbnailUrl}
                alt={image.publicId}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay avec actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={() => removeImage(image.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="Supprimer l'image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badge de statut */}
              <div className="absolute top-2 right-2">
                {image.status === 'added' && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Ajouté
                  </span>
                )}
              </div>
            </div>

            {/* Informations de l'image */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 truncate" title={image.publicId}>
                  {image.publicId.split('/').pop() || image.publicId}
                </h4>
                <p className="text-sm text-gray-500">
                  {image.format.toUpperCase()} • {image.width}×{image.height}
                </p>
              </div>

              <div className="text-xs text-gray-600">
                <p>Taille: {(image.size / 1024).toFixed(1)} KB</p>
                <p>Dossier: {image.folder === 'racine' ? 'Racine' : image.folder}</p>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Ajouter une Image
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Onglets d'upload */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploadType === 'file' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Fichier
              </button>
              <button
                onClick={() => setUploadType('url')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploadType === 'url' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Link className="w-4 h-4 inline mr-2" />
                URL
              </button>
            </div>

            {/* Upload par fichier */}
            {uploadType === 'file' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Choisir un fichier
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    ou glissez-déposez ici
                  </p>
                </div>
                {uploadFile && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">
                      Fichier sélectionné: {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Taille: {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
                <button
                  onClick={() => uploadFile && handleFileUpload(uploadFile)}
                  disabled={!uploadFile || isUploading}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isUploading ? 'Upload en cours...' : 'Ajouter l\'image'}
                </button>
              </div>
            )}

            {/* Upload par URL */}
            {uploadType === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleUrlUpload}
                  disabled={!uploadUrl.trim() || isUploading}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isUploading ? 'Upload en cours...' : 'Ajouter depuis l\'URL'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
