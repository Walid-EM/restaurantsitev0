'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AdminCloudinaryImageProps {
  cloudinaryUrl: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export default function AdminCloudinaryImage({
  cloudinaryUrl,
  alt = 'Image Cloudinary',
  className = '',
  fallback,
  onLoad,
  onError,
}: AdminCloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  if (hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-1">🖼️</div>
          <p className="text-sm">Image Cloudinary non disponible</p>
        </div>
      </div>
    );
  }

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
        src={cloudinaryUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
      
      {!isLoading && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Cloudinary
        </div>
      )}
    </div>
  );
}
