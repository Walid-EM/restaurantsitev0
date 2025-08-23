'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminImageSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const response = await fetch('/api/admin/sync-images', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setSyncStatus({ 
          type: 'success', 
          message: `Synchronisation réussie ! ${result.synced} images synchronisées sur ${result.total} total.${result.rebuildTriggered ? ' Rebuild Vercel déclenché.' : ''}` 
        });
        setLastSync(new Date());
      } else {
        setSyncStatus({ type: 'error', message: result.error || 'Erreur de synchronisation' });
      }
    } catch (error) {
      console.error('Erreur sync:', error);
      setSyncStatus({ type: 'error', message: 'Erreur de connexion' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Synchronisation des Images
        </h3>
        {lastSync && (
          <span className="text-sm text-gray-500">
            Dernière sync: {lastSync.toLocaleString('fr-FR')}
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4">
        Synchronise toutes les images Cloudinary vers le projet local et déclenche un rebuild Vercel.
        <br />
        <strong>Important :</strong> Les images ne s'affichent sur le site public qu'après synchronisation locale.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSyncing ? 'Synchronisation...' : '🔄 Synchroniser et Rebuilder'}
      </motion.button>

      {syncStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg ${
            syncStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
            }`}
        >
          {syncStatus.message}
        </motion.div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>• Les images sont automatiquement synchronisées via le webhook Cloudinary</p>
        <p>• Utilisez ce bouton pour forcer une synchronisation complète</p>
        <p>• Le rebuild Vercel est automatiquement déclenché après la sync</p>
      </div>
    </div>
  );
}
