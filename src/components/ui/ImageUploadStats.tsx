'use client';

import React from 'react';
import { TrendingDown, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface UploadStats {
  fileName: string;
  originalSize: number;
  optimizedSize: number;
  sizeReduction: string;
  status: 'success' | 'error' | 'processing';
  error?: string;
}

interface ImageUploadStatsProps {
  uploads: UploadStats[];
  className?: string;
}

export default function ImageUploadStats({ uploads, className = '' }: ImageUploadStatsProps) {
  if (uploads.length === 0) {
    return null;
  }

  const totalOriginalSize = uploads.reduce((sum, upload) => sum + upload.originalSize, 0);
  const totalOptimizedSize = uploads.reduce((sum, upload) => sum + upload.optimizedSize, 0);
  const totalReduction = totalOriginalSize > 0 ? 
    ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1) : '0';

  const successfulUploads = uploads.filter(upload => upload.status === 'success');
  const failedUploads = uploads.filter(upload => upload.status === 'error');
  const processingUploads = uploads.filter(upload => upload.status === 'processing');

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <TrendingDown className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Statistiques de Redimensionnement
        </h3>
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{uploads.length}</div>
          <div className="text-sm text-blue-700">Images traitées</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{successfulUploads.length}</div>
          <div className="text-sm text-green-700">Succès</div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{totalReduction}%</div>
          <div className="text-sm text-orange-700">Réduction totale</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(1)}
          </div>
          <div className="text-sm text-purple-700">MB économisés</div>
        </div>
      </div>

      {/* Détails des uploads */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Détails des images :</h4>
        
        {uploads.map((upload, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 truncate">{upload.fileName}</span>
              <div className="flex items-center space-x-2">
                {upload.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {upload.status === 'error' && (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                {upload.status === 'processing' && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Original:</span>
                <div className="font-medium">{(upload.originalSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              
              <div>
                <span className="text-gray-500">Optimisé:</span>
                <div className="font-medium">{(upload.optimizedSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              
              <div>
                <span className="text-gray-500">Réduction:</span>
                <div className="font-medium text-green-600">{upload.sizeReduction}</div>
              </div>
              
              <div>
                <span className="text-gray-500">Statut:</span>
                <div className={`font-medium ${
                  upload.status === 'success' ? 'text-green-600' : 
                  upload.status === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {upload.status === 'success' ? '✅ Réussi' : 
                   upload.status === 'error' ? '❌ Erreur' : '🔄 Traitement'}
                </div>
              </div>
            </div>
            
            {upload.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>Erreur:</strong> {upload.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Informations techniques */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Informations techniques</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Redimensionnement automatique si &gt; 4.5 MB</div>
          <div>• Qualité optimisée : JPEG/PNG/WebP à 85%</div>
          <div>• Compression supplémentaire à 70% si nécessaire</div>
          <div>• Maintien des proportions et de la qualité visuelle</div>
        </div>
      </div>
    </div>
  );
}
