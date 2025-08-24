'use client';

import React, { useState } from 'react';

interface SharpTestResult {
  success: boolean;
  sharpAvailable: boolean;
  sharpVersion: Record<string, string>;
  testResults: {
    original: {
      size: number;
      sizeKB: string;
    };
    resizedDown: {
      size: number;
      sizeKB: string;
      reduction: string;
    };
    resizedUp: {
      size: number;
      sizeKB: string;
      increase: string;
    };
    compressed: {
      size: number;
      sizeKB: string;
      reduction: string;
    };
  };
  message: string;
}

export default function SharpTest() {
  const [testResult, setTestResult] = useState<SharpTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testSharp = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-sharp');
      const result: SharpTestResult = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Erreur lors du test Sharp:', error);
      setTestResult({
        success: false,
        sharpAvailable: false,
        sharpVersion: {},
        testResults: {
          original: { size: 0, sizeKB: '0' },
          resizedDown: { size: 0, sizeKB: '0', reduction: '0' },
          resizedUp: { size: 0, sizeKB: '0', increase: '0' },
          compressed: { size: 0, sizeKB: '0', reduction: '0' }
        },
        message: 'Erreur lors du test'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">🧪 Test Sharp (Redimensionnement d&apos;images)</h3>
      
      <button
        onClick={testSharp}
        disabled={isTesting}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mb-4"
      >
        {isTesting ? 'Test en cours...' : 'Tester Sharp'}
      </button>

      {testResult && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-2">📦 Disponibilité Sharp</h4>
            <p className={`text-sm ${testResult.sharpAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.sharpAvailable ? '✅ Oui' : '❌ Non'}
            </p>
          </div>

          {testResult.sharpAvailable && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">🔧 Version Sharp</h4>
                <p className="text-sm text-gray-600">
                  Sharp: {testResult.sharpVersion.sharp || 'N/A'}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">📊 Résultats des Tests</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-700">🖼️ Image Originale</h5>
                    <p className="text-gray-600">Taille: {testResult.testResults.original.sizeKB} KB</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-700">📉 Redimensionnement ↓ (50x50)</h5>
                    <p className="text-gray-600">Taille: {testResult.testResults.resizedDown.sizeKB} KB</p>
                    <p className="text-green-600">Réduction: {testResult.testResults.resizedDown.reduction}%</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-700">📈 Redimensionnement ↑ (200x200)</h5>
                    <p className="text-gray-600">Taille: {testResult.testResults.resizedUp.sizeKB} KB</p>
                    <p className="text-orange-600">Augmentation: {testResult.testResults.resizedUp.increase}%</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-700">🗜️ Compression (Qualité 50%)</h5>
                    <p className="text-gray-600">Taille: {testResult.testResults.compressed.sizeKB} KB</p>
                    <p className="text-green-600">Réduction: {testResult.testResults.compressed.reduction}%</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Explication :</strong> Le redimensionnement vers le bas (50x50) et la compression 
                    réduisent la taille, tandis que le redimensionnement vers le haut (200x200) l&apos;augmente. 
                    C&apos;est exactement le comportement attendu pour l&apos;optimisation automatique !
                  </p>
                </div>
              </div>
            </>
          )}

          {!testResult.success && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-red-800 mb-2">❌ Erreur</h4>
              <p className="text-sm text-red-600">{testResult.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
