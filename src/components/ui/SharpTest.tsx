'use client';

import { useState } from 'react';
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface SharpTestResult {
  success: boolean;
  sharpAvailable?: boolean;
  sharpVersion?: Record<string, string>;
  testResize?: {
    success: boolean;
    originalSize?: number;
    resizedSize?: number;
    error?: string;
  };
  error?: string;
  details?: string;
}

export default function SharpTest() {
  const [testResult, setTestResult] = useState<SharpTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testSharp = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-sharp');
      const result: SharpTestResult = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Erreur de connexion',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <TestTube className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-yellow-900">
              🧪 Test de Sharp (Redimensionnement)
            </h3>
            <button
              onClick={testSharp}
              disabled={isTesting}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              ) : (
                <TestTube className="w-4 h-4 inline mr-2" />
              )}
              {isTesting ? 'Test en cours...' : 'Tester Sharp'}
            </button>
          </div>
          
          <p className="text-sm text-yellow-700 mt-1">
            Vérifier que la bibliothèque Sharp fonctionne pour le redimensionnement automatique
          </p>
          
          {testResult && (
            <div className="mt-3 p-3 bg-white rounded border">
              <div className="flex items-center space-x-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">
                  {testResult.success ? 'Test réussi' : 'Test échoué'}
                </span>
              </div>
              
              <div className="text-xs space-y-1">
                <div><strong>Sharp disponible:</strong> {testResult.sharpAvailable ? '✅ Oui' : '❌ Non'}</div>
                
                {testResult.sharpVersion && (
                  <div><strong>Version Sharp:</strong> {JSON.stringify(testResult.sharpVersion)}</div>
                )}
                
                {testResult.testResize && (
                  <div>
                    <strong>Test redimensionnement:</strong> {testResult.testResize.success ? '✅ Réussi' : '❌ Échoué'}
                    {testResult.testResize.success && testResult.testResize.originalSize && testResult.testResize.resizedSize && (
                      <div className="ml-4 text-gray-600">
                        <div>Taille originale: {testResult.testResize.originalSize} bytes</div>
                        <div>Taille redimensionnée: {testResult.testResize.resizedSize} bytes</div>
                      </div>
                    )}
                    {testResult.testResize.error && (
                      <div className="ml-4 text-red-600">
                        Erreur: {testResult.testResize.error}
                      </div>
                    )}
                  </div>
                )}
                
                {testResult.error && (
                  <div className="text-red-600">
                    <strong>Erreur:</strong> {testResult.error}
                  </div>
                )}
                
                {testResult.details && (
                  <div className="text-red-600">
                    <strong>Détails:</strong> {testResult.details}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
