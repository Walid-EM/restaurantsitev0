'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import StrictAdminProtected from '../components/StrictAdminProtected';
import { adminApiGet, adminApiPost, adminApiPut, adminApiDelete } from '@/lib/adminApi';
import ApiTest from '../components/ApiTest';
import { 
  Package, 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Settings,
  LogOut,
  ShoppingCart,
  Users,
  Euro,
  AlertTriangle,
  Eye,
  EyeOff,
  Calendar,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrder: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  ingredients?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrder: 0
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'admin') {
      fetchDashboardData();
    }
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchOrders(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Pour l'instant, des données simulées
    // TODO: Créer une vraie API de statistiques
    setStats({
      totalRevenue: 15420,
      dailyRevenue: 1850,
      monthlyRevenue: 12300,
      pendingOrders: 8,
      totalProducts: 45,
      totalCustomers: 234,
      averageOrder: 28.50
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await adminApiGet('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await adminApiGet('/api/orders');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminApiGet('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/secure-signout', { method: 'POST' });
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      window.location.href = '/admin/login';
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'products', name: 'Produits', icon: Package },
    { id: 'categories', name: 'Catégories', icon: Tag },
    { id: 'orders', name: 'Commandes', icon: ShoppingCart },
    { id: 'customers', name: 'Clients', icon: Users },
    { id: 'analytics', name: 'Statistiques', icon: BarChart3 },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  // Dashboard principal
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventes du jour</p>
              <p className="text-2xl font-bold text-white">{stats.dailyRevenue}€</p>
              <p className="text-green-400 text-sm">+12% vs hier</p>
            </div>
            <Euro className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Commandes en attente</p>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
              <p className="text-orange-400 text-sm">À traiter</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total du mois</p>
              <p className="text-2xl font-bold text-white">{stats.monthlyRevenue}€</p>
              <p className="text-blue-400 text-sm">+8% vs mois dernier</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total produits</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
              <p className="text-blue-400 text-sm">En catalogue</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Section principale avec graphiques et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des ventes */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Ventes des 7 derniers jours</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Graphique des ventes à implémenter</p>
            </div>
          </div>
        </div>

        {/* Actions rapides et maintenance */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter un produit
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Voir les commandes
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Voir les statistiques
              </button>
            </div>
          </div>

          {/* Outils de maintenance */}
          <ApiTest />
        </div>
      </div>


    </div>
  );

  // Composant de formulaire pour ajouter/éditer un produit
  const ProductForm = ({ product, onClose, onSuccess }: { 
    product?: Product; 
    onClose: () => void; 
    onSuccess: () => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      category: product?.category || '',
      image: product?.image || '',
      isAvailable: product?.isAvailable ?? true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name.trim()) {
        showNotification('error', 'Le nom du produit est requis');
        return;
      }
      if (!formData.price.trim()) {
        showNotification('error', 'Le prix du produit est requis');
        return;
      }
      if (!formData.category) {
        showNotification('error', 'La catégorie du produit est requise');
        return;
      }
      
      setLoading(true);

      try {
        const url = product ? `/api/admin/products/${product._id}` : '/api/admin/products';
        const method = product ? 'PUT' : 'POST';

        const submitData = {
          ...formData,
          price: parseFloat(formData.price)
        };

        const response = method === 'PUT' 
          ? await adminApiPut(url, submitData)
          : await adminApiPost(url, submitData);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showNotification('success', product ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
            onSuccess();
          } else {
            showNotification('error', `Erreur: ${data.error}`);
          }
        } else {
          showNotification('error', 'Erreur lors de la sauvegarde du produit');
        }
      } catch (error) {
        showNotification('error', 'Erreur lors de la sauvegarde');
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom du produit *
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
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL de l&apos;image
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="/image.png"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-300">
                Produit disponible
              </label>
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

  // Gestion des produits
  const renderProducts = () => {
    const handleEdit = (product: Product) => {
      setEditingProduct(product);
      setShowForm(true);
    };

    const handleDelete = async (productId: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
          const response = await adminApiDelete(`/api/admin/products/${productId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              showNotification('success', 'Produit supprimé avec succès');
              fetchProducts();
            } else {
              showNotification('error', `Erreur: ${data.error}`);
            }
          } else {
            showNotification('error', 'Erreur lors de la suppression du produit');
          }
        } catch (error) {
          showNotification('error', 'Erreur lors de la suppression du produit');
          console.error('Erreur:', error);
        }
      }
    };

    const toggleProductAvailability = async (product: Product) => {
      try {
        const response = await adminApiPut(`/api/admin/products/${product._id}`, {
          ...product,
          isAvailable: !product.isAvailable
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showNotification('success', 
              product.isAvailable ? 'Produit désactivé' : 'Produit activé'
            );
            fetchProducts();
          }
        }
      } catch (error) {
        showNotification('error', 'Erreur lors de la modification');
        console.error('Erreur:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestion des Produits</h2>
          <div className="flex space-x-3">
            <button
              onClick={fetchProducts}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄 Rafraîchir</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un produit</span>
            </button>
          </div>
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

        {products.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-300">
              Commencez par ajouter votre premier produit en utilisant le bouton ci-dessus.
            </p>
          </div>
        ) : (
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
                      État
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Image
                          src={product.image || '/placeholder.png'}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-gray-400 text-sm truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {product.price}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleProductAvailability(product)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                            product.isAvailable 
                              ? 'bg-green-700 text-green-200 hover:bg-green-600' 
                              : 'bg-red-700 text-red-200 hover:bg-red-600'
                          }`}
                        >
                          {product.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{product.isAvailable ? 'En ligne' : 'Hors ligne'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Supprimer"
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
        )}
      </div>
    );
  };

  // Gestion des commandes
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Commandes</h2>
        <div className="flex space-x-3">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
          <button 
            onClick={fetchOrders}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Rafraîchir
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Commandes récentes</h3>
        <div className="text-gray-400 text-center py-8">
          <ShoppingCart className="w-16 h-16 mx-auto opacity-50 mb-4" />
          <p>Système de commandes à implémenter</p>
          <p className="text-sm mt-2">API /api/orders prête à être utilisée</p>
        </div>
      </div>
    </div>
  );

  // Gestion des catégories
  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Catégories</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-gray-400 text-center py-8">
          <Tag className="w-16 h-16 mx-auto opacity-50 mb-4" />
          <p>Gestion des catégories à implémenter</p>
        </div>
      </div>
    </div>
  );

  // Gestion des clients
  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Clients</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-gray-400 text-center py-8">
          <Users className="w-16 h-16 mx-auto opacity-50 mb-4" />
          <p>Gestion des clients à implémenter</p>
        </div>
      </div>
    </div>
  );

  // Statistiques et analyses
  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Statistiques & Analyses</h2>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Chiffre d&apos;affaires</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Aujourd&apos;hui</span>
              <span className="text-white font-medium">{stats.dailyRevenue}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ce mois</span>
              <span className="text-white font-medium">{stats.monthlyRevenue}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Panier moyen</span>
              <span className="text-white font-medium">{stats.averageOrder}€</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Ventes par catégorie</h3>
          <div className="text-gray-400 text-center py-4">
            <PieChart className="w-12 h-12 mx-auto opacity-50 mb-2" />
            <p className="text-sm">Graphique à implémenter</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Produits populaires</h3>
          <div className="text-gray-400 text-center py-4">
            <TrendingUp className="w-12 h-12 mx-auto opacity-50 mb-2" />
            <p className="text-sm">Top produits à implémenter</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Paramètres
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Paramètres</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Informations du restaurant</h3>
          <div className="text-gray-400 text-center py-8">
            <Settings className="w-16 h-16 mx-auto opacity-50 mb-4" />
            <p>Configuration du restaurant à implémenter</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Modes de paiement</h3>
          <div className="text-gray-400 text-center py-8">
            <Euro className="w-16 h-16 mx-auto opacity-50 mb-4" />
            <p>Configuration des paiements à implémenter</p>
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
        return renderProducts();
      case 'categories':
        return renderCategories();
      case 'orders':
        return renderOrders();
      case 'customers':
        return renderCustomers();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <StrictAdminProtected>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Chargement du dashboard...</div>
        </div>
      </StrictAdminProtected>
    );
  }

  return (
    <StrictAdminProtected>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">🍽️ Delice Wand Admin</h1>
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
          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg border ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Navigation tabs */}
          <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
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
