'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Création de l\'administrateur...');
      
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Réponse reçue:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('✅ Administrateur créé avec succès ! Redirection vers la page de connexion...');
          setTimeout(() => {
            router.push('/admin/login');
          }, 3000);
        } else {
          setMessage('❌ ' + (data.error || 'Erreur lors de la création'));
        }
      } else {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        setMessage(`❌ Erreur HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setMessage('❌ Erreur de connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Delice Wand</h1>
          <h2 className="text-2xl font-semibold text-gray-300">Configuration Admin</h2>
          <p className="text-gray-400 text-sm mt-2">Créer le premier compte administrateur</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nom complet *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@delicewand.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe * (min. 6 caractères)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅') 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}>
                <p className={`text-sm ${
                  message.includes('✅') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25"
            >
                              {loading ? '🔄 Création en cours...' : '🚀 Créer l&apos;administrateur'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            ⚠️ Cette page ne sera accessible qu&apos;une seule fois
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Après la création, utilisez la page de connexion
          </p>
        </div>
      </div>
    </div>
  );
}
