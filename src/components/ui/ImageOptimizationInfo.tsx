'use client';

import { useState } from 'react';
import { Info, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';

interface ImageOptimizationInfoProps {
  className?: string;
}

export default function ImageOptimizationInfo({ className = '' }: ImageOptimizationInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-900">
              🔄 Redimensionnement automatique activé
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isExpanded ? 'Masquer' : 'Détails'}
            </button>
          </div>
          
          <p className="text-sm text-blue-700 mt-1">
            Vos images sont automatiquement optimisées pour respecter la limite Vercel de 4.5 MB
          </p>
          
          {isExpanded && (
            <div className="mt-3 space-y-2 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Redimensionnement intelligent des dimensions</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span>Optimisation de la qualité (JPEG: 85%, PNG: 85%, WebP: 85%)</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span>Compression supplémentaire si nécessaire (qualité: 70%)</span>
              </div>
              
              <div className="bg-blue-100 p-2 rounded text-xs">
                <strong>Processus :</strong> Analyse → Calcul du ratio optimal → Redimensionnement → Vérification → Compression si nécessaire
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
