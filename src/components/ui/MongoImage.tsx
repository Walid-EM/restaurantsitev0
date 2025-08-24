'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MongoImageProps {
  imageId: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  gitPath?: string;         // Chemin dans le repository Git (priorité 1)
  filePath?: string;        // Chemin local (fallback, priorité 2)

}

export default function MongoImage({
  imageId,
  alt = 'Image',
  className = '',
  fallback,
  onLoad,
  onError,
  gitPath,
  filePath
}: MongoImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Log de débogage (commenté pour éviter le spam)
  // console.log('MongoImage props:', { imageId, filePath, alt });

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Priorité : 1. gitPath (repository Git), 2. filePath (local), 3. imageId (API)
  let imageSrc = '';
  
  if (gitPath && gitPath.startsWith('/images/')) {
    // Image depuis le repository Git (parfait pour Vercel)
    imageSrc = gitPath;
  } else if (filePath && filePath.startsWith('/public/images/')) {
    // Image locale (fallback)
    imageSrc = filePath.replace('/public/images/', '/images/');
  } else if (imageId && imageId !== 'undefined') {
    // Fallback vers l'API locale
    imageSrc = `/api/images/${imageId}`;
  }
  
  // Log de débogage (commenté pour éviter le spam)
  // console.log('MongoImage imageSrc:', imageSrc);

  if (hasError || !imageSrc) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-1">🖼️</div>
          <p className="text-sm">Image non disponible</p>
        </div>
      </div>
    );
  }
  
  // Log de débogage (commenté pour éviter le spam)
  // console.log('MongoImage imageSrc:', imageSrc);

  return (
    <div className="relative">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}
        >
          <div className="text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        </motion.div>
      )}
      
      <motion.img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
}
