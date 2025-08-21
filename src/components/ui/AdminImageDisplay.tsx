'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import MongoImage from './MongoImage';

interface AdminImageDisplayProps {
  image?: string;
  imageId?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPreview?: boolean;
  onImageClick?: () => void;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

export default function AdminImageDisplay({
  image,
  imageId,
  alt = 'Image',
  className = '',
  size = 'md',
  showPreview = true,
  onImageClick
}: AdminImageDisplayProps) {
  const sizeClass = sizeClasses[size];

  if (!image) {
    return (
      <div className={`${sizeClass} ${className} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
          <p className="text-xs">Aucune image</p>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onImageClick) {
      onImageClick();
    }
  };

  return (
    <div className={`${className} group`}>
      {/* Image principale */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`${sizeClass} relative cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all`}
        onClick={handleClick}
      >
        <MongoImage
          imageId={imageId || ''}
          filePath={image}
          alt={alt}
          className="w-full h-full object-cover"
          fallback={
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          }
        />
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>

      {/* Informations de l'image */}
      {showPreview && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600 truncate" title={alt}>
            {alt}
          </p>
          {image && (
            <p className="text-xs text-gray-400 font-mono">
              {image.split('/').pop()?.slice(0, 8)}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
