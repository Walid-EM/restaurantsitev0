'use client';
import React, { useState } from 'react';

interface SharpSimpleTestResult {
  success: boolean;
  sharpAvailable?: boolean;
  testResize?: string;
  originalSize?: number;
  resizedSize?: number;
  error?: string;
  details?: string;
  sharpType?: string;
  sharpKeys?: string[];
}

export default function SharpSimpleTest() {
  const [result, setResult] = useState<SharpSimpleTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testSharpSimple = async () => {
    setIsTesting(true);
    setResult(null);
    
    try {
      console.log('🧪 Test Sharp Simple - Début');
      const response = await fetch('/api/test-sharp-simple');
      const data = await response.json();
      
      console.log('📊 Résultat API:', data);
      setResult(data);
      
    } catch (error) {
      console.error('❌ Erreur test:', error);
      setResult({
        success: false,
        error: 'Erreur réseau',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">🧪 Test Sharp Simple (Diagnostic)</h3>
      
      <button
        onClick={testSharpSimple}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? 'Test en cours...' : 'Tester Sharp Simple'}
      </button>

      {result && (
        <div className="mt-4 p-3 border rounded">
          <h4 className="font-medium mb-2">Résultat du test :</h4>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Statut:</span> 
              <span className={`ml-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅ Succès' : '❌ Échec'}
              </span>
            </div>
            
            {result.sharpAvailable !== undefined && (
              <div>
                <span className="font-medium">Sharp disponible:</span> 
                <span className={`ml-2 ${result.sharpAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {result.sharpAvailable ? '✅ Oui' : '❌ Non'}
                </span>
              </div>
            )}
            
            {result.testResize && (
              <div>
                <span className="font-medium">Test redimensionnement:</span> 
                <span className={`ml-2 ${result.testResize === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.testResize === 'success' ? '✅ Réussi' : '❌ Échoué'}
                </span>
              </div>
            )}
            
            {result.originalSize && result.resizedSize && (
              <div>
                <span className="font-medium">Taille test:</span> 
                <span className="ml-2">
                  {result.originalSize} → {result.resizedSize} bytes
                </span>
              </div>
            )}
            
            {result.error && (
              <div>
                <span className="font-medium text-red-600">Erreur:</span> 
                <span className="ml-2 text-red-600">{result.error}</span>
              </div>
            )}
            
            {result.details && (
              <div>
                <span className="font-medium">Détails:</span> 
                <span className="ml-2 text-gray-600">{result.details}</span>
              </div>
            )}
            
            {result.sharpType && (
              <div>
                <span className="font-medium">Type Sharp:</span> 
                <span className="ml-2 text-gray-600">{result.sharpType}</span>
              </div>
            )}
            
            {result.sharpKeys && (
              <div>
                <span className="font-medium">Clés Sharp:</span> 
                <span className="ml-2 text-gray-600">{result.sharpKeys.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
