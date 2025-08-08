"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { products, categories, supplements, extra, accompagnements, boissons } from "../data";
import { Product, OptionSupplement, OptionExtra, Accompagnements, Boissons } from "../types";
import { useCart } from "../CartProvider";

export default function CommandePage() {
  const [activeCategory, setActiveCategory] = useState("assiette");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
  const [selectedOptionsDetails, setSelectedOptionsDetails] = useState<{ [key: string]: (OptionSupplement | OptionExtra | Accompagnements | Boissons) | undefined }>({});
  // États pour gérer la sélection unique des accompagnements et boissons
  const [selectedUniqueOptions, setSelectedUniqueOptions] = useState<{
    accompagnements: string | null;
    boissons: string | null;
  }>({
    accompagnements: null,
    boissons: null
  });
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { cartItems, addToCart, updateQuantity, clearCart, calculateTotal } = useCart();

  // Fonction pour vérifier si une catégorie a des options
  const getCategorySteps = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.steps || null;
  };

  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveCategory(categoryId);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Réinitialiser les options sélectionnées
    setSelectedOptions({});
    setSelectedOptionsDetails({});
    setSelectedUniqueOptions({
      accompagnements: null,
      boissons: null
    });
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedOptions({});
    setSelectedOptionsDetails({});
    setSelectedUniqueOptions({
      accompagnements: null,
      boissons: null
    });
  };

  const toggleOption = (optionId: string, optionData: OptionSupplement | OptionExtra | Accompagnements | Boissons) => {
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
  const toggleUnique = (optionId: string, optionData: Accompagnements | Boissons, type: 'accompagnements' | 'boissons') => {
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
      setSelectedUniqueOptions(prev => ({
        ...prev,
        [type]: optionId
      }));
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: true
      }));
      setSelectedOptionsDetails(prev => ({
        ...prev,
        [optionId]: optionData
      }));
    }
  };

  const calculateModalTotal = () => {
    if (!selectedProduct) return 0;
    
    const basePrice = parseFloat(selectedProduct.price.replace('€', '').trim());
    let total = basePrice;
    
    Object.values(selectedOptionsDetails).forEach((option: OptionSupplement | OptionExtra | Accompagnements | Boissons | undefined) => {
      if (option && option.price) {
        total += option.price;
      }
    });
    
    return total;
  };

  const addToCartFromModal = () => {
    if (selectedProduct) {
      // Créer un identifiant unique pour cette commande
      const uniqueId = `${selectedProduct.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Récupérer les options sélectionnées
      const selectedOptionsList = Object.values(selectedOptionsDetails).filter((option): option is OptionSupplement | OptionExtra | Accompagnements | Boissons => option !== undefined);
      
      // Créer l'objet de commande avec options
      const orderItem = {
        ...selectedProduct,
        id: uniqueId,
        originalId: selectedProduct.id,
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

    categories.forEach((category) => {
      const element = document.getElementById(category.id);
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
  }, [activeCategory]);

  // Gestion du scroll pour le scroll horizontal
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);

      // Scroll horizontal automatique des catégories - plus rapide
      if (categoriesRef.current) {
        const scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
        const scrollAmount = scrollDirection * 4; // Vitesse de scroll augmentée
        categoriesRef.current.scrollLeft += scrollAmount;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen text-white">
      {/* Header principal - disparaît au scroll sur mobile */}
      <header className="md:hidden bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <h2 className="text-xl font-bold text-center">Delice Wand</h2>
          </div>
        </div>
      </header>

      {/* Header desktop - reste fixe */}
      <header className="hidden md:block fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">Delice Wand</h1>
            <nav className="flex items-center space-x-6 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className={`whitespace-nowrap px-3 py-2 text-lg font-medium transition-all duration-200 relative ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {category.name}
                  {activeCategory === category.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Header mobile sticky avec catégories */}
      <header className="md:hidden sticky top-0 bg-black/95 backdrop-blur-sm z-40 border-b border-gray-700 shadow-lg">
        <div className="px-4 py-3">
          <div 
            ref={categoriesRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
              {categories.map((category) => (
               <button
                 key={category.id}
                 data-category={category.id}
                 onClick={() => scrollToSection(category.id)}
                 className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                   activeCategory === category.id
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

             {/* Contenu principal */}
       <main className="pt-24 md:pt-16 pb-20">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-start mb-6 md:mb-8">
                <Image
                  src={category.image || "/Frites.png"}
                  alt={category.name}
                  width={50}
                  height={50}
                  className="mr-3 md:mr-4 md:w-[60px] md:h-[60px]"
                />
                <h2 className="text-2xl md:text-3xl font-bold">{category.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {products
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                      <div
                        key={product.id}
                        tabIndex={0}
                        onClick={() => openProductModal(product)}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.blur();
                          }, 100);
                        }}
                        className="bg-gray-900 rounded-xl overflow-hidden focus:scale-110 transition-all duration-200 shadow-lg focus:shadow-2xl cursor-pointer flex flex-row"
                      >
                        {/* Div gauche - Titre et prix */}
                        <div className="p-3 md:p-4 flex-1 flex flex-col justify-center">
                          <h2 className="text-base md:text-lg font-semibold mb-1">{product.name}</h2>
                          <span className="text-gray-500 text-sm pb-1 font-semibold">{product.price}</span>
                          <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-2">{product.description}</p>
                        </div>
                        
                        {/* Div droite - Image avec bouton */}
                        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                                                  <Image
                          src={product.image}
                          alt={product.name}
                          width={120}
                          height={120}
                          className="object-contain w-full h-full"
                        />
                          {/* Bouton + */}
                          <button 
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.blur();
                              }, 100);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 bg-red-600 focus:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 text-base md:text-lg font-bold focus:scale-110 z-10"
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

      {/* Bouton Commander fixe */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button 
          onClick={() => setIsCartDialogOpen(true)}
          onFocus={(e) => {
            setTimeout(() => {
              e.target.blur();
            }, 100);
          }}
          className="bg-yellow-400 focus:bg-yellow-500 text-gray-600 border border-gray-600 px-6 py-3 md:px-9 md:py-4 rounded-full shadow-lg transition-all duration-200 font-medium text-lg md:text-2xl active:scale-95 focus:scale-110"
          disabled={cartItems.length === 0}
        >
          Commander ({cartItems.length})
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
          <div className="bg-white rounded-none md:rounded-lg w-full h-full md:w-3/4 md:h-1/1 max-w-4xl max-h-[100vh] flex flex-col overflow-hidden">
            {/* Contenu scrollable sur mobile */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Image du produit */}
              <div className="relative w-full h-48 md:h-52 bg-gray-100 flex items-center justify-center">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
                {/* Bouton fermer */}
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Informations du produit */}
              <div className="p-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h1>
                <p className="text-md md:text-lg font-bold text-red-600 mb-4">
                  {selectedProduct.price}
                </p>
                <p className="text-gray-600 text-sm md:text-md mb-6">
                  {selectedProduct.description}
                </p>

                {/* Menu scrollable avec options - affiché seulement si la catégorie a des steps */}
                {getCategorySteps(selectedProduct.category) && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6 max-h-100 overflow-y-auto scrollbar-hide">
                    
                                         {/* Suppléments gratuits */}
                     {getCategorySteps(selectedProduct.category)?.supplements && (
                       <div className="mb-6 bg-white border-gray-200 py-1 px-2">
                         <h2 className="font-semibold text-xl text-gray-800 mb-4">
                           {getCategorySteps(selectedProduct.category)?.supplements.title || "Salades"}
                         </h2>
                         <ul className="space-y-1">
                           {getCategorySteps(selectedProduct.category)?.supplements.data.map((item) => (
                             <li key={item.id} className="mb-2 border-b border-gray-100 flex justify-between items-center pb-2">
                               <div className="text-gray-700 text-md">{item.name}</div>
                               <button
                                 onClick={() => toggleOption(item.id, { ...item, price: 0 })}
                                 className={`w-4 h-4 border-2 border-gray-700 rounded flex items-center justify-center transition-colors ${
                                   selectedOptions[item.id] ? 'bg-gray-800' : 'bg-white'
                                 }`}
                               >
                                 {selectedOptions[item.id] && (
                                   <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                                 )}
                               </button>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}

                                         {/* Suppléments payants */}
                     {getCategorySteps(selectedProduct.category)?.extra && (
                       <div className="my-6 bg-white border-gray-200 py-1 px-2">
                         <h2 className="font-semibold text-xl text-gray-800 mb-4">
                           {getCategorySteps(selectedProduct.category)?.extra.title || "Suppléments"}
                         </h2>
                         <ul className="space-y-1">
                           {getCategorySteps(selectedProduct.category)?.extra.data.map((item) => (
                             <li key={item.id} className="mb-2 border-b border-gray-100 flex justify-between items-center">
                               <div>
                                 <div className="text-gray-700 text-md">{item.name}</div>
                                 <div className="text-gray-400 text-sm font-medium pl-3">+{item.price}€</div>
                               </div>
                               <button
                                 onClick={() => toggleOption(item.id, item)}
                                 className={`w-4 h-4 border-2 border-gray-700 rounded flex items-center justify-center transition-colors ${
                                   selectedOptions[item.id] ? 'bg-gray-800' : 'bg-white'
                                 }`}
                               >
                                 {selectedOptions[item.id] && (
                                   <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                                 )}
                               </button>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}

                                         {/* Accompagnements */}
                     {getCategorySteps(selectedProduct.category)?.accompagnements && (
                       <div className="my-6 bg-white rounded-lg border-gray-200 py-1 px-2">
                         <h2 className="font-semibold text-xl text-gray-800 mb-4">
                           {getCategorySteps(selectedProduct.category)?.accompagnements.title || "Accompagnements"}
                         </h2>
                         <ul className="space-y-1">
                           {getCategorySteps(selectedProduct.category)?.accompagnements.data.map((item) => {
                             const isSelected = selectedUniqueOptions.accompagnements === item.id;
                             const isDisabled = selectedUniqueOptions.accompagnements !== null && selectedUniqueOptions.accompagnements !== item.id;
                             
                             return (
                               <li key={item.id} className={`mb-2 border-b border-gray-100 flex justify-between items-center transition-opacity ${
                                 isDisabled ? 'opacity-40' : 'opacity-100'
                               }`}>
                                 <div>
                                   <div className="text-gray-700 text-md">{item.name}</div>
                                   <div className="text-gray-400 text-sm font-medium pl-3">+{item.price}€</div>
                                 </div>
                                 <button
                                   onClick={() => toggleUnique(item.id, item, 'accompagnements')}
                                   disabled={isDisabled}
                                   className={`w-4 h-4 border-2 border-gray-700 rounded flex items-center justify-center transition-colors ${
                                     isSelected ? 'bg-gray-800' : 'bg-white'
                                   } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                 >
                                   {isSelected && (
                                     <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                     </svg>
                                   )}
                                 </button>
                               </li>
                             );
                           })}
                         </ul>
                       </div>
                     )}

                                         {/* Boissons */}
                     {getCategorySteps(selectedProduct.category)?.boissons && (
                       <div className="my-6 bg-white rounded-lg border-gray-200 py-1 px-2">
                         <h2 className="font-semibold text-xl text-gray-800 mb-4">
                           {getCategorySteps(selectedProduct.category)?.boissons.title || "Boissons"}
                         </h2>
                         <ul className="space-y-1">
                           {getCategorySteps(selectedProduct.category)?.boissons.data.map((item) => {
                             const isSelected = selectedUniqueOptions.boissons === item.id;
                             const isDisabled = selectedUniqueOptions.boissons !== null && selectedUniqueOptions.boissons !== item.id;
                             
                             return (
                               <li key={item.id} className={`mb-2 border-b border-gray-100 flex justify-between items-center transition-opacity ${
                                 isDisabled ? 'opacity-40' : 'opacity-100'
                               }`}>
                                 <div>
                                   <div className="text-gray-700 text-md">{item.name}</div>
                                   <div className="text-gray-400 text-sm font-medium pl-3">+{item.price}€</div>
                                 </div>
                                 <button
                                   onClick={() => toggleUnique(item.id, item, 'boissons')}
                                   disabled={isDisabled}
                                   className={`w-4 h-4 border-2 border-gray-700 rounded flex items-center justify-center transition-colors ${
                                     isSelected ? 'bg-gray-800' : 'bg-white'
                                   } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                 >
                                   {isSelected && (
                                     <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                     </svg>
                                   )}
                                 </button>
                               </li>
                             );
                           })}
                         </ul>
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>

            {/* Bouton Ajouter à la commande */}
            <div className="p-6 border-t border-gray-200">
              <button 
                onClick={addToCartFromModal}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-between transition-all duration-200"
              >
                <span>Ajouter à la commande</span>
                <span className="text-xl">{calculateModalTotal().toFixed(2)}€</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation du panier */}
      {isCartDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-none md:rounded-lg w-full h-full md:w-[85%] md:h-[95%] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Votre Commande</h2>
                <button
                  onClick={() => setIsCartDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 p-6 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Votre panier est vide</p>
                  <p className="text-sm mt-2">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                     
                      {/* Desktop layout */}
                      <div className="hidden md:flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <ul className="text-xs text-gray-600 mt-1">
                              {item.selectedOptions.map((option: OptionSupplement | OptionExtra | Accompagnements | Boissons, index: number) => (
                                <li key={index} className="flex justify-between">
                                  <span>{option.name}</span>
                                  {option.price > 0 && <span>+{option.price}€</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="text-lg font-bold text-red-600">{item.totalPrice ? `${item.totalPrice.toFixed(2)}€` : item.price}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="text-lg font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="md:hidden ">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain rounded-lg"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                              <ul className="text-xs text-gray-600 mt-1">
                                {item.selectedOptions.map((option: OptionSupplement | OptionExtra | Accompagnements | Boissons, index: number) => (
                                  <li key={index} className="flex justify-between">
                                    <span>{option.name}</span>
                                    {option.price > 0 && <span>+{option.price}€</span>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="text-lg font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Prix sous l'image sur mobile */}
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-red-600">{item.totalPrice ? `${item.totalPrice.toFixed(2)}€` : item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-red-600">{calculateTotal().toFixed(2)}€</span>
              </div>
              
                              <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsCartDialogOpen(false);
                      setIsConfirmationOpen(true);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    disabled={cartItems.length === 0}
                  >
                    Confirmer la commande
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation de commande */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-none md:rounded-lg w-full h-full md:w-[85%] md:h-[95%] flex flex-col overflow-hidden">
            {/* Header avec croix */}
            <div className="p-6 border-b border-gray-200 relative">
              <button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  setIsCartDialogOpen(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 text-center">Confirmation de commande</h2>
            </div>

            {/* Body avec les deux divs cliquables */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Première div - Sur place*/}
                <button
                  onClick={() => {
                    // Action à implémenter
                    console.log('Burger sélectionné');
                  }}
                  className="bg-black hover:bg-gray-900 text-white h-[100%] p-6 rounded-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Image
                    src="/iconeburger.png"
                    alt="Burger"
                    width={64}
                    height={64}
                    className="w-32 h-32 mb-3 invert"
                  />
                  <span className="text-lg font-semibold">Sur place</span>
                </button>

                {/* Deuxième div - A emporter */}
                <button
                  onClick={() => {
                    // Action à implémenter
                    console.log('Sac sélectionné');
                  }}
                  className="bg-black hover:bg-gray-900 text-black border-2 border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Image
                    src="/iconesac.png"
                    alt="Sac"
                    width={64}
                    height={64}
                    className="w-32 h-32 mb-3"
                  />
                  <span className="text-lg text-white font-semibold">A emporter</span>
                </button>
              </div>
            </div>

            {/* Footer avec bouton Retour */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  setIsCartDialogOpen(true);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
