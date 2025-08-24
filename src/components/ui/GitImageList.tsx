'use client';

import { useState, useEffect } from 'react';
import { GitBranch, ExternalLink } from 'lucide-react';

interface GitImage {
  imageId: string;
  fileName: string;
  gitPath: string;
  githubUrl?: string;
  category: string;
  uploadDate: Date;
}

export default function GitImageList() {
  const [images, setImages] = useState<GitImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implémenter la récupération des images depuis le repository Git
    // Pour l'instant, on utilise un état vide
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erreur :</strong> {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune image trouvée dans le repository Git</p>
        <p className="text-sm">Utilisez le gestionnaire d&apos;images pour ajouter des images</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Images du Repository Git ({images.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.imageId} className="border rounded-lg p-4 bg-white shadow-sm">
            <img 
              src={image.gitPath} 
              alt={image.fileName}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <div className="space-y-2">
              <p className="font-medium text-sm truncate">{image.fileName}</p>
              <p className="text-xs text-gray-500">ID: {image.imageId}</p>
              <p className="text-xs text-gray-500">
                {image.uploadDate.toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {image.category}
                </span>
                {image.githubUrl && (
                  <a
                    href={image.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <GitBranch className="w-3 h-3 mr-1" />
                    Voir sur GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
