'use client';

import { useState, useEffect } from 'react';
import CloudinaryImagesList from '@/components/ui/CloudinaryImagesList';
import CloudinaryImageManager from '@/components/ui/CloudinaryImageManager';
import LocalImagesDisplay from '@/components/ui/LocalImagesDisplay';

export default function AdminCloudinaryPreviewPage() {
  const [cloudinaryImages, setCloudinaryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les images Cloudinary au montage du composant
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Charger 50 images maximum pour le gestionnaire
        const response = await fetch('/api/admin/list-cloudinary-images?max_results=50');
        const result = await response.json();
        if (result.success) {
          setCloudinaryImages(result.images);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Gestionnaire Cloudinary (Admin uniquement)
      </h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          <strong>ℹ️ Information :</strong> Cette page vous permet de gérer vos images Cloudinary avec ajout, suppression et synchronisation.
          <br />
          Les changements ne sont appliqués que lorsque vous cliquez sur "Synchroniser".
        </p>
      </div>

      {/* Gestionnaire d'images avec ajout/suppression/synchronisation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestionnaire d'Images Cloudinary
          </h2>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            {isLoading ? 'Chargement...' : `${cloudinaryImages.length} image(s) chargée(s)`}
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Gestionnaire complet pour vos images Cloudinary. Ajoutez des images locales, supprimez des images existantes, puis synchronisez pour mettre à jour Cloudinary et votre media library.
          <br />
          <span className="text-sm text-blue-600">
            💡 <strong>Important :</strong> Tous les changements sont locaux jusqu'à ce que vous cliquiez sur "Synchroniser".
          </span>
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des images Cloudinary...</span>
          </div>
        ) : (
          <CloudinaryImageManager 
            initialImages={cloudinaryImages}
            onImagesChange={(images) => console.log('Images modifiées:', images)}
          />
        )}
      </div>

      {/* Liste dynamique des images Cloudinary (lecture seule) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Images Cloudinary Disponibles
        </h2>
        <p className="text-gray-600 mb-4">
          Affichage en lecture seule de toutes vos images Cloudinary avec pagination et recherche.
          <br />
          <span className="text-sm text-blue-600">
            💡 <strong>Note :</strong> Cette section affiche les images par pages de 20 pour de meilleures performances.
          </span>
        </p>
        <CloudinaryImagesList />
      </div>

      {/* Section des images synchronisées localement */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Images Synchronisées Localement
        </h2>
        <p className="text-gray-600 mb-4">
          Voici les images que vous avez déjà synchronisées depuis Cloudinary vers votre projet local.
        </p>
        <LocalImagesDisplay />
      </div>

      {/* Instructions d'utilisation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Comment utiliser</h3>
        <ul className="list-disc list-inside space-y-2 text-yellow-700">
          <li><strong>Recherche et filtres :</strong> Utilisez la barre de recherche et les filtres par dossier pour trouver rapidement vos images</li>
          <li><strong>Prévisualisation :</strong> Cliquez sur "Voir l'image" pour ouvrir l'image en plein écran</li>
          <li><strong>Synchronisation :</strong> Utilisez le bouton "Synchroniser Localement" pour télécharger une image vers votre projet</li>
          <li><strong>Pagination :</strong> Naviguez entre les pages pour voir toutes vos images Cloudinary</li>
          <li><strong>Métadonnées :</strong> Consultez la taille, les dimensions, les tags et la date de création de chaque image</li>
        </ul>
      </div>
    </div>
  );
}
