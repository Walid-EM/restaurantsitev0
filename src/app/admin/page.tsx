'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import StrictAdminProtected from '../components/StrictAdminProtected';
import { 
  Package, 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  products: number;
  categories: number;
  extras: number;
  promos: number;
  supplements: number;
  sauces: number;
  accompagnements: number;
  boissons: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    extras: 0,
    promos: 0,
    supplements: 0,
    sauces: 0,
    accompagnements: 0,
    boissons: 0
  });

  useEffect(() => {
    // ✅ Charger les stats une fois que la session est confirmée
    if (status === 'authenticated' && session?.user.role === 'admin') {
      console.log("✅ Session admin valide, chargement des stats");
      fetchStats();
    }
  }, [session, status]);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, extrasRes, promosRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/extras'),
        fetch('/api/admin/promos')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setStats(prev => ({ ...prev, products: productsData.length || 0 }));
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setStats(prev => ({ ...prev, categories: categoriesData.length || 0 }));
      }

      if (extrasRes.ok) {
        const extrasData = await extrasRes.json();
        setStats(prev => ({ ...prev, extras: extrasData.length || 0 }));
      }

      if (promosRes.ok) {
        const promosData = await promosRes.json();
        setStats(prev => ({ ...prev, promos: promosData.length || 0 }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // ✅ Déconnexion sécurisée via notre API
      await fetch('/api/auth/secure-signout', { method: 'POST' });
      
      // ✅ Nettoyage complet du navigateur
      localStorage.clear();
      sessionStorage.clear();
      
      // ✅ Suppression des cookies NextAuth
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // ✅ Redirection forcée
      window.location.href = '/admin/login';
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Fallback : redirection directe
      window.location.href = '/admin/login';
    }
  };


  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: TrendingUp },
    { id: 'products', name: 'Produits', icon: Package },
    { id: 'categories', name: 'Catégories', icon: Tag },
    { id: 'supplements', name: 'Suppléments', icon: Plus },
    { id: 'sauces', name: 'Sauces', icon: Plus },
    { id: 'extras', name: 'Extras', icon: Plus },
    { id: 'accompagnements', name: 'Accompagnements', icon: Plus },
    { id: 'boissons', name: 'Boissons', icon: Plus },
    { id: 'promos', name: 'Promotions', icon: TrendingUp },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Produits</p>
              <p className="text-2xl font-bold text-white">{stats.products}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Catégories</p>
              <p className="text-2xl font-bold text-white">{stats.categories}</p>
            </div>
            <Tag className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suppléments</p>
              <p className="text-2xl font-bold text-white">{stats.supplements}</p>
            </div>
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Promotions</p>
              <p className="text-2xl font-bold text-white">{stats.promos}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('products')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Ajouter un produit
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Créer une catégorie
            </button>
            <button 
              onClick={() => setActiveTab('promos')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Créer une promotion
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Informations système</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Connecté en tant que: <span className="text-blue-400">{session?.user.email}</span></p>
            <p>Rôle: <span className="text-green-400">Administrateur</span></p>
            <p>Dernière connexion: <span className="text-gray-400">Maintenant</span></p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return <ProductsManager />;
      case 'categories':
        return <div className="text-white">Gestion des catégories - À implémenter</div>;
      case 'supplements':
        return <div className="text-white">Gestion des suppléments - À implémenter</div>;
      case 'sauces':
        return <div className="text-white">Gestion des sauces - À implémenter</div>;
      case 'extras':
        return <div className="text-white">Gestion des extras - À implémenter</div>;
      case 'accompagnements':
        return <div className="text-white">Gestion des accompagnements - À implémenter</div>;
      case 'boissons':
        return <div className="text-white">Gestion des boissons - À implémenter</div>;
      case 'promos':
        return <div className="text-white">Gestion des promotions - À implémenter</div>;
      case 'settings':
        return <div className="text-white">Paramètres - À implémenter</div>;
      default:
        return renderDashboard();
    }
  };

  // Composant de gestion des produits
  const ProductsManager = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (product: Product) => {
      setEditingProduct(product);
      setShowForm(true);
    };

    const handleDelete = async (productId: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            fetchProducts();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
        }
      }
    };

    if (loading) {
      return <div className="text-white">Chargement des produits...</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestion des Produits</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un produit</span>
          </button>
        </div>

        {showForm && (
          <ProductForm
            product={editingProduct || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSuccess={() => {
              fetchProducts();
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Composant de formulaire pour ajouter/éditer un produit
  const ProductForm = ({ product, onClose, onSuccess }: { 
    product?: Product; 
    onClose: () => void; 
    onSuccess: () => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || '',
      image: product?.image || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
        const method = product ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          onSuccess();
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-white mb-4">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom du produit
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Prix
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="12.50 €"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="assiette">Assiette</option>
                <option value="sandwich">Sandwich</option>
                <option value="tacos">Tacos</option>
                <option value="Bicky">Bicky</option>
                <option value="snacks">Snacks</option>
                <option value="dessert">Dessert</option>
                <option value="boissons">Boissons</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL de l'image
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="/image.png"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Sauvegarde...' : (product ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <StrictAdminProtected>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Delice Wand Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Bonjour, {session?.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation tabs */}
          <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            {renderTabContent()}
          </div>
        </div>
             </div>
     </StrictAdminProtected>
   );
 }
