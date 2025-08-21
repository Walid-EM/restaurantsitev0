'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from './CartProvider';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCategoriesWithSteps, getCategorySteps } from '../../lib/dataService';
import CartModal from './CartModal';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  supplements?: Array<{ id: string }>;
  stepSelections?: Record<string, Record<string, number>>;
}

interface Category {
  id?: string;
  _id?: string;
  name: string;
  order?: number;
  allowedOptions?: string[];
}

interface Supplement {
  id: string;
}

interface StepSelection {
  [key: string]: number;
}

export default function Footer() {
  const { cartItems, calculateTotal, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  
  // États pour les données MongoDB
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Charger les données depuis MongoDB au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategoriesWithSteps();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Fonction pour détecter le client actuel depuis l'URL
  const getCurrentClient = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    return pathSegments[0] || 'ClientB'; // Fallback vers ClientB si aucun client détecté
  };
  
  // Fonction utilitaire pour créer un identifiant unique (même logique que dans CartProvider)
  const createUniqueId = (item: CartItem) => {
    const supplementsKey = item.supplements 
      ? JSON.stringify(item.supplements.sort((a: Supplement, b: Supplement) => a.id.localeCompare(b.id)))
      : '';
    const stepSelectionsKey = item.stepSelections 
      ? JSON.stringify(item.stepSelections)
      : '';
    return `${item.id}_${supplementsKey}_${stepSelectionsKey}`;
  };

  // Fonction pour vérifier si une commande a des steps
  const hasSteps = (item: CartItem) => {
    // Vérifier d'abord si l'item a une category
    if (!item.category) {
      console.log('❌ Item sans category:', item.title);
      return false;
    }
    
    // Ensuite vérifier si cette category spécifique a des steps dans MongoDB
    const itemCategory = categories.find(cat => 
      cat.id === item.category || 
      cat._id === item.category ||
      cat.name === item.category ||
      cat.name.toLowerCase() === item.category?.toLowerCase()
    );
    const hasStepsResult = itemCategory?.allowedOptions && 
                          Array.isArray(itemCategory.allowedOptions) && 
                          itemCategory.allowedOptions.length > 0;
    
    console.log(`🔍 Debug hasSteps pour "${item.title}":`, {
      itemCategory: item.category,
      foundCategory: itemCategory?.name,
      hasSteps: hasStepsResult,
      allowedOptions: itemCategory?.allowedOptions || 'none'
    });
    
    return hasStepsResult;
  };

  // Fonction pour grouper les commandes par catégorie
  const groupCommandsByCategory = () => {
    const commandsWithSteps = cartItems.filter(item => hasSteps(item));
    const commandsWithoutSteps = cartItems.filter(item => !hasSteps(item));
    
    console.log('📊 Groupement des commandes:', {
      totalItems: cartItems.length,
      withSteps: commandsWithSteps.length,
      withoutSteps: commandsWithoutSteps.length,
      withStepsItems: commandsWithSteps.map(item => ({ title: item.title, category: item.category })),
      withoutStepsItems: commandsWithoutSteps.map(item => ({ title: item.title, category: item.category }))
    });
    
    const groupedCommands: { [key: string]: CartItem[] } = {};
    
    commandsWithSteps.forEach(item => {
      const categoryId = item.category || 'unknown';
      if (!groupedCommands[categoryId]) {
        groupedCommands[categoryId] = [];
      }
      groupedCommands[categoryId].push(item);
    });
    
    return { groupedCommands, commandsWithoutSteps };
  };

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [selectedItemToModify, setSelectedItemToModify] = useState<CartItem | null>(null);
  const [tempModifications, setTempModifications] = useState<Record<string, unknown> | null>(null);

  const { groupedCommands, commandsWithoutSteps } = groupCommandsByCategory();

  return (
    <>
      {/*🟩 ///// Footer MainPageCommand ///// 🟩*/}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-2">
        <div className={`absolute right-30 -top-3 w-[25%] bg-white transition-transform duration-200 ${isButtonPressed ? 'scale-120' : ''}`}>
          <Button 
            className="bg-white text-gray-600 border-2 border-gray-600 text-3xl font-semibold rounded-full w-full h-20 hover:scale-110 transition-transform duration-300"
            disabled={cartItems.length === 0}
            onClick={() => setIsCartModalOpen(true)}
            onMouseDown={() => setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
            onMouseLeave={() => setIsButtonPressed(false)}
            onTouchStart={() => setIsButtonPressed(true)}
            onTouchEnd={() => setIsButtonPressed(false)}
          >
            Commander
          </Button> 
        </div>
        <div className="w-[95%] mx-auto bg-white rounded-lg shadow-lg border-2 border-gray-300 p-4">
          <div className="flex gap-4">
            {/* Div 2 - Contenu principal (75%) */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Votre commande</h3>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Votre panier est vide</p>
                  <p className="text-sm">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                    {cartItems.map((item) => (
                      <div key={createUniqueId(item)} className="relative flex-shrink-0">
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-30 h-30 object-contain rounded-lg"
                          />
                          {/* Compteur de quantité - maintenant en bas à droite */}
                          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center truncate max-w-30">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Div 1 - Bouton et prix (25%) */}
            <div className="w-1/4 flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {calculateTotal().toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/*🟩 ///// Nouveau CartModal ///// 🟩*/}
      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        restaurantName={getCurrentClient()}
      />

      {/*🟩 ///// Dialog de confirmation d'abandon ///// 🟩*/}
      <Dialog open={isAbandonConfirmOpen} onOpenChange={setIsAbandonConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-700">
              Abandonner la commande ?
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir abandonner votre commande ? 
              Tous les articles seront supprimés du panier.
            </p>
          </div>
          
          <DialogFooter className="flex space-x-3">
            <Button
              onClick={() => setIsAbandonConfirmOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                clearCart();
                setIsAbandonConfirmOpen(false);
                setIsCartModalOpen(false);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Abandonner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*🟩 ///// Dialog de confirmation de suppression ///// 🟩*/}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-700">
              Supprimer l&apos;article ?
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cet article du panier ?
            </p>
          </div>
          
          <DialogFooter className="flex space-x-3">
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (itemToDelete) {
                  removeFromCart(itemToDelete);
                  setItemToDelete(null);
                }
                setIsDeleteConfirmOpen(false);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*🟩 ///// Dialog de modification (MainPageCommand1) ///// 🟩*/}
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent className="max-w-[90%] h-[80%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-700">
              Modifier : {selectedItemToModify?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            {selectedItemToModify && (() => {
              // Récupérer la catégorie de l'item sélectionné
              const itemCategory = categories.find(cat => cat.id === selectedItemToModify.category || cat._id === selectedItemToModify.category);
              const categorySteps = itemCategory?.allowedOptions;
              
              if (!categorySteps) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Cette commande n&apos;a pas de steps à modifier</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-6">
                  {/* Affichage des steps de la catégorie */}
                  {categorySteps && Array.isArray(categorySteps) && categorySteps.map((stepName) => (
                    <div key={stepName} className="p-6 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Étape: {stepName}
                        </h3>
                      </div>
                      
                      {/* Interface de sélection des suppléments */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Placeholder pour les données des steps - à adapter selon la structure MongoDB */}
                        <div className="text-center text-gray-500">
                          <p>Configuration des étapes en cours...</p>
                          <p className="text-sm">Les étapes seront chargées depuis MongoDB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          
          {/* Actions finales */}
          <div className="sticky bg-white border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => setIsModifyDialogOpen(false)}
                variant="outline"
                className="px-6 py-2"
              >
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  // Appliquer les modifications
                  if (selectedItemToModify && tempModifications) {
                    // Logique pour appliquer les modifications
                    console.log('Modifications appliquées:', tempModifications);
                  }
                  setIsModifyDialogOpen(false);
                }}
                className="bg-gray-700 text-white px-6 py-2"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}