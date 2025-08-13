"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, OptionSupplement, OptionExtra, Accompagnements, Boissons, OptionSauce } from "../types";
import { useCart } from "../CartProvider";
import PaymentModal from "../components/PaymentModal";

// Types pour les données dynamiques
interface DynamicProduct {
  _id: string;
  name: string;
  description?: string;
  price: string; // Changé en string pour être compatible avec Product
  category: string;
  image: string;
  isAvailable: boolean;
}

interface DynamicCategory {
  _id: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
  steps?: {
    supplements?: {
      type: "supplements";
      data: OptionSupplement[];
      title: string;
    };
    sauces?: {
      type: "sauces";
      data: OptionSauce[];
      title: string;
    };
    extra?: {
      type: "extra";
      data: OptionExtra[];
      title: string;
    };
    accompagnements?: {
      type: "accompagnements";
      data: Accompagnements[];
      title: string;
    };
    boissons?: {
      type: "boissons";
      data: Boissons[];
      title: string;
    };
  };
}

export default function CommandePage() {
  const [activeCategory, setActiveCategory] = useState("assiette");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DynamicProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
  const [selectedOptionsDetails, setSelectedOptionsDetails] = useState<{ [key: string]: (OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce) | undefined }>({});
  
  // États pour gérer la sélection unique des accompagnements, boissons et sauces
  const [selectedUniqueOptions, setSelectedUniqueOptions] = useState<{
    accompagnements: string | null;
    boissons: string | null;
    sauces: string | null;
  }>({
    accompagnements: null,
    boissons: null,
    sauces: null
  });
  
  // États pour les données dynamiques
  const [dynamicProducts, setDynamicProducts] = useState<DynamicProduct[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<DynamicCategory[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState<{
    supplements: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
    sauces: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
    extras: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
    accompagnements: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
    boissons: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
  }>({
    supplements: [],
    sauces: [],
    extras: [],
    accompagnements: [],
    boissons: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { cartItems, addToCart, updateQuantity, calculateTotal } = useCart();

  // Fonction pour récupérer les données dynamiquement
  const fetchDynamicData = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les produits, catégories et options en parallèle
      const [productsRes, categoriesRes, extrasRes, saucesRes, supplementsRes, accompagnementsRes, boissonsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/extras'),
        fetch('/api/sauces'),
        fetch('/api/supplements'),
        fetch('/api/accompagnements'),
        fetch('/api/boissons')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success && Array.isArray(productsData.products)) {
          setDynamicProducts(productsData.products);
        }
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success && Array.isArray(categoriesData.categories)) {
          setDynamicCategories(categoriesData.categories);
        }
      }

      // Récupérer les options
      if (extrasRes.ok) {
        const extrasData = await extrasRes.json();
        if (extrasData.success && Array.isArray(extrasData.extras)) {
          setDynamicOptions(prev => ({ ...prev, extras: extrasData.extras }));
        }
      }

      if (saucesRes.ok) {
        const saucesData = await saucesRes.json();
        if (saucesData.success && Array.isArray(saucesData.sauces)) {
          setDynamicOptions(prev => ({ ...prev, sauces: saucesData.sauces }));
        }
      }

      if (supplementsRes.ok) {
        const supplementsData = await supplementsRes.json();
        if (supplementsData.success && Array.isArray(supplementsData.supplements)) {
          setDynamicOptions(prev => ({ ...prev, supplements: supplementsData.supplements }));
        }
      }

      if (accompagnementsRes.ok) {
        const accompagnementsData = await accompagnementsRes.json();
        if (accompagnementsData.success && Array.isArray(accompagnementsData.accompagnements)) {
          setDynamicOptions(prev => ({ ...prev, accompagnements: accompagnementsData.accompagnements }));
        }
      }

      if (boissonsRes.ok) {
        const boissonsData = await boissonsRes.json();
        if (boissonsData.success && Array.isArray(boissonsData.boissons)) {
          setDynamicOptions(prev => ({ ...prev, boissons: boissonsData.boissons }));
        }
      }


    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };



  // Charger les données au montage du composant
  useEffect(() => {
    fetchDynamicData();
  }, []);

  // Fonction pour gérer la diminution de quantité avec confirmation
  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      setItemToDelete(itemId);
      setIsDeleteDialogOpen(true);
    } else {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete, 0);
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Fonction pour récupérer les options d'une catégorie depuis les données dynamiques
  const getCategoryOptions = (categoryName: string) => {
    // Mapper les noms de catégories aux types d'options appropriés
    const categoryOptionsMap: { [key: string]: string[] } = {
      'assiette': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'sandwich': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'tacos': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'Bicky': ['supplements', 'sauces', 'extras'],
      'snacks': ['sauces'],
      'dessert': ['sauces'],
      'boissons': []
    };

    const optionsForCategory = categoryOptionsMap[categoryName.toLowerCase()] || [];
    
    return {
      supplements: optionsForCategory.includes('supplements') ? dynamicOptions.supplements : [],
      sauces: optionsForCategory.includes('sauces') ? dynamicOptions.sauces : [],
      extras: optionsForCategory.includes('extras') ? dynamicOptions.extras : [],
      accompagnements: optionsForCategory.includes('accompagnements') ? dynamicOptions.accompagnements : [],
      boissons: optionsForCategory.includes('boissons') ? dynamicOptions.boissons : []
    };
  };

  const scrollToSection = (categoryId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveCategory(categoryId);
      }
    }
  };

  const openProductModal = (product: DynamicProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Réinitialiser les options sélectionnées
    setSelectedOptions({});
    setSelectedOptionsDetails({});
    setSelectedUniqueOptions({
      accompagnements: null,
      boissons: null,
      sauces: null
    });
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedOptions({});
    setSelectedOptionsDetails({});
    setSelectedUniqueOptions({
      accompagnements: null,
      boissons: null,
      sauces: null
    });
  };

  const toggleOption = (optionId: string, optionData: OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
    
    setSelectedOptionsDetails(prev => ({
      ...prev,
      [optionId]: !prev[optionId] ? optionData : undefined
    }));
  };

  // Fonction générale pour gérer la sélection unique
  const toggleUnique = (optionId: string, optionData: Accompagnements | Boissons | OptionSauce, type: 'accompagnements' | 'boissons' | 'sauces') => {
    const currentSelected = selectedUniqueOptions[type];
    
    if (currentSelected === optionId) {
      // Désélectionner
      setSelectedUniqueOptions(prev => ({
        ...prev,
        [type]: null
      }));
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: false
      }));
      setSelectedOptionsDetails(prev => ({
        ...prev,
        [optionId]: undefined
      }));
    } else {
      // Sélectionner (remplace la sélection précédente)
      // D'abord, nettoyer toutes les anciennes options du même type
      setSelectedOptionsDetails(prev => {
        const newState = { ...prev };
        // Supprimer l'ancienne option du même type si elle existe
        if (currentSelected) {
          delete newState[currentSelected];
        }
        // Ajouter la nouvelle option
        newState[optionId] = optionData;
        return newState;
      });
      
      setSelectedOptions(prev => {
        const newState = { ...prev };
        // Désélectionner l'ancienne option du même type si elle existe
        if (currentSelected) {
          newState[currentSelected] = false;
        }
        // Sélectionner la nouvelle option
        newState[optionId] = true;
        return newState;
      });
      
      setSelectedUniqueOptions(prev => ({
        ...prev,
        [type]: optionId
      }));
    }
  };

  // Fonction utilitaire pour formater le prix
  const formatPrice = (price: string | number): string => {
    if (typeof price === 'number') {
      return `${price.toFixed(2)}€`;
    }
    if (typeof price === 'string') {
      // Si le prix contient déjà "€", le retourner tel quel
      if (price.includes('€')) {
        return price;
      }
      // Sinon, ajouter "€" et formater
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '0.00€' : `${numPrice.toFixed(2)}€`;
    }
    return '0.00€';
  };

  // Fonction utilitaire pour extraire le prix numérique
  const extractPrice = (price: string | number): number => {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      // Retirer "€" si présent et convertir en nombre
      const priceString = price.replace('€', '').trim();
      const numPrice = parseFloat(priceString);
      return isNaN(numPrice) ? 0 : numPrice;
    }
    return 0;
  };

  const calculateModalTotal = () => {
    if (!selectedProduct) return 0;
    
    
    const basePrice = extractPrice(selectedProduct.price);
    let total = basePrice;
    
    Object.values(selectedOptionsDetails).forEach((option: OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce | undefined) => {
      if (option && option.price) {
        total += option.price;
      }
    });
    

    return total;
  };

  const addToCartFromModal = () => {
    if (selectedProduct) {
      // Créer un identifiant unique pour cette commande
      const uniqueId = `${selectedProduct._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Récupérer les options sélectionnées
      const selectedOptionsList = Object.values(selectedOptionsDetails).filter((option): option is OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce => option !== undefined);
      
             // Créer l'objet de commande avec options compatible avec le type CartItem
       const orderItem: CartItem = {
         id: uniqueId,
         originalId: selectedProduct._id,
         name: selectedProduct.name,
         description: selectedProduct.description,
         price: formatPrice(selectedProduct.price),
         category: selectedProduct.category,
         image: selectedProduct.image,
         selectedOptions: selectedOptionsList,
         totalPrice: calculateModalTotal(),
         quantity: 1
       };
      
      addToCart(orderItem);
      closeProductModal();
    }
  };

  // Empêcher le scroll de la page quand le modal est ouvert
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Observer pour détecter la section active
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    dynamicCategories.forEach((category) => {
      const element = document.getElementById(category._id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Scroll automatique vers la catégorie active dans le header mobile
  useEffect(() => {
    if (categoriesRef.current && activeCategory) {
      const activeButton = categoriesRef.current.querySelector(`[data-category="${activeCategory}"]`) as HTMLElement;
      if (activeButton) {
        const container = categoriesRef.current;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        const containerWidth = container.offsetWidth;
        const containerScrollLeft = container.scrollLeft;

        // Vérifier si le bouton est visible
        const isVisible = buttonLeft >= containerScrollLeft && 
        buttonLeft + buttonWidth <= containerScrollLeft + containerWidth;

        if (!isVisible) {
          // Centrer le bouton actif dans le container instantanément
          const targetScrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          container.scrollLeft = targetScrollLeft;
        }
      }
    }
  }, [activeCategory, dynamicCategories]);

  // Gestion du scroll pour le scroll horizontal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Éviter les changements trop fréquents
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      setLastScrollY(currentScrollY);
      setIsScrolling(true);

      // Gestion de la visibilité du header principal - visible SEULEMENT quand on est tout en haut
      if (currentScrollY <= 10) {
        // Très proche du sommet (≤ 10px) - header principal visible
        setIsHeaderVisible(true);
      } else {
        // Dès qu'on scrolle un peu - masquer le header principal
        setIsHeaderVisible(false);
      }

      // Scroll horizontal automatique des catégories - plus rapide
      if (categoriesRef.current) {
        const scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
        const scrollAmount = scrollDirection * 4; // Vitesse de scroll augmentée
        categoriesRef.current.scrollLeft += scrollAmount;
      }

      // Arrêter l'état de scroll après un délai
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen text-white">
      {/* Arrière-plan fixe sur tout l'écran */}
      <div className="fixed inset-0 w-full h-full">
        {/* Image d'arrière-plan principale */}
        <div className="absolute inset-0 z-20 overflow-hidden">
          <div 
            className="absolute w-full h-full"
            style={{
              backgroundImage: 'url(/bgmainpage.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: '100vh',
            }}
          />
        </div>
      </div>

      {/* Contenu principal qui prend tout l'écran */}
      <div className={`relative z-30 min-h-screen overflow-y-auto flex flex-col md:pt-0 ${isHeaderVisible ? 'pt-15' : 'pt-0'}`}>
        {/* Header avec navigation - Visible sur mobile avec logique de scroll */}
        <header className={`${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} md:translate-y-0 transition-transform ease-out bg-black/60 backdrop-blur-sm border-b border-gray-600/50 text-white fixed top-0 left-0 right-0 z-50 shadow-2xl`}>
          <div className="flex items-center h-20 w-full px-6 relative">

            {/* Logo + Titre */}
            <div className="flex-shrink-0">
              <Link href="/">
                <button className="flex items-center space-x-3 focus:outline-none hover:scale-105 transition-all duration-200 group">
                  <div className="relative">
                    <Image
                      src="/cheeseburger.png"
                      alt="Cheeseburger Logo"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  </div>
                  <h1 className="text-xl xl:text-3xl font-bold text-white hover:text-yellow-400 transition-colors duration-300">
                    Delice Wand
                  </h1>
                </button>
              </Link>
            </div>

            {/* Navigation + Bouton Commander à droite */}
            <div className="flex items-center space-x-6 xl:ml-auto">
              {/* Menu de navigation - Desktop */}
              <nav className="hidden xl:flex items-center space-x-2">
                {dynamicCategories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => scrollToSection(category._id)}
                    className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl hover:bg-white/5 ${
                      activeCategory === category._id
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{category.name}</span>
                    {activeCategory === category._id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-in slide-in-from-left duration-300" />
                    )}
                  </button>
                ))}
              </nav>



              {/* Bouton Commander - Desktop seulement */}
              <button 
                onClick={() => setIsCartDialogOpen(true)}
                className="hidden md:block relative group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold py-3 xl:py-4 px-6 xl:px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 focus:outline-none text-sm xl:text-base overflow-hidden tracking-wide"
                style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                disabled={cartItems.length === 0}
              >
                <span className="relative z-10 flex items-center">
                  <span className="font-semibold">COMMANDER</span>
                  {cartItems.length > 0 && (
                    <span className="flex absolute -top-3 -right-8 text-black text-sm font-bold rounded-full h-6 w-6 items-center justify-center animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
              </button>
            </div>
          </div>
        </header>

        {/* Header mobile avec catégories - Se place en dessous du header principal quand il est visible */}
        <header className={`md:hidden fixed left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-700 shadow-lg transition-transform duration-300 ease-out`} style={{ transform: `translateY(${isHeaderVisible ? '80px' : '0px'})` }}>
          <div className="px-4 py-3">
            <div 
              ref={categoriesRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {dynamicCategories.map((category) => (
                <button
                  key={category._id}
                  data-category={category._id}
                  onClick={() => scrollToSection(category._id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    activeCategory === category._id
                      ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Contenu principal modernisé */}
        <main className={`${isHeaderVisible ? 'pt-32' : 'pt-20'} md:pt-20 pb-20 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm ${isScrolling ? 'transition-none' : 'transition-all duration-500 ease-out'} relative z-20`}>
          
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-white text-lg">Chargement du menu...</p>
              </div>
            </div>
          )}

          {/* Affichage des catégories et produits */}
          {!isLoading && dynamicCategories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white text-lg">Aucune catégorie disponible</p>
              <button
                onClick={fetchDynamicData}
                className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {!isLoading && dynamicCategories.map((category) => (
            <section key={category._id} id={category._id} className="py-8 md:py-12">
              <div className="max-w-7xl mx-auto px-4">
                {/* Header de catégorie modernisé */}
                <div className="flex items-center justify-start mb-8 md:mb-10">
                  <div className="relative mr-4 md:mr-6">
                    <Image
                      src={category.image || "/Frites.png"}
                      alt={category.name}
                      width={60}
                      height={60}
                      className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg"
                    />
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg opacity-80"></div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2">{category.name}</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
                  </div>
                </div>
                
                {/* Grille de produits modernisée */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

                  
                  {dynamicProducts
                    .filter((product) => 
                      product.category.toLowerCase() === category.name.toLowerCase() && 
                      product.isAvailable
                    )
                    .map((product) => (
                      <div
                        key={product._id}
                        tabIndex={0}
                        onClick={() => openProductModal(product)}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.blur();
                          }, 100);
                        }}
                        className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer flex flex-row shadow-lg"
                      >
                        {/* Div gauche - Titre et prix modernisés */}
                        <div className="flex-1 flex flex-col justify-center relative z-10">
                          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">{product.name}</h2>
                          <span className="text-yellow-400 text-xl font-bold mb-3">{formatPrice(product.price)}</span>
                          <p className="text-gray-300 leading-relaxed mb-3">{product.description}</p>
                          
                          {/* Badge de popularité */}
                          <div className="flex gap-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full opacity-80">
                              Populaire
                            </div>
                          </div>
                        </div>
                        
                        {/* Div droite - Image avec bouton modernisé */}
                        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={120}
                            height={120}
                            className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                          />
                          
                          {/* Bouton + modernisé */}
                          <button 
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.blur();
                              }, 100);
                            }}
                            className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 text-xl font-bold hover:scale-110 z-10 shadow-lg hover:shadow-red-500/50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ))}
        </main>

        {/* Bouton Commander fixe - Mobile seulement */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsCartDialogOpen(true)}
            className="relative group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 focus:outline-none text-base overflow-hidden tracking-wide shadow-lg"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
            disabled={cartItems.length === 0}
          >
            <span className="relative z-10 flex items-center">
              <span className="font-semibold">COMMANDER</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-3 -right-7 text-gray-900 text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center ">
                  {cartItems.length}
                </span>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
          </button>
        </div>



        {/* Modal Produit */}
        {isModalOpen && selectedProduct && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeProductModal();
              }
            }}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-none md:rounded-2xl w-full h-full md:w-3/4 md:h-1/1 max-w-4xl max-h-[100vh] flex flex-col overflow-hidden border border-gray-600 shadow-2xl">
              {/* Contenu scrollable sur mobile */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Image du produit modernisée */}
                <div className="relative w-full h-48 md:h-52 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain transition-transform duration-300 hover:scale-105"
                  />
                  {/* Effet de fond lumineux */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-60"></div>
                  
                  {/* Bouton fermer modernisé */}
                  <button
                    onClick={closeProductModal}
                    className="absolute top-4 left-4 w-10 h-10 bg-gray-900/80 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 border border-gray-600"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Informations du produit modernisées */}
                <div className="py-6 px-4">
                  <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                      {selectedProduct.name}
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 mb-4"></div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-xl p-4 mb-6 border border-gray-600">
                    <p className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                      {formatPrice(selectedProduct.price)}
                    </p>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Badges populaires modernisés */}
                  <div className="flex gap-3 px-4 mb-8">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Le plus aimé
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Populaire
                    </div>
                  </div>

                  {/* Menu avec options modernisé - affiché seulement si la catégorie a des options */}
                  {(() => {
                    const options = getCategoryOptions(selectedProduct.category);
                    const hasOptions = options.supplements.length > 0 || options.sauces.length > 0 || 
                                     options.extras.length > 0 || options.accompagnements.length > 0 || 
                                     options.boissons.length > 0;
                    
                    if (!hasOptions) return null;
                    
                    return (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 mb-6 pt-6 rounded-t-2xl">

                        {/* Suppléments gratuits */}
                        {options.supplements.length > 0 && (
                          <div className="mb-8 bg-gray-700/50 mx-4 rounded-xl p-6 border border-gray-600 shadow-lg">
                            <div className="flex items-center mb-6">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <Image 
                                  src="/Crudités.png" 
                                  alt="Crudités" 
                                  width={20} 
                                  height={20} 
                                  className="w-5 h-5"
                                />
                              </div>
                              <h2 className="font-bold text-xl text-white bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                                Crudités
                              </h2>
                            </div>
                            <ul className="space-y-3">
                              {options.supplements.map((item) => (
                                <li 
                                  key={item._id} 
                                  onClick={() => toggleOption(item._id, { ...item, price: 0 })}
                                  className="bg-gray-600/50 rounded-lg p-3 border border-gray-500 flex justify-between items-center transition-all duration-200 hover:bg-gray-600/70 hover:border-gray-400 cursor-pointer group"
                                >
                                  <div className="text-white text-base font-medium">{item.name}</div>
                                  <div
                                    className={`w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center transition-all duration-200 ${
                                      selectedOptions[item._id] ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700 group-hover:bg-gray-600'
                                    }`}
                                  >
                                    {selectedOptions[item._id] && (
                                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Sauces */}
                        {options.sauces.length > 0 && (
                          <div className="mb-8 bg-gray-700/50 mx-4 rounded-xl p-6 border border-gray-600 shadow-lg">
                            <div className="flex items-center mb-6">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <Image 
                                  src="/Sauceicone.png" 
                                  alt="Sauces" 
                                  width={20} 
                                  height={20} 
                                  className="w-5 h-5"
                                />
                              </div>
                              <h2 className="font-bold text-xl text-white bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                                Sauces
                              </h2>
                            </div>
                            <ul className="space-y-3">
                              {options.sauces.map((item) => {
                                const isSelected = selectedUniqueOptions.sauces === item._id;
                                const isDisabled = selectedUniqueOptions.sauces !== null && selectedUniqueOptions.sauces !== item._id;
                                
                                return (
                                  <li 
                                    key={item._id} 
                                    onClick={() => toggleUnique(item._id, item, 'sauces')}
                                    className={`bg-gray-600/50 rounded-lg p-3 border border-gray-500 flex justify-between items-center transition-all duration-200 ${
                                      isDisabled ? 'opacity-40' : 'opacity-100'
                                    } cursor-pointer hover:bg-gray-600/70 hover:border-gray-400 group`}
                                  >
                                    <div className="text-white text-base font-medium">{item.name}</div>
                                    <div
                                      className={`w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        isSelected ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700 group-hover:bg-gray-600'
                                      }`}
                                    >
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* Suppléments payants */}
                        {options.extras.length > 0 && (
                          <div className="mb-8 bg-gray-600/30 mx-4 rounded-xl p-6 border border-gray-500">
                            <div className="flex items-center mb-6">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-black text-sm font-bold">+</span>
                              </div>
                              <h2 className="font-bold text-xl text-white">
                                Suppléments
                              </h2>
                            </div>
                            <ul className="space-y-3">
                              {options.extras.map((item) => (
                                <li 
                                  key={item._id} 
                                  onClick={() => toggleOption(item._id, item)}
                                  className="bg-gray-600/50 rounded-lg p-3 border border-gray-500 flex justify-between items-center transition-all duration-200 hover:bg-gray-600/70 hover:border-gray-400 cursor-pointer group"
                                >
                                  <div>
                                    <div className="text-white text-base font-medium">{item.name}</div>
                                    <div className="text-yellow-400 text-sm font-bold pl-3">+{item.price}€</div>
                                  </div>
                                  <div
                                    className={`w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center transition-all duration-200 ${
                                      selectedOptions[item._id] ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700 group-hover:bg-gray-600'
                                    }`}
                                  >
                                    {selectedOptions[item._id] && (
                                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Accompagnements */}
                        {options.accompagnements.length > 0 && (
                          <div className="mb-8 bg-gray-700/50 mx-4 rounded-xl p-6 border border-gray-600 shadow-lg">
                            <div className="flex items-center mb-6">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <Image 
                                  src="/frites-icone.png" 
                                  alt="Frites" 
                                  width={20} 
                                  height={20} 
                                  className="w-5 h-5"
                                />
                              </div>
                              <h2 className="font-bold text-xl text-white bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                                Accompagnements
                              </h2>
                            </div>
                            <ul className="space-y-3">
                              {options.accompagnements.map((item) => {
                                const isSelected = selectedUniqueOptions.accompagnements === item._id;
                                const isDisabled = selectedUniqueOptions.accompagnements !== null && selectedUniqueOptions.accompagnements !== item._id;
                                
                                return (
                                  <li 
                                    key={item._id} 
                                    onClick={() => toggleUnique(item._id, item, 'accompagnements')}
                                    className={`bg-gray-600/50 rounded-lg p-3 border border-gray-500 flex justify-between items-center transition-all duration-200 ${
                                      isDisabled ? 'opacity-40' : 'opacity-100'
                                    } cursor-pointer hover:bg-gray-600/70 hover:border-gray-400 group`}
                                  >
                                    <div>
                                      <div className="text-white text-base font-medium">{item.name}</div>
                                      <div className="text-yellow-400 text-sm font-bold pl-3">+{item.price}€</div>
                                    </div>
                                    <div
                                      className={`w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        isSelected ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700'
                                      } ${!isDisabled ? 'group-hover:bg-gray-600' : ''}`}
                                    >
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* Boissons */}
                        {options.boissons.length > 0 && (
                          <div className="mb-8 bg-gray-700/50 mx-4 rounded-xl p-6 border border-gray-600 shadow-lg">
                            <div className="flex items-center mb-6">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <Image 
                                  src="/Sodaicone.png" 
                                  alt="Soda" 
                                  width={20} 
                                  height={20} 
                                  className="w-5 h-5"
                                />
                              </div>
                              <h2 className="font-bold text-xl text-white bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                                Boissons
                              </h2>
                            </div>
                            <ul className="space-y-3">
                              {options.boissons.map((item) => {
                                const isSelected = selectedUniqueOptions.boissons === item._id;
                                const isDisabled = selectedUniqueOptions.boissons !== null && selectedUniqueOptions.boissons !== item._id;
                                
                                return (
                                  <li 
                                    key={item._id} 
                                    onClick={() => toggleUnique(item._id, item, 'boissons')}
                                    className={`bg-gray-600/50 rounded-lg p-3 border border-gray-500 flex justify-between items-center transition-all duration-200 ${
                                      isDisabled ? 'opacity-40' : 'opacity-100'
                                    } cursor-pointer hover:bg-gray-600/70 hover:border-gray-400 group`}
                                  >
                                    <div>
                                      <div className="text-white text-base font-medium">{item.name}</div>
                                      <div className="text-yellow-400 text-sm font-bold pl-3">+{item.price}€</div>
                                    </div>
                                    <div
                                      className={`w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        isSelected ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700'
                                      } ${!isDisabled ? 'group-hover:bg-gray-600' : ''}`}
                                    >
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bouton Ajouter à la commande modernisé */}
              <div className="p-6 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
                <button 
                  onClick={addToCartFromModal}
                  className="w-full md:w-[40%] md:ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-between transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25 border border-yellow-400 hover:border-yellow-500"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter à la commande
                  </span>
                  <span className="text-xl font-bold">{calculateModalTotal().toFixed(2)}€</span>
                </button>
              </div>
            </div>
          </div>
        )}
      {/* Dialog de confirmation du panier */}
      {isCartDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
          <div className="bg-gray-800 rounded-none md:rounded-lg w-full h-full md:w-[85%] md:h-[95%] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Votre Commande</h2>
                <button
                  onClick={() => setIsCartDialogOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 py-6 overflow-y-auto relative">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  <p className="text-lg">Votre panier est vide</p>
                  <p className="text-sm mt-2">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4 pb-20 px-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                     
                      {/* Desktop layout */}
                      <div className="hidden md:flex items-start space-x-4 ">
                        <div className="flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-24 h-24 object-contain rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-yellow-400 truncate mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-300">{item.description}</p>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {(() => {
                                const groupedOptions: { [key: string]: (OptionSupplement | OptionExtra | Accompagnements | Boissons)[] } = {};
                                
                                item.selectedOptions.forEach((option: OptionSupplement | OptionExtra | Accompagnements | Boissons) => {
                                  // Déterminer la catégorie basée sur le type d'option ou des propriétés spécifiques
                                  let category = 'Suppléments';
                                  if (option.name.toLowerCase().includes('frite') || option.name.toLowerCase().includes('accomp')) {
                                    category = 'Accompagnements';
                                  } else if (option.name.toLowerCase().includes('coca') || option.name.toLowerCase().includes('pepsi') || option.name.toLowerCase().includes('fanta') || option.name.toLowerCase().includes('sprite') || option.name.toLowerCase().includes('boisson')) {
                                    category = 'Boissons';
                                  } else if (option.price > 0) {
                                    category = 'Suppléments payants';
                                  }
                                  
                                  if (!groupedOptions[category]) {
                                    groupedOptions[category] = [];
                                  }
                                  groupedOptions[category].push(option);
                                });

                                return Object.entries(groupedOptions).map(([category, options]) => (
                                  <div key={category} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                                    <h4 className="text-xs font-semibold text-yellow-400 mb-2 uppercase tracking-wide">{category}</h4>
                                    <div className="space-y-1">
                                      {options.map((option, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                          <span className="text-sm text-gray-200">{option.name}</span>
                                          {option.price > 0 && (
                                            <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded">
                                              +{option.price}€
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-3 border-2 border-gray-700 rounded-lg p-1">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              className="w-8 h-8 bg-gray-600 hover:bg-gray-800 text-white border border-gray-700 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="text-lg font-bold min-w-[2rem] text-center  text-white py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-600 hover:bg-gray-800 text-white border border-gray-700 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-lg font-bold text-yellow-400">{item.totalPrice ? `${item.totalPrice.toFixed(2)}€` : item.price}</p>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="md:hidden border-b border-gray-600 pb-4 mb-4">
                        <div className="relative">
                          {/* Div contenant image et titre, adaptée à la taille de l'image */}
                          <div className="flex items-start space-x-4 mb-4 pr-28">
                            {/* Image à gauche */}
                            <div className="flex-shrink-0">
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-contain rounded-lg"
                              />
                            </div>
                            
                            {/* Titre du produit */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-yellow-400 text-lg leading-tight">{item.name}</h3>
                            </div>
                          </div>
                          
                          {/* Liste des options sélectionnées en dessous */}
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {(() => {
                                const groupedOptions: { [key: string]: (OptionSupplement | OptionExtra | Accompagnements | Boissons)[] } = {};
                                
                                item.selectedOptions.forEach((option: OptionSupplement | OptionExtra | Accompagnements | Boissons) => {
                                  // Déterminer la catégorie basée sur le type d'option ou des propriétés spécifiques
                                  let category = 'Suppléments';
                                  if (option.name.toLowerCase().includes('frite') || option.name.toLowerCase().includes('accomp')) {
                                    category = 'Accompagnements';
                                  } else if (option.name.toLowerCase().includes('coca') || option.name.toLowerCase().includes('pepsi') || option.name.toLowerCase().includes('fanta') || option.name.toLowerCase().includes('sprite') || option.name.toLowerCase().includes('boisson')) {
                                    category = 'Boissons';
                                  } else if (option.price > 0) {
                                    category = 'Suppléments payants';
                                  }
                                  
                                  if (!groupedOptions[category]) {
                                    groupedOptions[category] = [];
                                  }
                                  groupedOptions[category].push(option);
                                });

                                return Object.entries(groupedOptions).map(([category, options]) => (
                                  <div key={category} className="bg-gray-700/40 rounded-lg p-2 border border-gray-600/50">
                                    <h4 className="text-xs font-semibold text-yellow-400 mb-1 uppercase tracking-wide">{category}</h4>
                                    <div className="space-y-1">
                                      {options.map((option, index) => (
                                        <div key={index} className="flex justify-between items-center text-xs">
                                          <span className="text-gray-200">{option.name}</span>
                                          {option.price > 0 && (
                                            <span className="text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded text-xs">
                                              +{option.price}€
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}
                          
                          {/* Contrôles de quantité positionnés intelligemment */}
                          <div className="absolute top-0 right-0 w-24 h-12 flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white border border-gray-700 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="text-lg font-bold min-w-[2rem] text-center text-white px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white border border-gray-700 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Prix total en bas à droite - positionné par rapport à l'ensemble */}
                        <div className="relative mt-4">
                          <div className="flex justify-end">
                            <div className="w-20 h-12 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700">
                              <p className="text-lg font-bold text-yellow-400 text-center">{item.totalPrice ? `${item.totalPrice.toFixed(2)}€` : item.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Bouton fixe "Ajouter des articles" sur mobile */}
                  <div className="md:hidden left-4 right-4 z-40 flex justify-end pr-3">
                    <button
                      onClick={() => setIsCartDialogOpen(false)}
                      className=" w-[60%] bg-gray-900 text-white py-3 px-6 rounded-full font-semibold  transition-all focus:duration-200 shadow-lg hover:bg-gray-800 border border-gray-700"
                    >
                      + Ajouter des articles
                    </button>
                  </div>
                </div>
              )}
            </div>

                        {/* Footer */}
            <div className="p-6 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setIsCartDialogOpen(false);
                    setIsConfirmationOpen(true);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border border-yellow-400 hover:border-yellow-500 rounded-xl py-3 px-6 font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/25 whitespace-nowrap"
                  disabled={cartItems.length === 0}
                >
                  Confirmer la commande
                </button>
                
                <div className="text-gray-300 text-sm bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600">
                <p>Total: <span className="text-yellow-400 font-bold text-lg">{calculateTotal().toFixed(2)}€</span></p>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation de commande */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
          <div className="bg-gray-800 rounded-none md:rounded-lg w-full h-full md:w-[85%] md:h-[95%] flex flex-col overflow-hidden">
            {/* Header avec croix modernisé */}
            <div className="p-6 border-b border-gray-600 relative bg-gradient-to-r from-gray-800 to-gray-900">
              <button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  setIsCartDialogOpen(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700 p-2 rounded-full hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-left md:text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Choisissez votre option</h2>
                <p className="text-gray-300 text-sm md:text-base">Comment souhaitez-vous recevoir votre commande ?</p>
                {/* Ligne décorative moderne */}
                <div className="mt-4 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Body avec les deux options modernisées */}
            <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full max-w-5xl mx-auto">
                {/* Option Sur place modernisée */}
                <button
                  onClick={() => {
                    setIsConfirmationOpen(false);
                    setIsPaymentModalOpen(true);
                  }}
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white h-full p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 border border-gray-600 hover:border-yellow-400/60 overflow-hidden"
                >
                  {/* Effet de fond animé amélioré */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Effet de bordure lumineuse */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {/* Icône avec effet de glow amélioré */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300 scale-110 group-hover:scale-150"></div>
                    <Image
                      src="/iconeburger.png"
                      alt="Sur place"
                      width={80}
                      height={80}
                      className="w-20 h-20 md:w-24 md:h-24 invert relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                    />
                  </div>
                  
                  <div className="text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors duration-300 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-400">Sur place</h3>
                    <p className="text-gray-400 text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      Dégustez votre commande dans notre restaurant
                    </p>
                  </div>
                  
                  {/* Indicateur de sélection amélioré */}
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full border-2 border-gray-500 group-hover:border-yellow-400 group-hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Badge "Recommandé" */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    Recommandé
                  </div>
                </button>

                {/* Option A emporter modernisée */}
                <button
                  onClick={() => {
                    setIsConfirmationOpen(false);
                    setIsPaymentModalOpen(true);
                  }}
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white h-full p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 border border-gray-600 hover:border-yellow-400/60 overflow-hidden"
                >
                  {/* Effet de fond animé amélioré */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Effet de bordure lumineuse */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {/* Icône avec effet de glow amélioré */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300 scale-110 group-hover:scale-150"></div>
                    <Image
                      src="/iconesac.png"
                      alt="A emporter"
                      width={80}
                      height={80}
                      className="w-20 h-20 md:w-24 md:h-24 relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                    />
                  </div>
                  
                  <div className="text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors duration-300 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-400">A emporter</h3>
                    <p className="text-gray-400 text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      Emportez votre commande où vous voulez
                    </p>
                  </div>
                  
                  {/* Indicateur de sélection amélioré */}
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full border-2 border-gray-500 group-hover:border-yellow-400 group-hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Badge "Rapide" */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    Rapide
                  </div>
                </button>
              </div>
            </div>

            {/* Footer avec boutons modernisés */}
            <div className="p-6 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => {
                    setIsConfirmationOpen(false);
                    setIsCartDialogOpen(true);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border border-yellow-400 hover:border-yellow-500 rounded-xl py-3 px-6 font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                >
                  ← Retour au panier
                </button>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="text-gray-300 text-sm bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600">
                    <p>Total: <span className="text-yellow-400 font-bold text-lg">{calculateTotal().toFixed(2)}€</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Dialog de confirmation de suppression */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4 border border-gray-600">
            {/* Header */}
            <div className="p-6 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">Confirmation de suppression</h3>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <p className="text-gray-300">Êtes-vous sûr de vouloir supprimer ce produit ?</p>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-600 flex justify-between">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-medium transition-colors border border-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de paiement */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={calculateTotal()}
        cartItems={cartItems}
        onPaymentSuccess={() => {
          setIsPaymentModalOpen(false);
          // Ici vous pourriez vider le panier ou rediriger
          console.log('Paiement réussi !');
        }}
      />
    </div>
    </div>
  );
}