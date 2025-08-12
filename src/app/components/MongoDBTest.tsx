'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  database?: string;
  collections?: string[];
  timestamp?: string;
  error?: string;
}

export default function MongoDBTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mongodb-test');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erreur lors du test',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Test MongoDB Atlas</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester la connexion'}
      </button>

      {testResult && (
        <div className="mt-4 p-4 rounded border">
          <div className={`text-lg font-semibold ${
            testResult.success ? 'text-green-600' : 'text-red-600'
          }`}>
            {testResult.message}
          </div>
          
          {testResult.success && (
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Base de données:</strong> {testResult.database}</p>
              <p><strong>Collections:</strong> {testResult.collections?.join(', ') || 'Aucune'}</p>
              <p><strong>Timestamp:</strong> {testResult.timestamp}</p>
            </div>
          )}
          
          {testResult.error && (
            <div className="mt-2 text-sm text-red-600">
              <p><strong>Erreur:</strong> {testResult.error}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong> Assurez-vous d'avoir créé le fichier <code>.env.local</code> avec votre chaîne de connexion MongoDB Atlas.</p>
        <p>Remplacez <code>&lt;db_password&gt;</code> par votre vrai mot de passe dans la variable <code>MONGODB_URI</code>.</p>
      </div>
    </div>
  );
}
