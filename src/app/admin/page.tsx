'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StrictAdminProtected from '../components/StrictAdminProtected';
import { adminApiGet, adminApiPost, adminApiPut, adminApiDelete, adminApiReorderCategories } from '@/lib/adminApi';
import ApiTest from '../components/ApiTest';
import AdminImageUpload from '@/components/ui/AdminImageUpload';
import AdminImageDisplay from '@/components/ui/AdminImageDisplay';
import AdminImageManager from '@/components/ui/AdminImageManager';
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
  Eye,
  EyeOff,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Clock,
  Wifi,
  X,
  Image as ImageIcon
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
  imageId?: string;
  isAvailable: boolean;
  ingredients?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
}



interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageId?: string;
  isActive: boolean;
  allowedOptions?: string[];
  order: number;
}

interface Supplement {
  _id: string;
  id: string;
  name: string;
  image?: string;
  imageId?: string;
  price: number;
  type: 'boissons' | 'accompagnements' | 'extras' | 'sauces' | 'supplements';
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showSupplementForm, setShowSupplementForm] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  
  // États pour les filtres de suppléments
  const [supplementFilters, setSupplementFilters] = useState({
    type: 'all',
    search: ''
  });
  const [supplementSortBy, setSupplementSortBy] = useState<'name' | 'price' | 'type'>('name');
  
  // États pour la gestion des catégories
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // États pour la connexion POS
  const [showPosConnectionDialog, setShowPosConnectionDialog] = useState(false);

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
        fetchCategories(),
        fetchSupplements()
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



  const fetchCategories = async () => {
    try {
      const response = await adminApiGet('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.categories)) {
          // Trier les catégories par ordre
          const sortedCategories = data.categories.sort((a: Category, b: Category) => 
            (a.order || 0) - (b.order || 0)
          );
          setCategories(sortedCategories);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Fonction pour réorganiser les catégories (optimisée avec MongoDB)
  const reorderCategories = async (draggedId: string, targetId: string) => {
    try {
      console.log('🔄 Début de la réorganisation:', { draggedId, targetId });
      
      const draggedCategory = categories.find(cat => cat._id === draggedId);
      const targetCategory = categories.find(cat => cat._id === targetId);
      
      if (!draggedCategory || !targetCategory) {
        console.log('❌ Catégories non trouvées');
        return;
      }

      const newCategories = [...categories];
      const draggedIndex = newCategories.findIndex(cat => cat._id === draggedId);
      const targetIndex = newCategories.findIndex(cat => cat._id === targetId);

      console.log('📊 Positions:', { draggedIndex, targetIndex });

      // Retirer la catégorie déplacée
      const [draggedItem] = newCategories.splice(draggedIndex, 1);
      
      // Insérer la catégorie déplacée à la nouvelle position
      newCategories.splice(targetIndex, 0, draggedItem);

      // Mettre à jour l'ordre de toutes les catégories
      const updatedCategories = newCategories.map((cat, index) => ({
        ...cat,
        order: index + 1
      }));

      console.log('📝 Nouvel ordre calculé:', updatedCategories.map(c => ({ name: c.name, order: c.order })));

      // Mettre à jour l'état local immédiatement
      setCategories(updatedCategories);

      // Sauvegarder automatiquement à la base de données
      const categoryOrders = updatedCategories.map(cat => ({
        _id: cat._id,
        order: cat.order
      }));

      console.log('📤 Sauvegarde automatique à la base de données:', categoryOrders);
      const response = await adminApiReorderCategories(categoryOrders);
      
      console.log('📥 Réponse API:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Données de réponse:', data);
        
        if (data.success) {
          showNotification('success', 'Ordre des catégories mis à jour et sauvegardé automatiquement');
        } else {
          throw new Error(data.error || 'Erreur lors de la sauvegarde');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

    } catch (error) {
      console.error('❌ Erreur lors de la réorganisation:', error);
      showNotification('error', 'Erreur lors de la réorganisation des catégories');
      // Recharger les catégories en cas d'erreur pour restaurer l'état
      fetchCategories();
    }
  };

  const fetchSupplements = async () => {
    try {
      // Récupérer tous les types de suppléments en parallèle
      const [boissonsRes, accompagnementsRes, extrasRes, saucesRes, supplementsRes] = await Promise.all([
        adminApiGet('/api/boissons'),
        adminApiGet('/api/accompagnements'),
        adminApiGet('/api/extras'),
        adminApiGet('/api/sauces'),
        adminApiGet('/api/supplements')
      ]);

      const allSupplements: Supplement[] = [];

      if (boissonsRes.ok) {
        const data = await boissonsRes.json();
        if (data.success && Array.isArray(data.boissons) && data.boissons.length > 0) {
          allSupplements.push(...data.boissons.map((item: { _id: string; id: string; name: string; image?: string; price: number }) => ({ 
            ...item, 
            type: 'boissons' as const,
            // Utiliser une image par défaut si l'image n'existe pas ou est invalide
            image: item.image && !item.image.includes('undefined') ? item.image : '/Coca.png'
          })));
        }
      }

      if (accompagnementsRes.ok) {
        const data = await accompagnementsRes.json();
        if (data.success && Array.isArray(data.accompagnements) && data.accompagnements.length > 0) {
          allSupplements.push(...data.accompagnements.map((item: { _id: string; id: string; name: string; image?: string; price: number }) => ({ 
            ...item, 
            type: 'accompagnements' as const,
            image: item.image && !item.image.includes('undefined') ? item.image : '/Frites.png'
          })));
        }
      }

      if (extrasRes.ok) {
        const data = await extrasRes.json();
        if (data.success && Array.isArray(data.extras) && data.extras.length > 0) {
          allSupplements.push(...data.extras.map((item: { _id: string; id: string; name: string; image?: string; price: number }) => ({ 
            ...item, 
            type: 'extras' as const,
            image: item.image && !item.image.includes('undefined') ? item.image : '/Sauceicone.png'
          })));
        }
      }

      if (saucesRes.ok) {
        const data = await saucesRes.json();
        if (data.success && Array.isArray(data.sauces) && data.sauces.length > 0) {
          allSupplements.push(...data.sauces.map((item: { _id: string; id: string; name: string; image?: string; price: number }) => ({ 
            ...item, 
            type: 'sauces' as const,
            image: item.image && !item.image.includes('undefined') ? item.image : '/Sauceicone.png'
          })));
        }
      }

      if (supplementsRes.ok) {
        const data = await supplementsRes.json();
        if (data.success && Array.isArray(data.supplements) && data.supplements.length > 0) {
          allSupplements.push(...data.supplements.map((item: { _id: string; id: string; name: string; image?: string; price: number }) => ({ 
            ...item, 
            type: 'supplements' as const,
            image: item.image && !item.image.includes('undefined') ? item.image : '/Salade.png'
          })));
        }
      }

      setSupplements(allSupplements);
    } catch (error) {
      console.error('Erreur lors du chargement des suppléments:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fonction de filtrage et de tri des produits
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    // Filtre par recherche
    if (filters.search.trim()) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filtre par disponibilité
    if (filters.availability !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        filters.availability === 'online' ? product.isAvailable : !product.isAvailable
      );
    }

    // Tri
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filteredProducts;
  };

  // Fonction de filtrage et de tri des suppléments
  const getFilteredAndSortedSupplements = () => {
    let filteredSupplements = [...supplements];

    // Filtre par recherche
    if (supplementFilters.search.trim()) {
      filteredSupplements = filteredSupplements.filter(supplement =>
        supplement.name.toLowerCase().includes(supplementFilters.search.toLowerCase())
      );
    }

    // Filtre par type
    if (supplementFilters.type !== 'all') {
      filteredSupplements = filteredSupplements.filter(supplement =>
        supplement.type === supplementFilters.type
      );
    }

    // Tri
    filteredSupplements.sort((a, b) => {
      switch (supplementSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filteredSupplements;
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
    { id: 'supplements', name: 'Suppléments', icon: Plus },
    { id: 'images', name: 'Images', icon: ImageIcon },
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
          
          {/* Test du système d'images */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Test du Système d&apos;Images</h3>
            <div className="text-center py-4">
              <a
                href="/admin/test-images"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                🖼️ Tester les Images
              </a>
              <p className="text-xs text-gray-400 mt-2">Testez l&apos;upload et l&apos;affichage des images</p>
            </div>
          </div>
          
          {/* Test de l'intégration MongoDB */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Test MongoDB</h3>
            <div className="text-gray-400 text-center py-4">
              <p className="text-sm">Composant DataTest à implémenter</p>
              <p className="text-xs mt-2">Pour tester l&apos;intégration MongoDB des composants UI</p>
            </div>
          </div>
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
      imageId: product?.imageId || '',
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
          price: parseFloat(formData.price),
          imageId: formData.imageId || undefined
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
              <AdminImageUpload
                currentImage={formData.image}
                currentImageId={formData.imageId}
                onImageChange={(imageData) => setFormData({
                  ...formData,
                  image: imageData.filePath,
                  imageId: imageData.imageId
                })}
                label="Image du produit"
                required={false}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4"
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

  // Category Form Component
  const CategoryForm = ({ category, onClose, onSuccess }: {
    category?: Category;
    onClose: () => void;
    onSuccess: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      description: category?.description || '',
      image: category?.image || '',
      imageId: category?.imageId || '',
      isActive: category?.isActive !== undefined ? category.isActive : true,
      allowedOptions: category?.allowedOptions || [],
      order: category?.order || categories.length + 1
    });
    const [loading, setLoading] = useState(false);

    const availableOptions = ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'];

    const handleOptionToggle = (option: string) => {
      setFormData(prev => ({
        ...prev,
        allowedOptions: prev.allowedOptions.includes(option)
          ? prev.allowedOptions.filter(opt => opt !== option)
          : [...prev.allowedOptions, option]
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim()) {
        showNotification('error', 'Le nom de la catégorie est requis');
        return;
      }
      if (!formData.description.trim()) {
        showNotification('error', 'La description est requise');
        return;
      }
      if (!formData.image.trim()) {
        showNotification('error', 'L\'image est requise');
        return;
      }

      setLoading(true);

      try {
        const url = category ? `/api/admin/categories/${category._id}` : '/api/admin/categories';
        const method = category ? 'PUT' : 'POST';

        const submitData = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          imageId: formData.imageId || undefined,
          isActive: formData.isActive,
          allowedOptions: formData.allowedOptions,
          order: formData.order
        };

        const response = method === 'PUT'
          ? await adminApiPut(url, submitData)
          : await adminApiPost(url, submitData);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showNotification('success', category ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès');
            onSuccess();
          } else {
            showNotification('error', `Erreur: ${data.error}`);
          }
        } else {
          showNotification('error', 'Erreur lors de la sauvegarde de la catégorie');
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
            {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom de la catégorie *
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
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <AdminImageUpload
                currentImage={formData.image}
                currentImageId={formData.imageId}
                onImageChange={(imageData) => setFormData({
                  ...formData,
                  image: imageData.filePath,
                  imageId: imageData.imageId
                })}
                label="Image de la catégorie"
                required={true}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Détermine l&apos;ordre d&apos;affichage des catégories (1 = premier)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Options autorisées pour cette catégorie
              </label>
              <div className="space-y-2">
                {availableOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`option-${option}`}
                      checked={formData.allowedOptions.includes(option)}
                      onChange={() => handleOptionToggle(option)}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor={`option-${option}`} className="text-sm text-gray-300 capitalize">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Sélectionnez les types d&apos;options que les clients pourront ajouter aux produits de cette catégorie
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                Catégorie active
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
                {loading ? 'Sauvegarde...' : (category ? 'Modifier' : 'Ajouter')}
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

    const filteredProducts = getFilteredAndSortedProducts();

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

        {/* Section des filtres */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres et recherche
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom ou description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Disponibilité
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les états</option>
                <option value="online">En ligne</option>
                <option value="offline">Hors ligne</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="category">Catégorie</option>
              </select>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {filteredProducts.length} produit(s) affiché(s) sur {products.length}
            </p>
            
            {/* Bouton pour réinitialiser les filtres */}
            {(filters.search || filters.category !== 'all' || filters.availability !== 'all') && (
              <button
                onClick={() => setFilters({ category: 'all', availability: 'all', search: '' })}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
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

        {filteredProducts.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {products.length === 0 ? 'Aucun produit trouvé' : 'Aucun produit ne correspond aux filtres'}
            </h3>
            <p className="text-gray-300">
              {products.length === 0 
                ? 'Commencez par ajouter votre premier produit en utilisant le bouton ci-dessus.'
                : 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.'
              }
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
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AdminImageDisplay
                          image={product.image}
                          imageId={product.imageId}
                          alt={product.name}
                          size="sm"
                          showPreview={false}
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

  // Composant de formulaire pour ajouter/éditer un supplément
  const SupplementForm = ({ supplement, onClose, onSuccess }: { 
    supplement?: Supplement; 
    onClose: () => void; 
    onSuccess: () => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: supplement?.name || '',
      price: supplement?.price?.toString() || '',
      image: supplement?.image || '',
      imageId: supplement?.imageId || '',
      type: supplement?.type || 'boissons'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name.trim()) {
        showNotification('error', 'Le nom du supplément est requis');
        return;
      }
      if (!formData.price.trim()) {
        showNotification('error', 'Le prix du supplément est requis');
        return;
      }
      
      setLoading(true);

      try {
        const url = supplement ? `/api/${formData.type}/${supplement._id || supplement.id}` : `/api/${formData.type}`;
        const method = supplement ? 'PUT' : 'POST';

        const submitData = {
          name: formData.name,
          price: parseFloat(formData.price),
          image: formData.image || undefined,
          imageId: formData.imageId || undefined
        };

        const response = method === 'PUT' 
          ? await adminApiPut(url, submitData)
          : await adminApiPost(url, submitData);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showNotification('success', supplement ? 'Supplément modifié avec succès' : 'Supplément ajouté avec succès');
            onSuccess();
          } else {
            showNotification('error', `Erreur: ${data.error}`);
          }
        } else {
          showNotification('error', 'Erreur lors de la sauvegarde du supplément');
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
            {supplement ? 'Modifier le supplément' : 'Ajouter un supplément'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom du supplément *
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
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'boissons' | 'accompagnements' | 'extras' | 'sauces' | 'supplements' })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
                disabled={!!supplement} // Désactivé en mode édition
              >
                <option value="boissons">Boissons</option>
                <option value="accompagnements">Accompagnements</option>
                <option value="extras">Extras</option>
                <option value="sauces">Sauces</option>
                <option value="supplements">Suppléments</option>
              </select>
              {supplement && (
                <p className="text-xs text-gray-400 mt-1">
                  Le type ne peut pas être modifié lors de l&apos;édition
                </p>
              )}
            </div>

            <div>
              <AdminImageUpload
                currentImage={formData.image}
                currentImageId={formData.imageId}
                onImageChange={(imageData) => setFormData({
                  ...formData,
                  image: imageData.filePath,
                  imageId: imageData.imageId
                })}
                label="Image du supplément"
                required={false}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4"
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
                {loading ? 'Sauvegarde...' : (supplement ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Gestion des suppléments
  const renderSupplements = () => {
    const filteredSupplements = getFilteredAndSortedSupplements();

    const handleEditSupplement = (supplement: Supplement) => {
      setEditingSupplement(supplement);
      setShowSupplementForm(true);
    };

    const handleDeleteSupplement = async (supplementId: string, supplementType: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce supplément ?')) {
        try {
          const response = await adminApiDelete(`/api/${supplementType}/${supplementId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              showNotification('success', 'Supplément supprimé avec succès');
              fetchSupplements();
            } else {
              showNotification('error', `Erreur: ${data.error}`);
            }
          } else {
            showNotification('error', 'Erreur lors de la suppression du supplément');
          }
        } catch (error) {
          showNotification('error', 'Erreur lors de la suppression du supplément');
          console.error('Erreur:', error);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestion des Suppléments</h2>
          <div className="flex space-x-3">
            <button
              onClick={fetchSupplements}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄 Rafraîchir</span>
            </button>
            <button
              onClick={() => setShowSupplementForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un supplément</span>
            </button>
          </div>
        </div>

        {/* Section des filtres pour suppléments */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres et recherche
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom du supplément..."
                  value={supplementFilters.search}
                  onChange={(e) => setSupplementFilters({ ...supplementFilters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filtre par type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={supplementFilters.type}
                onChange={(e) => setSupplementFilters({ ...supplementFilters, type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les types</option>
                <option value="boissons">Boissons</option>
                <option value="accompagnements">Accompagnements</option>
                <option value="extras">Extras</option>
                <option value="sauces">Sauces</option>
                <option value="supplements">Suppléments</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trier par
              </label>
              <select
                value={supplementSortBy}
                onChange={(e) => setSupplementSortBy(e.target.value as 'name' | 'price' | 'type')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {filteredSupplements.length} supplément(s) affiché(s) sur {supplements.length}
            </p>
            
            {/* Bouton pour réinitialiser les filtres */}
            {(supplementFilters.search || supplementFilters.type !== 'all') && (
              <button
                onClick={() => setSupplementFilters({ type: 'all', search: '' })}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {showSupplementForm && (
          <SupplementForm
            supplement={editingSupplement || undefined}
            onClose={() => {
              setShowSupplementForm(false);
              setEditingSupplement(null);
            }}
            onSuccess={() => {
              fetchSupplements();
              setShowSupplementForm(false);
              setEditingSupplement(null);
            }}
          />
        )}

        {filteredSupplements.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {supplements.length === 0 ? 'Aucun supplément trouvé' : 'Aucun supplément ne correspond aux filtres'}
            </h3>
            <p className="text-gray-300">
              {supplements.length === 0 
                ? 'Commencez par ajouter votre premier supplément en utilisant le bouton ci-dessus.'
                : 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.'
              }
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
                      Type
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
                  {filteredSupplements.map((supplement) => (
                    <tr key={supplement._id || supplement.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AdminImageDisplay
                          image={supplement.image}
                          imageId={supplement.imageId}
                          alt={supplement.name}
                          size="sm"
                          showPreview={false}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{supplement.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs capitalize">
                          {supplement.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {supplement.price}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSupplement(supplement)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplement(supplement._id || supplement.id, supplement.type)}
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

  // Gestion des images
  const renderImages = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestion des Images</h2>
          <div className="flex space-x-3">
            <a
              href="/admin/test-images"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🧪 Tester</span>
            </a>
            <a
              href="/migrate-images"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🚀 Migrer</span>
            </a>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <AdminImageManager />
        </div>
        

        

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
            onClick={fetchCategories}
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
  const renderCategories = () => {
    const handleEditCategory = (category: Category) => {
      setEditingCategory(category);
      setShowCategoryForm(true);
    };

    const handleDeleteCategory = async (categoryId: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        try {
          const response = await adminApiDelete(`/api/admin/categories/${categoryId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              showNotification('success', 'Catégorie supprimée avec succès');
              fetchCategories();
            } else {
              showNotification('error', `Erreur: ${data.error}`);
            }
          } else {
            showNotification('error', 'Erreur lors de la suppression de la catégorie');
          }
        } catch (error) {
          showNotification('error', 'Erreur lors de la suppression de la catégorie');
          console.error('Erreur:', error);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestion des Catégories</h2>
          <div className="flex space-x-3">
            <button
              onClick={async () => {
                // Sauvegarder l'ordre actuel avant de rafraîchir
                if (categories.length > 0) {
                  try {
                    const categoryOrders = categories.map((cat, index) => ({
                      _id: cat._id,
                      order: index + 1
                    }));
                    
                    const response = await adminApiReorderCategories(categoryOrders);
                    
                    if (response.ok) {
                      const data = await response.json();
                      if (data.success) {
                        showNotification('success', 'Ordre sauvegardé avant rafraîchissement');
                      } else {
                        throw new Error(data.error || 'Erreur lors de la sauvegarde');
                      }
                    } else {
                      throw new Error('Erreur lors de la sauvegarde');
                    }
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
                    showNotification('error', 'Erreur lors de la sauvegarde de l\'ordre');
                  }
                }
                fetchCategories();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄 Rafraîchir</span>
            </button>
            <button
              onClick={() => {
                if (isReordering) {
                  // Désactiver le mode réorganisation sans sauvegarder à nouveau
                  setIsReordering(false);
                  showNotification('success', 'Mode réorganisation désactivé');
                } else {
                  // Activer le mode réorganisation
                  setIsReordering(true);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                isReordering 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              <span>{isReordering ? '✅ Terminer' : '🔄 Réorganiser'}</span>
            </button>
            

            
            <button
              onClick={() => setShowCategoryForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une catégorie</span>
            </button>
          </div>
        </div>

        {showCategoryForm && (
          <CategoryForm
            category={editingCategory || undefined}
            onClose={() => {
              setShowCategoryForm(false);
              setEditingCategory(null);
            }}
            onSuccess={() => {
              fetchCategories();
              setShowCategoryForm(false);
              setEditingCategory(null);
            }}
          />
        )}

        {/* Instructions pour la réorganisation */}
        {isReordering && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 text-blue-300">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium">Mode réorganisation activé</p>
                <p className="text-sm text-blue-200">
                  Cliquez et faites glisser une catégorie pour la repositionner. 
                  L&apos;ordre est automatiquement sauvegardé à la base de données à chaque modification.
                  Cliquez sur &quot;✅ Terminer&quot; pour désactiver le mode de réorganisation (les modifications sont déjà sauvegardées).
                </p>
              </div>
            </div>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Tag className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-300">
              Commencez par ajouter votre première catégorie en utilisant le bouton ci-dessus.
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Options autorisées
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {categories.map((category, index) => (
                    <tr 
                      key={category._id} 
                      className={`hover:bg-white/5 ${isReordering ? 'cursor-move' : ''}`}
                      draggable={isReordering}
                      onDragStart={(e) => {
                        if (isReordering) {
                          e.dataTransfer.setData('text/plain', category._id);
                        }
                      }}
                      onDragOver={(e) => {
                        if (isReordering) {
                          e.preventDefault();
                          e.currentTarget.classList.add('bg-blue-500/20');
                        }
                      }}
                      onDragLeave={(e) => {
                        if (isReordering) {
                          e.currentTarget.classList.remove('bg-blue-500/20');
                        }
                      }}
                      onDrop={(e) => {
                        if (isReordering) {
                          e.preventDefault();
                          e.currentTarget.classList.remove('bg-blue-500/20');
                          const draggedId = e.dataTransfer.getData('text/plain');
                          if (draggedId !== category._id) {
                            reorderCategories(draggedId, category._id);
                          }
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-lg font-bold text-yellow-400">#{category.order || index + 1}</span>
                          {isReordering && (
                            <span className="ml-2 text-xs text-gray-400">↕️</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AdminImageDisplay
                          image={category.image}
                          imageId={category.imageId}
                          alt={category.name}
                          size="sm"
                          showPreview={false}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 max-w-xs truncate">{category.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(category.allowedOptions || []).map((option) => (
                            <span
                              key={option}
                              className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                            >
                              {option}
                            </span>
                          ))}
                          {(!category.allowedOptions || category.allowedOptions.length === 0) && (
                            <span className="text-gray-500 text-xs">Aucune option</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
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

  // Composant dialog pour la connexion POS
  const PosConnectionDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Connexion POS</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center space-y-6">
            <p className="text-gray-300">
              Connectez votre système de point de vente pour synchroniser vos produits et commandes.
            </p>
            
            <Link 
              href="/admin/lightspeed-connection"
              className="inline-block w-full"
              onClick={onClose}
            >
              <button className="w-full bg-white hover:bg-gray-100 text-gray-900 py-4 px-6 rounded-lg transition-colors flex items-center justify-between border-2 border-gray-300 hover:border-gray-400">
                <Image
                  src="/lightspeedlogo.png"
                  alt="Lightspeed"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span className="font-semibold text-lg">Connecter avec Lightspeed</span>
              </button>
            </Link>
            
            <p className="text-sm text-gray-400">
              En vous connectant, vous acceptez de partager vos données de produits avec Lightspeed.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Paramètres
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Paramètres</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Connexion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            Connexion
          </h3>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Connectez votre système de point de vente pour synchroniser automatiquement vos données.
            </p>
            <button
              onClick={() => setShowPosConnectionDialog(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Wifi className="w-4 h-4" />
              <span>Connecter le POS</span>
            </button>
          </div>
        </div>

        {/* Section Informations du restaurant */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Informations du restaurant</h3>
          <div className="text-gray-400 text-center py-8">
            <Settings className="w-16 h-16 mx-auto opacity-50 mb-4" />
            <p>Configuration du restaurant à implémenter</p>
          </div>
        </div>

        {/* Section Modes de paiement */}
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
      case 'supplements':
        return renderSupplements();
      case 'images':
        return renderImages();
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

        {/* Dialog pour la connexion POS */}
        <PosConnectionDialog 
          isOpen={showPosConnectionDialog} 
          onClose={() => setShowPosConnectionDialog(false)} 
        />
      </div>
    </StrictAdminProtected>
  );
}
