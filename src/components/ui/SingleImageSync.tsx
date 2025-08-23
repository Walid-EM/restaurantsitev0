'use client';

import { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SingleImageSyncProps {
  cloudinaryUrl: string;
  imageName?: string;
  onSyncComplete?: (data: any) => void;
}

export default function SingleImageSync({ 
  cloudinaryUrl, 
  imageName, 
  onSyncComplete 
}: SingleImageSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleSync = async () => {
    if (!cloudinaryUrl) {
      setSyncStatus('error');
      setSyncMessage('URL Cloudinary manquante');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('Synchronisation en cours...');

    try {
      const response = await fetch('/api/admin/sync-single-image-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudinaryUrl,
          imageName: imageName || 'image_sync'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSyncStatus('success');
        setSyncMessage(`Image synchronisée : ${result.data.fileName}`);
        
        // Appeler le callback si fourni
        if (onSyncComplete) {
          onSyncComplete(result.data);
        }
      } else {
        setSyncStatus('error');
        setSyncMessage(`Erreur : ${result.error}`);
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Erreur de connexion : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    if (isSyncing) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (syncStatus === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (syncStatus === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Download className="w-4 h-4" />;
  };

  const getButtonClass = () => {
    let baseClass = "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    if (isSyncing) {
      return `${baseClass} bg-blue-100 text-blue-700 cursor-not-allowed`;
    }
    
    switch (syncStatus) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500`;
      case 'error':
        return `${baseClass} bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500`;
      default:
        return `${baseClass} bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500`;
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={getButtonClass()}
        title="Synchroniser cette image vers le projet local"
      >
        {getStatusIcon()}
        <span className="ml-2">
          {isSyncing ? 'Synchronisation...' : 'Synchroniser Localement'}
        </span>
      </button>

      {syncMessage && (
        <div className={`text-sm p-2 rounded-lg ${
          syncStatus === 'success' ? 'bg-green-50 text-green-700' :
          syncStatus === 'error' ? 'bg-red-50 text-red-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {syncMessage}
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>• L'image sera téléchargée dans <code>/public/images/uploads/</code></p>
        <p>• Elle sera accessible via le composant <code>MongoImage</code></p>
        <p>• Utilisez ce bouton pour tester la synchronisation individuelle</p>
      </div>
    </div>
  );
}
