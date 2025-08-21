'use client';

import { useState, useEffect } from 'react';
import { getCategoriesWithSteps, getSupplements, getExtra, getSauces, getAccompagnements, getBoissons, refreshCache } from '../../lib/dataService';
import { Button } from './button';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  dataCount?: number;
  error?: string;
}

export default function IntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'running' | 'success' | 'error'>('pending');

  const tests = [
    { name: 'Connexion MongoDB', test: () => getCategoriesWithSteps() },
    { name: 'Chargement des Catégories', test: () => getCategoriesWithSteps() },
    { name: 'Chargement des Suppléments', test: () => getSupplements() },
    { name: 'Chargement des Extras', test: () => getExtra() },
    { name: 'Chargement des Sauces', test: () => getSauces() },
    { name: 'Chargement des Accompagnements', test: () => getAccompagnements() },
    { name: 'Chargement des Boissons', test: () => getBoissons() },
    { name: 'Test du Cache (Premier appel)', test: () => getCategoriesWithSteps() },
    { name: 'Test du Cache (Deuxième appel)', test: () => getCategoriesWithSteps() },
    { name: 'Test du Cache (Après rafraîchissement)', test: async () => { refreshCache(); return getCategoriesWithSteps(); } }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    // Initialiser tous les tests
    const initialResults = tests.map(test => ({
      name: test.name,
      status: 'pending' as const
    }));
    setTestResults(initialResults);

    const results: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      // Marquer le test comme en cours
      setTestResults(prev => prev.map((r, idx) => 
        idx === i ? { ...r, status: 'running' } : r
      ));

      const start = performance.now();
      
      try {
        const data = await test.test();
        const end = performance.now();
        const duration = end - start;

        results.push({
          name: test.name,
          status: 'success',
          duration: Math.round(duration),
          dataCount: Array.isArray(data) ? data.length : 1
        });

        // Mettre à jour l'affichage
        setTestResults(prev => prev.map((r, idx) => 
          idx === i ? { 
            name: test.name, 
            status: 'success', 
            duration: Math.round(duration), 
            dataCount: Array.isArray(data) ? data.length : 1 
          } : r
        ));

        console.log(`✅ ${test.name}: ${Math.round(duration)}ms, ${Array.isArray(data) ? data.length : 1} données`);
        
      } catch (error) {
        const end = performance.now();
        const duration = end - start;
        
        results.push({
          name: test.name,
          status: 'error',
          duration: Math.round(duration),
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });

        // Mettre à jour l'affichage
        setTestResults(prev => prev.map((r, idx) => 
          idx === i ? { 
            name: test.name, 
            status: 'error', 
            duration: Math.round(duration), 
            error: error instanceof Error ? error.message : 'Erreur inconnue' 
          } : r
        ));

        console.error(`❌ ${test.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Analyser les résultats finaux
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (errorCount === 0) {
      setOverallStatus('success');
      console.log(`🎉 Tous les tests sont passés avec succès ! (${successCount}/${tests.length})`);
    } else {
      setOverallStatus('error');
      console.log(`⚠️ ${errorCount} test(s) ont échoué sur ${tests.length}`);
    }

    setIsRunning(false);
  };

  const runSingleTest = async (index: number) => {
    const test = tests[index];
    
    setTestResults(prev => prev.map((r, idx) => 
      idx === index ? { ...r, status: 'running' } : r
    ));

    const start = performance.now();
    
    try {
      const data = await test.test();
      const end = performance.now();
      const duration = end - start;

      setTestResults(prev => prev.map((r, idx) => 
        idx === index ? { 
          name: test.name, 
          status: 'success', 
          duration: Math.round(duration), 
          dataCount: Array.isArray(data) ? data.length : 1 
        } : r
      ));

      console.log(`✅ ${test.name}: ${Math.round(duration)}ms, ${Array.isArray(data) ? data.length : 1} données`);
      
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      setTestResults(prev => prev.map((r, idx) => 
        idx === index ? { 
          name: test.name, 
          status: 'error', 
          duration: Math.round(duration), 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        } : r
      ));

      console.error(`❌ ${test.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const resetTests = () => {
    setTestResults(tests.map(test => ({
      name: test.name,
      status: 'pending' as const
    })));
    setOverallStatus('pending');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'running': return 'text-blue-500';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🧪 Test d&apos;Intégration MongoDB Complet
        </h3>
        <p className="text-gray-600 text-sm">
          Test automatisé de tous les composants et services MongoDB
        </p>
      </div>

      {/* Statut global */}
      <div className={`rounded-lg p-4 text-center ${getOverallStatusColor()}`}>
        <h4 className="font-medium mb-2">Statut Global</h4>
        <p className="text-lg">
          {overallStatus === 'pending' && '⏳ Prêt à tester'}
          {overallStatus === 'running' && '🔄 Tests en cours...'}
          {overallStatus === 'success' && '🎉 Tous les tests sont passés !'}
          {overallStatus === 'error' && '⚠️ Certains tests ont échoué'}
        </p>
      </div>

      {/* Boutons de contrôle */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          variant="default"
          size="lg"
        >
          {isRunning ? '⏳ Tests en cours...' : '🚀 Lancer Tous les Tests'}
        </Button>
        
        <Button
          onClick={resetTests}
          disabled={isRunning}
          variant="outline"
          size="sm"
        >
          🔄 Réinitialiser
        </Button>
        
        <Button
          onClick={() => refreshCache()}
          disabled={isRunning}
          variant="outline"
          size="sm"
        >
          💾 Vider le Cache
        </Button>
      </div>

      {/* Résultats des tests */}
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getStatusIcon(result.status)}</span>
                <div>
                  <h5 className={`font-medium ${getStatusColor(result.status)}`}>
                    {result.name}
                  </h5>
                  {result.error && (
                    <p className="text-sm text-red-600 mt-1">{result.error}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {result.status === 'running' && (
                  <Button
                    onClick={() => runSingleTest(index)}
                    disabled={true}
                    variant="outline"
                    size="sm"
                  >
                    🔄 En cours...
                  </Button>
                )}
                
                {result.status === 'pending' && (
                  <Button
                    onClick={() => runSingleTest(index)}
                    variant="outline"
                    size="sm"
                  >
                    ▶️ Tester
                  </Button>
                )}
                
                {result.status === 'error' && (
                  <Button
                    onClick={() => runSingleTest(index)}
                    variant="outline"
                    size="sm"
                  >
                    🔄 Réessayer
                  </Button>
                )}
                
                {result.status === 'success' && (
                  <div className="text-sm text-gray-600">
                    <div>⏱️ {result.duration}ms</div>
                    <div>📊 {result.dataCount} données</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé des performances */}
      {testResults.some(r => r.status === 'success') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">📊 Résumé des Performances</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
            <div>
              <div className="font-medium">Tests réussis</div>
              <div>{testResults.filter(r => r.status === 'success').length}/{testResults.length}</div>
            </div>
            <div>
              <div className="font-medium">Tests échoués</div>
              <div>{testResults.filter(r => r.status === 'error').length}</div>
            </div>
            <div>
              <div className="font-medium">Durée moyenne</div>
              <div>
                {Math.round(
                  testResults
                    .filter(r => r.status === 'success' && r.duration)
                    .reduce((sum, r) => sum + (r.duration || 0), 0) / 
                  testResults.filter(r => r.status === 'success').length
                )}ms
              </div>
            </div>
            <div>
              <div className="font-medium">Cache actif</div>
              <div>{testResults.some(r => r.name.includes('Cache') && r.status === 'success') ? '✅' : '❌'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">📋 Instructions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Cliquez sur &quot;Lancer Tous les Tests&quot; pour tester l&apos;intégration complète</li>
          <li>• Chaque test peut être relancé individuellement</li>
          <li>• Surveillez la console pour les logs détaillés</li>
          <li>• Vérifiez que le cache améliore les performances</li>
        </ul>
      </div>
    </div>
  );
}

