'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StrictAdminProtected from '../components/StrictAdminProtected';
import { adminApiGet, adminApiPost, adminApiPut, adminApiDelete, adminApiReorderCategories } from '@/lib/adminApi';
import ApiTest from '../components/ApiTest';
import AdminImageDisplay from '@/components/ui/AdminImageDisplay';
import ImageOptimizationInfo from '@/components/ui/ImageOptimizationInfo';
import SharpTest from '@/components/ui/SharpTest';
import SharpSimpleTest from '@/components/ui/SharpSimpleTest';
import ImageUploadStats from '@/components/ui/ImageUploadStats';

import LocalImagesDisplay from '@/components/ui/LocalImagesDisplay';
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
  Image as ImageIcon,
  Upload,
  RefreshCw,
  FolderOpen,
  GitBranch,
  CheckCircle,
  ArrowLeft,
  Folder
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

interface GitImage {
  imageId: string;
  fileName: string;
  gitPath: string;
  githubUrl?: string;
  category: string;
  uploadDate: Date;
}

interface PendingImage {
  id: string;
  file: File;
  preview: string;
}

interface UploadStats {
  fileName: string;
  originalSize: number;
  optimizedSize: number;
  sizeReduction: string;
  status: 'success' | 'error' | 'processing';
  error?: string;
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

