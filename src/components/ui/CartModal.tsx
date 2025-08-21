'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from './CartProvider';
import { useState, useEffect } from 'react';
import { getCategoriesWithSteps } from '../../lib/dataService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

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

export default function CartModal({ isOpen, onClose, restaurantName }: CartModalProps) {
  const { cartItems, calculateTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
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

  // Fonction utilitaire pour créer un identifiant unique (même logique que dans Footer)
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
    if (!item.category) {
      return false;
    }
    
    const itemCategory = categories.find(cat => cat.id === item.category || cat._id === item.category);
    return itemCategory?.allowedOptions && itemCategory.allowedOptions.length > 0;
  };

  // Fonction pour grouper les commandes par catégorie
  const groupCommandsByCategory = () => {
    const commandsWithSteps = cartItems.filter(item => hasSteps(item));
    const commandsWithoutSteps = cartItems.filter(item => !hasSteps(item));
    
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

  const { groupedCommands, commandsWithoutSteps } = groupCommandsByCategory();

  if (!isOpen) return null;

  return (
    <>
      {/*🟩 ///// Modal principal ///// 🟩*/}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95%] h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800 text-center">
              🛒 Votre Commande - {restaurantName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/*🟩 ///// Commandes avec steps ///// 🟩*/}
            {Object.entries(groupedCommands).map(([categoryId, items]) => {
              const categoryInfo = categories.find(cat => cat.id === categoryId || cat._id === categoryId);
              return (
                <div key={categoryId} className="border-2 border-gray-300 rounded-lg bg-gray-50 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {categoryInfo?.name || categoryId}
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={createUniqueId(item)} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-20 h-20 object-contain rounded-lg border-2 border-gray-200"
                          />
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                            <p className="text-gray-600 text-sm">Prix: {item.price}€</p>
                            
                            {/* Affichage des steps sélectionnés */}
                            {item.stepSelections && Object.entries(item.stepSelections).map(([stepKey, selections]) => {
                              const hasStepKey = categoryInfo?.allowedOptions?.includes(stepKey);
                              if (!hasStepKey) return null;
                              
                              const selectedItems = Object.entries(selections)
                                .filter(([_, count]) => count > 0)
                                .map(([itemId, count]) => {
                                  return { name: itemId, count }; // Utiliser l'ID comme nom pour l'instant
                                });
                              
                              if (selectedItems.length === 0) return null;
                              
                              return (
                                <div key={stepKey} className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Étape: {stepKey}</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedItems.map((item, idx) => (
                                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {item.name} {item.count > 1 ? `(x${item.count})` : ''}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(createUniqueId(item), Math.max(0, item.quantity - 1))}
                                className="w-8 h-8 p-0"
                              >
                                -
                              </Button>
                              <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(createUniqueId(item), item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setItemToDelete(createUniqueId(item));
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/*🟩 ///// Commandes sans steps ///// 🟩*/}
            {commandsWithoutSteps.length > 0 && (
              <div className="border-2 border-gray-300 rounded-lg bg-gray-50 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  🍽️ Autres Articles
                </h3>
                
                <div className="space-y-4">
                  {commandsWithoutSteps.map((item) => (
                    <div key={createUniqueId(item)} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-20 object-contain rounded-lg border-2 border-gray-200"
                        />
                        
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                          <p className="text-gray-600 text-sm">Prix: {item.price}€</p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(createUniqueId(item), Math.max(0, item.quantity - 1))}
                              className="w-8 h-8 p-0"
                            >
                              -
                            </Button>
                            <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(createUniqueId(item), item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setItemToDelete(createUniqueId(item));
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/*🟩 ///// Résumé et actions ///// 🟩*/}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-300 pt-6 mt-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Total de la commande</h3>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-800">{calculateTotal().toFixed(2)}€</p>
                    <p className="text-sm text-gray-600">{cartItems.length} article(s)</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsAbandonConfirmOpen(true)}
                    variant="outline"
                    className="flex-1 bg-red-50 text-red-600 border-red-300 hover:bg-red-100 text-lg py-3"
                  >
                    🗑️ Abandonner
                  </Button>
                  
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100 text-lg py-3"
                  >
                    ✏️ Continuer à modifier
                  </Button>
                  
                  <Button
                    onClick={() => {
                      // Ici vous pouvez ajouter la logique pour finaliser la commande
                      console.log('Commande finalisée:', cartItems);
                      onClose();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                  >
                    ✅ Finaliser la commande
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
          
          <div className="flex space-x-3">
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
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Abandonner
            </Button>
          </div>
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
          
          <div className="flex space-x-3">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


