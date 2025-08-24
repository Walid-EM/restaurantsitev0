'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  fileName: string;
  originalSize: number;
  resizedSize: number;
  reduction: string;
  success: boolean;
}

export default function ClientResizeTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Fonction de redimensionnement côté client (copiée de AdminImageUpload.tsx)
  const resizeImageClientSide = (file: File, maxSizeMB: number = 4.5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        const currentSizeMB = file.size / (1024 * 1024);
        if (currentSizeMB <= maxSizeMB) {
          // Image déjà dans la limite
          resolve(file);
          return;
        }
        
        // Calculer le ratio de réduction
        const reductionRatio = Math.sqrt(maxSizeMB / currentSizeMB) * 0.9; // Marge de sécurité
        const newWidth = Math.round(img.width * reductionRatio);
        const newHeight = Math.round(img.height * reductionRatio);
        
        // Redimensionner
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convertir en Blob puis File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            console.log(`🔄 Image redimensionnée côté client: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(resizedFile.size / 1024 / 1024).toFixed(2)} MB`);
            resolve(resizedFile);
          } else {
            reject(new Error('Erreur lors de la conversion du canvas'));
          }
        }, 'image/jpeg', 0.85); // Qualité 85%
      };
      
      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileTest = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsTesting(true);
    const results: TestResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`🧪 Test de redimensionnement: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        const resizedFile = await resizeImageClientSide(file, 4.5);
        
        const reduction = ((1 - resizedFile.size / file.size) * 100).toFixed(1);
        
        results.push({
          fileName: file.name,
          originalSize: file.size,
          resizedSize: resizedFile.size,
          reduction: `${reduction}%`,
          success: true
        });
        
        console.log(`✅ Test réussi: ${file.name} - Réduction: ${reduction}%`);
        
      } catch (error) {
        console.error(`❌ Test échoué: ${file.name}`, error);
        results.push({
          fileName: file.name,
          originalSize: file.size,
          resizedSize: file.size,
          reduction: '0%',
          success: false
        });
      }
    }

    setTestResults(results);
    setIsTesting(false);
    
    // Réinitialiser l'input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🧪 Test Redimensionnement Côté Client
      </h3>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Testez le redimensionnement automatique des images de grande taille avant l&apos;upload.
          Les images de plus de 4.5 MB seront automatiquement redimensionnées.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Sélectionnez des images à tester
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileTest}
            disabled={isTesting}
            className="hidden"
            id="test-resize-input"
          />
          <label
            htmlFor="test-resize-input"
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              isTesting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isTesting ? 'Test en cours...' : 'Sélectionner des images'}
          </label>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Résultats des tests :</h4>
          
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{result.fileName}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(result.originalSize)} → {formatFileSize(result.resizedSize)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    result.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.reduction}
                  </p>
                  <p className="text-xs text-gray-500">
                    {result.success ? 'Réduction' : 'Échec'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
                          <strong>Note :</strong> Ce test simule le redimensionnement qui sera effectué 
            automatiquement lors de l&apos;upload vers GitHub pour éviter l&apos;erreur 413.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