  // États pour la gestion des images Git
  const [images, setImages] = useState<GitImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [uploadStats, setUploadStats] = useState<UploadStats[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État pour la section active dans la page Gestion
  const [activeSection, setActiveSection] = useState<'products' | 'categories' | 'supplements' | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'admin') {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  // Charger les images existantes au montage du composant
  useEffect(() => {
    if (activeTab === 'images') {
      loadExistingImages();
    }
  }, [activeTab]);

  // Charger les images depuis le dossier public/images/uploads
  const loadExistingImages = async () => {
    setIsLoadingImages(true);
    try {
      // Ici vous pouvez implémenter une API pour lister les images
      // Pour l'instant, on utilise un état vide
      setImages([]);
    } catch (error) {
      console.error('Erreur chargement images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Gestion de la sélection multiple d'images
  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    
    const maxSize = 35 * 1024 * 1024; // 35MB (limite Vercel)
    const validFiles = Array.from(files).filter(file => {
      const isValidSize = file.size <= maxSize;
      if (!isValidSize) {
        console.warn(`⚠️ Fichier trop volumineux ignoré: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      }
      return isValidSize;
    });
    
          if (validFiles.length === 0) {
        alert('⚠️ Tous les fichiers sélectionnés dépassent la limite de 4MB autorisée par Vercel.');
        return;
      }
      
      if (validFiles.length < files.length) {
        alert(`⚠️ ${files.length - validFiles.length} fichier(s) ignoré(s) car trop volumineux (>4MB).`);
      }
    
    const newPendingImages: PendingImage[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPendingImages(prev => [...prev, ...newPendingImages]);
  };

  // Supprimer une image en attente
  const removePendingImage = (id: string) => {
    setPendingImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // Upload séquentiel de toutes les images en attente (pour éviter l'erreur 413)
  const uploadAllImages = async () => {
    if (pendingImages.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadProgress({ current: 0, total: pendingImages.length });
    
    // Initialiser les statistiques d'upload
    const initialStats: UploadStats[] = pendingImages.map(pendingImage => ({
      fileName: pendingImage.file.name,
      originalSize: pendingImage.file.size,
      optimizedSize: pendingImage.file.size,
      sizeReduction: '0%',
      status: 'processing'
    }));
    setUploadStats(initialStats);
    
    try {
      const uploadedImages: GitImage[] = [];
      let successCount = 0;
      let errorCount = 0;
      
      // Uploader chaque fichier individuellement pour éviter l'erreur 413
      for (let i = 0; i < pendingImages.length; i++) {
        const pendingImage = pendingImages[i];
        try {
          console.log(`📁 Upload fichier ${i + 1}/${pendingImages.length}: ${pendingImage.file.name}`);
          
          // Upload individuel pour chaque fichier
          const formData = new FormData();
          formData.append('image', pendingImage.file);
          
          const response = await fetch('/api/admin/upload-to-git', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
              const uploadedImage: GitImage = {
                imageId: result.imageId,
                fileName: result.fileName,
                gitPath: result.gitPath,
                githubUrl: result.githubUrl,
                category: 'uploads',
                uploadDate: new Date()
              };
              
              uploadedImages.push(uploadedImage);
              successCount++;
              console.log(`✅ Succès: ${pendingImage.file.name}`);
              
              // Mettre à jour les statistiques avec les données de redimensionnement
              setUploadStats(prev => prev.map(stat => 
                stat.fileName === pendingImage.file.name 
                  ? {
                      ...stat,
                      status: 'success' as const,
                      optimizedSize: result.optimizedSize || pendingImage.file.size,
                      sizeReduction: result.sizeReduction || '0%'
                    }
                  : stat
              ));
            } else {
              errorCount++;
              console.error(`❌ Erreur: ${pendingImage.file.name}`, result.error);
              
              // Mettre à jour les statistiques avec l'erreur
              setUploadStats(prev => prev.map(stat => 
                stat.fileName === pendingImage.file.name 
                  ? {
                      ...stat,
                      status: 'error' as const,
                      error: result.error || 'Erreur inconnue'
                    }
                  : stat
              ));
            }
          } else {
            errorCount++;
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Erreur HTTP: ${pendingImage.file.name}`, errorData);
            
            // Mettre à jour les statistiques avec l'erreur HTTP
            setUploadStats(prev => prev.map(stat => 
              stat.fileName === pendingImage.file.name 
                ? {
                    ...stat,
                    status: 'error' as const,
                    error: `Erreur HTTP ${response.status}: ${errorData.error || 'Erreur inconnue'}`
                  }
                : stat
            ));
          }
          
          // Mettre à jour le progrès
          setUploadProgress({ current: i + 1, total: pendingImages.length });
          
        } catch (error) {
          errorCount++;
          console.error(`❌ Erreur upload ${pendingImage.file.name}:`, error);
          
          // Mettre à jour les statistiques avec l'erreur
          setUploadStats(prev => prev.map(stat => 
            stat.fileName === pendingImage.file.name 
              ? {
                  ...stat,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Erreur inconnue'
                }
              : stat
          ));
        }
      }
      
      // Mettre à jour l'état avec les images uploadées
      if (uploadedImages.length > 0) {
        setImages(prev => [...prev, ...uploadedImages]);
        setUploadStatus('success');
        console.log(`🎉 Upload séquentiel réussi: ${uploadedImages.length} images ajoutées`);
        
        if (errorCount > 0) {
          console.warn(`⚠️ ${errorCount} fichier(s) en erreur`);
        }
      } else {
        setUploadStatus('error');
        console.error('❌ Aucune image n\'a pu être uploadée');
      }
      
    } catch (error) {
      setUploadStatus('error');
      console.error('❌ Erreur générale upload séquentiel:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      setPendingImages([]);
    }
  };

  // Suppression d'images depuis Git
  const handleImageDelete = async (imageId: string) => {
    try {
      const image = images.find(img => img.imageId === imageId);
      if (!image) return;
      
      const response = await fetch('/api/admin/delete-from-git', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageId,
          filePath: image.gitPath 
        })
      });
      
      if (response.ok) {
        setImages(prev => prev.filter(img => img.imageId !== imageId));
        console.log('✅ Image supprimée du repository Git');
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

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
    
    // Notification plus longue pour l'affichage tactile
    setTimeout(() => setNotification(null), 8000);
    
    // Ajouter une vibration tactile si supportée (pour mobile/tablette)
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'success' ? [100, 50, 100] : [200, 100, 200]);
    }
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
    { id: 'gestion', name: 'Gestion', icon: Package },
    { id: 'images', name: 'Images', icon: ImageIcon },
    { id: 'orders', name: 'Commandes', icon: ShoppingCart },
    { id: 'customers', name: 'Clients', icon: Users },
    { id: 'analytics', name: 'Statistiques', icon: BarChart3 },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  // Dashboard principal
  const renderDashboard = () => (
    <div className="space-y-8 lg:space-y-10">
      {/* Cartes de statistiques optimisées pour tactile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-base lg:text-lg mb-2">Ventes du jour</p>
              <p className="text-3xl lg:text-4xl font-bold text-white">{stats.dailyRevenue}€</p>
              <p className="text-green-400 text-sm lg:text-base mt-2">+12% vs hier</p>
            </div>
            <Euro className="w-10 h-10 lg:w-12 lg:h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-base lg:text-lg mb-2">Commandes en attente</p>
              <p className="text-3xl lg:text-4xl font-bold text-white">{stats.pendingOrders}</p>
              <p className="text-orange-400 text-sm lg:text-base mt-2">À traiter</p>
            </div>
            <Clock className="w-10 h-10 lg:w-12 lg:h-12 text-orange-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-base lg:text-lg mb-2">Total du mois</p>
              <p className="text-3xl lg:text-4xl font-bold text-white">{stats.monthlyRevenue}€</p>
              <p className="text-blue-400 text-sm lg:text-base mt-2">+8% vs mois dernier</p>
            </div>
            <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-base lg:text-lg mb-2">Total produits</p>
              <p className="text-3xl lg:text-4xl font-bold text-white">{stats.totalProducts}</p>
              <p className="text-blue-400 text-sm lg:text-base mt-2">En catalogue</p>
            </div>
            <Package className="w-10 h-10 lg:w-12 lg:h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Section principale avec graphiques et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Graphique des ventes */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
          <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">Ventes des 7 derniers jours</h3>
          <div className="h-64 lg:h-80 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <BarChart3 className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 opacity-50" />
              <p className="text-lg lg:text-xl">Graphique des ventes à implémenter</p>
            </div>
          </div>
        </div>

        {/* Actions rapides et maintenance optimisées pour tactile */}
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
            <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">Actions rapides</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 lg:py-5 px-6 rounded-xl transition-all text-lg lg:text-xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 inline mr-3" />
                Ajouter un produit
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 lg:py-5 px-6 rounded-xl transition-all text-lg lg:text-xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 inline mr-3" />
                Voir les commandes
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 lg:py-5 px-6 rounded-xl transition-all text-lg lg:text-xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 inline mr-3" />
                Voir les statistiques
              </button>
            </div>
          </div>

          {/* Outils de maintenance */}
          <ApiTest />
          
          {/* Test du système d'images */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
            <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">Test du Système d&apos;Images</h3>
            <div className="text-center py-6">
              <a
                href="/admin/test-images"
                className="inline-flex items-center px-6 py-4 lg:px-8 lg:py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all text-lg lg:text-xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🖼️ Tester les Images
              </a>
              <p className="text-sm lg:text-base text-gray-400 mt-4">Testez l&apos;upload et l&apos;affichage des images</p>
            </div>
          </div>
          
          {/* Test de l'intégration MongoDB */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
            <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">Test MongoDB</h3>
            <div className="text-gray-400 text-center py-6">
              <p className="text-base lg:text-lg">Composant DataTest à implémenter</p>
              <p className="text-sm lg:text-base mt-3">Pour tester l&apos;intégration MongoDB des composants UI</p>
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
              <ImageSelector
                currentImage={formData.image}
                onImageSelect={(imagePath) => setFormData({
                  ...formData,
                  image: imagePath,
                  imageId: imagePath // Pour l'instant, on utilise le chemin comme ID
                })}
                label="Image du produit"
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
              <ImageSelector
                currentImage={formData.image}
                onImageSelect={(imagePath) => setFormData({
                  ...formData,
                  image: imagePath,
                  imageId: imagePath // Pour l'instant, on utilise le chemin comme ID
                })}
                label="Image de la catégorie"
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
              <ImageSelector
                currentImage={formData.image}
                onImageSelect={(imagePath) => setFormData({
                  ...formData,
                  image: imagePath,
                  imageId: imagePath // Pour l'instant, on utilise le chemin comme ID
                })}
                label="Image du supplément"
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

  // Composant de sélection d'images depuis /public/images/uploads
  const ImageSelector = ({ 
    currentImage, 
    onImageSelect, 
    label 
  }: { 
    currentImage: string; 
    onImageSelect: (imagePath: string) => void; 
    label: string; 
  }) => {
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [availableImages, setAvailableImages] = useState<Array<{
      name: string;
      path: string;
      size: number;
      url: string;
      sha: string;
    }>>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger les images disponibles depuis /public/images/uploads
    const loadAvailableImages = async () => {
      setIsLoadingImages(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/list-uploaded-images');
        const data = await response.json();
        
        if (data.success) {
          setAvailableImages(data.images || []);
          console.log(`📁 ${data.images?.length || 0} images chargées depuis /public/images/uploads`);
        } else {
          setError(data.error || 'Erreur lors du chargement des images');
          console.error('❌ Erreur API:', data.error);
        }
      } catch (error) {
        setError('Erreur de connexion au serveur');
        console.error('❌ Erreur chargement images:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    // Ouvrir le sélecteur d'images
    const openImageSelector = () => {
      setShowImageSelector(true);
      loadAvailableImages();
    };

    // Sélectionner une image
    const selectImage = (imagePath: string) => {
      onImageSelect(imagePath);
      setShowImageSelector(false);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        
        {/* Image actuelle */}
        {currentImage && (
          <div className="mb-4">
            <img 
              src={currentImage} 
              alt="Image sélectionnée" 
              className="w-32 h-32 object-cover rounded-lg border border-gray-600"
            />
          </div>
        )}
        
        {/* Bouton pour ouvrir le sélecteur */}
        <button
          type="button"
          onClick={openImageSelector}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
        >
          {currentImage ? 'Changer l&apos;image' : 'Sélectionner une image'}
        </button>

        {/* Modal de sélection d'images */}
        {showImageSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white">Sélectionner une image</h3>
                <button
                  onClick={() => setShowImageSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-xl"
                >
                  <X className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
              </div>

              {/* Grille d'images disponibles */}
              {isLoadingImages ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Chargement des images...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-lg mb-2">Erreur de chargement</p>
                  <p className="text-gray-400 text-sm">{error}</p>
                  <button
                    onClick={loadAvailableImages}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : availableImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableImages.map((image, index) => (
                    <div 
                      key={image.sha}
                      onClick={() => selectImage(image.path)}
                      className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors hover:scale-105"
                    >
                      <img 
                        src={image.path} 
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-600 mb-2"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          e.currentTarget.src = '/api/images/' + image.name;
                        }}
                      />
                      <p className="text-sm text-gray-300 truncate mb-1">{image.name}</p>
                      <p className="text-xs text-gray-500">{(image.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 text-lg">Aucune image disponible</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Utilisez la section Images pour ajouter des images dans /public/images/uploads
                  </p>
                  <button
                    onClick={() => setActiveTab('images')}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Aller à la section Images
                  </button>
                </div>
              )}

              {/* Bouton fermer */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowImageSelector(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
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
      <div className="space-y-8 lg:space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Gestion des Images</h2>
        </div>

        {/* Section 1: Ajouter des images et les envoyer sur Git */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
          <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-6 lg:mb-8">
            📤 Ajouter des Images à Git
          </h3>
          
          {/* Information sur l'optimisation automatique */}
          <div className="mb-6 lg:mb-8">
            <ImageOptimizationInfo />
          </div>
          
          {/* Test de Sharp */}
          <div className="mt-6 lg:mt-8">
            <SharpTest />
          </div>

          <div className="mt-6 lg:mt-8">
            <SharpSimpleTest />
          </div>
          
          {/* Zone d'upload multiple optimisée pour tactile */}
          <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 lg:p-10 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelection(e.target.files)}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-8 py-5 lg:px-10 lg:py-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all text-xl lg:text-2xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isUploading ? (
                <RefreshCw className="w-6 h-6 lg:w-8 lg:h-8 animate-spin inline mr-3" />
              ) : (
                <Upload className="w-6 h-6 lg:w-8 lg:h-8 inline mr-3" />
              )}
              {isUploading ? 'Upload en cours...' : '📁 Sélectionner des images'}
            </button>
            
            <p className="text-base lg:text-lg text-gray-500 mt-4 lg:mt-6">
              Vous pouvez sélectionner plusieurs images à la fois
            </p>
            
            {/* Information sur la limite Vercel */}
            <div className="mt-4 lg:mt-6 p-4 lg:p-5 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm lg:text-base flex-shrink-0 mt-0.5">
                  ✅
                </div>
                <div>
                  <p className="text-sm lg:text-base text-green-800 font-medium">
                    <strong>Redimensionnement automatique :</strong> Limite Vercel respectée automatiquement
                  </p>
                  <p className="text-xs lg:text-sm text-green-600 mt-1">
                    Vos images sont automatiquement optimisées pour respecter la limite de 4.5 MB.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bouton d'upload en lot optimisé pour tactile */}
            {pendingImages.length > 0 && (
              <div className="mt-6 lg:mt-8">
                <button
                  onClick={uploadAllImages}
                  disabled={isUploading}
                  className="px-8 py-5 lg:px-10 lg:py-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-all text-xl lg:text-2xl font-medium hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isUploading ? (
                    <RefreshCw className="w-6 h-6 lg:w-8 lg:h-8 animate-spin inline mr-3" />
                  ) : (
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 inline mr-3" />
                  )}
                  {isUploading ? 'Upload en cours...' : `🚀 Ajouter ${pendingImages.length} image${pendingImages.length > 1 ? 's' : ''} à Git`}
                </button>
              </div>
            )}
            
            {/* Barre de progression optimisée pour tactile */}
            {isUploading && uploadProgress.total > 0 && (
              <div className="mt-6 lg:mt-8">
                <div className="w-full bg-gray-200 rounded-full h-3 lg:h-4">
                  <div 
                    className="bg-green-600 h-3 lg:h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-base lg:text-lg text-gray-600 mt-3 lg:mt-4 font-medium">
                  {uploadProgress.current} / {uploadProgress.total} images uploadées
                </p>
              </div>
            )}
            
            {/* Statistiques de redimensionnement */}
            {uploadStats.length > 0 && (
              <div className="mt-6 lg:mt-8">
                <ImageUploadStats uploads={uploadStats} />
              </div>
            )}
            
            {/* Status de l'upload optimisé pour tactile */}
            {uploadStatus === 'success' && (
              <div className="mt-6 lg:mt-8 p-6 lg:p-8 bg-green-100 text-green-800 rounded-2xl border-2 border-green-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                    ✅
                  </div>
                  <span className="text-lg lg:text-xl font-medium">Images ajoutées au repository Git avec succès !</span>
                </div>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mt-6 lg:mt-8 p-6 lg:p-8 bg-red-100 text-red-800 rounded-2xl border-2 border-red-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl">
                    ❌
                  </div>
                  <span className="text-lg lg:text-xl font-medium">Erreur lors de l&apos;ajout des images</span>
                </div>
              </div>
            )}
          </div>

          {/* Images en attente optimisées pour tactile */}
          {pendingImages.length > 0 && (
            <div className="mt-8 lg:mt-10 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-semibold text-yellow-800 mb-6">
                📋 Images en attente d&apos;upload ({pendingImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
                {pendingImages.map((pendingImage) => (
                  <div key={pendingImage.id} className="relative bg-white rounded-xl p-3 lg:p-4 border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                    <img 
                      src={pendingImage.preview} 
                      alt={pendingImage.file.name}
                      className="w-full h-24 lg:h-28 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removePendingImage(pendingImage.id)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <p className="text-sm lg:text-base text-gray-600 mt-3 truncate font-medium">
                      {pendingImage.file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section des images synchronisées localement */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
          <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
            <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
            Images Synchronisées Localement
          </h3>
          <LocalImagesDisplay />
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 lg:p-8 w-full max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto border-2 border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white">Connexion POS</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-xl"
            >
              <X className="w-8 h-8 lg:w-10 lg:h-10" />
            </button>
          </div>
          
          <div className="text-center space-y-8">
            <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
              Connectez votre système de point de vente pour synchroniser vos produits et commandes.
            </p>
            
            <Link 
              href="/admin/lightspeed-connection"
              className="inline-block w-full"
              onClick={onClose}
            >
              <button className="w-full bg-white hover:bg-gray-100 text-gray-900 py-6 lg:py-8 px-8 rounded-2xl transition-all flex items-center justify-between border-2 border-gray-300 hover:border-gray-400 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image
                  src="/lightspeedlogo.png"
                  alt="Lightspeed"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span className="font-semibold text-xl lg:text-2xl">Connecter avec Lightspeed</span>
              </button>
            </Link>
            
            <p className="text-sm lg:text-base text-gray-400 leading-relaxed">
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

  // Fonction pour afficher la page de gestion
  const renderGestion = () => {
    if (activeSection) {
      return (
        <div className="space-y-6">
          {/* Bouton retour à l'aperçu */}
          <div className="flex justify-start">
            <button
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à l&apos;aperçu
            </button>
          </div>

          {/* Contenu de la section active */}
          {activeSection === 'products' && renderProducts()}
          {activeSection === 'categories' && renderCategories()}
          {activeSection === 'supplements' && renderSupplements()}
        </div>
      );
    }

    // Vue d'aperçu
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Gestion du Restaurant
          </h2>
          <p className="text-gray-300 text-lg">
            Gérez vos produits, catégories et suppléments
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Produits</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Catégories</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Folder className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suppléments</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Sections cliquables */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveSection('products')}
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-8 border border-blue-500/30 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Produits</h3>
              <p className="text-blue-200">Gérer le menu et les produits</p>
            </div>
          </div>
          
          <div 
            onClick={() => setActiveSection('categories')}
            className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl p-8 border border-green-500/30 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20"
          >
            <div className="text-center">
              <Folder className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Catégories</h3>
              <p className="text-green-200">Organiser les produits par catégorie</p>
            </div>
          </div>
          
          <div 
            onClick={() => setActiveSection('supplements')}
            className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl p-8 border border-purple-500/30 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="text-center">
              <Plus className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Suppléments</h3>
              <p className="text-purple-200">Gérer les options et suppléments</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'gestion':
        return renderGestion();
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
        {/* Styles CSS personnalisés pour l'optimisation tactile */}
        <style jsx global>{`
          /* Optimisations pour écrans tactiles */
          @media (pointer: coarse) {
            /* Augmenter la taille minimale des éléments tactiles */
            button, a, input, select, textarea {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Améliorer la lisibilité sur petits écrans */
            .text-sm { font-size: 16px; }
            .text-base { font-size: 18px; }
            .text-lg { font-size: 20px; }
            .text-xl { font-size: 22px; }
            .text-2xl { font-size: 24px; }
            .text-3xl { font-size: 28px; }
            .text-4xl { font-size: 32px; }
            
            /* Espacement optimisé pour tactile */
            .space-y-4 > * + * { margin-top: 1.5rem; }
            .space-y-6 > * + * { margin-top: 2rem; }
            .space-y-8 > * + * { margin-top: 2.5rem; }
            
            /* Améliorer les transitions tactiles */
            button:hover, a:hover {
              transform: scale(1.02);
              transition: transform 0.2s ease;
            }
            
            /* Optimiser les scrollbars pour tactile */
            ::-webkit-scrollbar {
              width: 12px;
              height: 12px;
            }
            
            ::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 6px;
            }
            
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 6px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          }
          
          /* Améliorations générales pour tous les écrans */
          .hover\\:scale-105:hover {
            transform: scale(1.05);
          }
          
          /* Animations fluides */
          .transition-all {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Ombres améliorées */
          .shadow-lg {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .shadow-xl {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}</style>
        
        {/* Header optimisé pour tactile */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 lg:h-24">
              <div className="flex items-center">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">🍽️ Delice Wand Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg lg:text-xl text-gray-300 hidden sm:block">Bonjour, {session?.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl transition-all flex items-center space-x-3 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Notification optimisée pour tactile */}
          {notification && (
            <div className={`mb-6 p-6 lg:p-8 rounded-2xl border-2 shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {notification.type === 'success' ? '✅' : '❌'}
                </div>
                <span className="text-lg lg:text-xl font-medium">{notification.message}</span>
              </div>
            </div>
          )}

          {/* Layout avec navigation latérale fixe */}
          <div className="flex gap-6 lg:gap-8">
            {/* Navigation latérale fixe */}
            <nav className="w-64 lg:w-72 flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 sticky top-6">
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-6 text-center">Navigation</h3>
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-4 lg:px-6 lg:py-5 rounded-xl transition-all text-left ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Contenu principal - prend toute la largeur restante */}
            <div className="flex-1 min-w-0">
              {/* Tab content optimisé pour tactile */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 w-full">
                {renderTabContent()}
              </div>
            </div>
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
