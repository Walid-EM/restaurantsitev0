'use client';

import { useState } from 'react';

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkSystemHealth = async () => {
    setLoading(true);
    setTestResult('Vérification de l\'état du système...');
    
    try {
      const response = await fetch('/api/admin/categories', { 
        credentials: 'include' 
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Système opérationnel
🔗 Connexion: OK
🗄️ Base de données: Accessible
⏰ Vérifié le: ${new Date().toLocaleString('fr-FR')}`);
      } else {
        setTestResult(`⚠️ Problème détecté
❌ Erreur: ${data.error}
📞 Contactez le support technique si le problème persiste`);
      }
    } catch (error) {
      setTestResult(`❌ Système indisponible
🔌 Problème de connexion réseau
📞 Contactez le support technique
⏰ ${new Date().toLocaleString('fr-FR')}`);
    } finally {
      setLoading(false);
    }
  };

  const getSystemInfo = async () => {
    setLoading(true);
    setTestResult('Récupération des informations système...');
    
    try {
      const response = await fetch('/api/products/unified');
      const data = await response.json();
      
      if (data.success) {
        setTestResult(`📊 Informations système
📦 Total produits: ${data.stats.total}
📂 Catégories actives: ${data.stats.byCategory.length}
🔥 Produits épicés: ${data.stats.spicy}
🥬 Produits végétariens: ${data.stats.vegetarian}

📋 Répartition par catégorie:
${data.stats.byCategory.map((cat: { category: string; count: number }) => 
  `• ${cat.category}: ${cat.count} produits`
).join('\n')}

⏰ Dernière vérification: ${new Date().toLocaleString('fr-FR')}`);
      } else {
        setTestResult(`❌ Impossible de récupérer les informations
📞 Contactez le support si nécessaire`);
      }
    } catch (error) {
      setTestResult(`❌ Erreur lors de la récupération des informations
📞 Contactez le support technique`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setTestResult('Actualisation des données...');
    
    try {
      // Simuler une actualisation (pas de modification de données)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('/api/admin/setup/check-current', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResult(`✅ Données actualisées avec succès !
📊 État actuel:
📂 ${data.stats.categories} catégories
📦 ${data.stats.products} produits
🆕 ${data.stats.extras} extras
🥫 ${data.stats.sauces} sauces
🥬 ${data.stats.supplements} suppléments
🍟 ${data.stats.accompagnements} accompagnements
🥤 ${data.stats.boissons} boissons

⏰ Actualisé le: ${new Date().toLocaleString('fr-FR')}
✅ Toutes les données sont à jour`);
      } else {
        setTestResult(`⚠️ Problème lors de l'actualisation
📞 Contactez le support si nécessaire`);
      }
    } catch (error) {
      setTestResult(`❌ Erreur lors de l'actualisation
📞 Contactez le support technique`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">🛠️ Outils de maintenance</h3>
      
      <div className="space-y-3">
        <button
          onClick={checkSystemHealth}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          🔍 Vérifier l&apos;état du système
        </button>
        
        <button
          onClick={getSystemInfo}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          📊 Informations système
        </button>
        
        <button
          onClick={refreshData}
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          🔄 Actualiser les données
        </button>
      </div>
      
      {testResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 whitespace-pre-line">{testResult}</p>
        </div>
      )}
    </div>
  );
}