'use client';

import React from 'react';
import ImageWorkflowManager from './ImageWorkflowManager';

export default function ImageWorkflowManagerTest() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🧪 Test du Composant ImageWorkflowManager
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ImageWorkflowManager />
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📋 Instructions de Test
          </h2>
          <ul className="text-blue-700 space-y-2">
            <li>• Glissez-déposez des images dans la zone ou cliquez pour sélectionner</li>
            <li>• Vérifiez que les images s&apos;affichent avec prévisualisation</li>
            <li>• Testez avec des images &gt; 4.5 MB pour vérifier la compression</li>
            <li>• Cliquez sur &quot;Ajouter à Git&quot; pour tester l&apos;upload</li>
            <li>• Vérifiez les notifications et la progression</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
