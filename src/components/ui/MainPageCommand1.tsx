"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCart, CartItem } from "./CartProvider";
import "./steps-styles.css";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Types pour les données des étapes
interface StepDataItem {
  id: string;
  _id?: string;
  name: string;
  title?: string;
  price?: number;
  image?: string;
  description?: string;
  quantity?: number;
}

interface StepData {
  type: "supplements" | "extra" | "accompagnements" | "boissons" | "sauces";
  data: StepDataItem[];
  title: string;
}

interface AccompanimentItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  description?: string;
}

// Types personnalisés pour remplacer les imports shadcn
type MainPageCommandType = {
    _id: string;
    name: string;
    description?: string;
    
    image?: string;
    price?: string;
    isAvailable?: boolean;
    supplements?: Array<{
        id: string;
        name: string;
        price: number;
        image?: string;
    }>;
    category?: string;
    accompaniments?: AccompanimentItem[];
    steps?: {
        [key: string]: StepData;
    };
};

type Category = {
    id?: string;
    _id?: string;
    name: string;
    image?: string;
    description: string;
    isActive?: boolean;
    order?: number;
    createdAt?: Date;
    allowedOptions?: string[];
    steps?: {
        [key: string]: StepData;
    };
    accompaniments?: Array<{
        id: string;
        image: string;
        alt: string;
        hasPlus?: boolean;
    }>;
};

// Hook personnalisé pour bloquer le scroll global
const useScrollLock = () => {
    useEffect(() => {
        // Sauvegarder la position de scroll actuelle
        const scrollY = window.scrollY;
        
        // Appliquer les styles pour bloquer le scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Fonction de nettoyage
        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, []);
};

type Props = {
    commands?: MainPageCommandType[]; // Optionnel maintenant qu'on utilise MongoDB
};

type SupplementQuantity = {
    [key: string]: number;
};

// Composant Card personnalisé avec Tailwind et animations
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.div 
        className={`bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm ${className}`}
        whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

// Composant CardTitle personnalisé avec Tailwind
const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

// Composant Dialog personnalisé avec Tailwind
const Dialog = ({ 
    open, 
    onOpenChange, 
    children 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    children: React.ReactNode; 
}) => {
    console.log('Dialog render - open:', open);
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center h-full w-full overflow-hidden">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-white/30 backdrop-blur-md h-full w-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenChange(false);
                }}
            />
            {/* Dialog content */}
            <div 
                className="relative z-[9999] w-full max-w-[90vh] mx-5 h-[75vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

// Composant DialogContent personnalisé avec Tailwind
const DialogContent = ({ 
    children, 
    className = "" 
}: { 
    children: React.ReactNode; 
    className?: string; 
}) => (
    <div 
        className={`bg-white rounded-lg shadow-lg border border-gray-200 h-full ml-12 max-w-[55vh] flex flex-col ${className}`} 
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </div>
);

// Composant DialogHeader personnalisé avec Tailwind
const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex-shrink-0 p-6 pb-0">
        {children}
    </div>
);

// Composant DialogTitle personnalisé avec Tailwind
const DialogTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-2xl font-bold ${className}`}>
        {children}
    </h2>
);

// Composant Button personnalisé avec Tailwind et animations
const Button = ({ 
    children, 
    onClick, 
    className = "",
    ...props 
}: { 
    children: React.ReactNode; 
    onClick?: () => void;
    className?: string;
    [key: string]: React.ReactNode | (() => void) | string | undefined;
}) => (
    <motion.button 
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
        onClick={onClick}
        whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.15, ease: "easeOut" }
        }}
        whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1, ease: "easeIn" }
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
    >
        {children}
    </motion.button>
);

export default function MainPageCommand1({ commands }: Props) {
    // Utiliser le hook pour bloquer le scroll global
    useScrollLock();
    
    const pathname = usePathname();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState<MainPageCommandType | null>(null);
    const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});
    const [focusedButton, setFocusedButton] = useState<string | null>(null);
    const [supplementQuantities, setSupplementQuantities] = useState<SupplementQuantity>({});
    const [isOpeningDialog, setIsOpeningDialog] = useState(false); // Protection contre les déclenchements multiples
    const [mouseDownTime, setMouseDownTime] = useState<number>(0); // Pour détecter la durée du clic
    const [touchStartTime, setTouchStartTime] = useState<number>(0); // Pour détecter la durée du touch
    const [currentStep, setCurrentStep] = useState<string>("supplements"); // Étape actuelle
    const [stepSelections, setStepSelections] = useState<{ [key: string]: SupplementQuantity }>({}); // Sélections par étape
    
    // États pour gérer la sélection des options (comme dans /Commande)
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
    const [selectedOptionsDetails, setSelectedOptionsDetails] = useState<{ [key: string]: StepDataItem | undefined }>({});
    
    // États pour gérer la sélection unique des accompagnements, boissons et sauces (comme dans /Commande)
    const [selectedUniqueOptions, setSelectedUniqueOptions] = useState<{
        accompagnements: string | null;
        boissons: string | null;
        sauces: string | null;
    }>({
        accompagnements: null,
        boissons: null,
        sauces: null
    });
    
    const { addToCart } = useCart();

    // === NOUVEAUX ÉTATS POUR LE FLUX DE COMMANDE COMPLET ===
    
    // États pour la gestion du panier avancé
    const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // États pour la gestion des quantités dans le panier
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // États pour le mode de réception
    const [deliveryMode, setDeliveryMode] = useState<'sur-place' | 'a-emporter' | null>(null);
    
    // États pour le calcul des prix en temps réel
    const [currentTotalPrice, setCurrentTotalPrice] = useState<number>(0);
    
    // États MongoDB - Ajoutés pour remplacer les données statiques
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<MainPageCommandType[]>([]);
    
    // États pour les données des étapes (comme dans /Commande)
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
    
    // État pour stocker les options de catégories (comme dans /Commande)
    const [categoryOptionsMap, setCategoryOptionsMap] = useState<{ [key: string]: string[] }>({
        // Valeurs par défaut en cas d'erreur de chargement
        'assiette': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'sandwich': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'tacos': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'bicky': ['supplements', 'sauces', 'extras'],
        'snacks': ['sauces'],
        'dessert': [],
        'boissons': []
    });

    // === FONCTIONS MANQUANTES ===
    
    // Fonctions pour gérer les événements de souris et touch
    const handleMouseDown = (commandId: string) => () => {
        setFocusedButton(commandId);
        setMouseDownTime(Date.now());
    };

    const handleMouseUp = (command: MainPageCommandType) => () => {
        setFocusedButton(null);
        const clickDuration = Date.now() - mouseDownTime;
        
        // Si le clic a duré plus de 200ms, c'est un maintien
        if (clickDuration > 200 && !isOpeningDialog) {
            setIsOpeningDialog(true);
            setSelectedCommand(command);
            
            setTimeout(() => {
                setIsOpen(true);
                setIsOpeningDialog(false);
            }, 10);
        }
    };

    const handleTouchStart = (commandId: string) => () => {
        setFocusedButton(commandId);
        setTouchStartTime(Date.now());
    };

    const handleTouchEnd = (command: MainPageCommandType) => () => {
        setFocusedButton(null);
        const touchDuration = Date.now() - touchStartTime;
        
        // Si le touch a duré plus de 200ms, c'est un maintien
        if (touchDuration > 200 && !isOpeningDialog) {
            setIsOpeningDialog(true);
            setSelectedCommand(command);
            
            setTimeout(() => {
                setIsOpen(true);
                setIsOpeningDialog(false);
            }, 10);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, command: MainPageCommandType) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFocusedButton(command._id);
            setTimeout(() => {
                setFocusedButton(null);
                setSelectedCommand(command);
                
                setIsOpen(true);
            }, 150);
        }
    };

    // Fonctions pour gérer l'état de pression des boutons
    const handleButtonPress = (buttonId: string) => {
        setPressedButtons(prev => ({ ...prev, [buttonId]: true }));
    };

    const handleButtonRelease = (buttonId: string) => {
        setPressedButtons(prev => ({ ...prev, [buttonId]: false }));
    };

    const isButtonPressed = (buttonId: string) => {
        return pressedButtons[buttonId] || false;
    };

    // Fonction pour gérer les changements de quantité
    const handleQuantityChange = (supplementId: string, change: number) => {
        setSupplementQuantities(prev => {
            const currentQuantity = prev[supplementId] || 0;
            const newQuantity = Math.max(0, Math.min(1, currentQuantity + change));
            
            if (newQuantity === 0) {
                const { [supplementId]: removed, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [supplementId]: newQuantity };
            }
        });
    };

    // Fonction pour calculer le prix total
    const calculateTotalPrice = () => {
        if (!selectedCommand) return 0;
        let total = parseFloat(selectedCommand.price || '0');
        
        if (selectedCommand.supplements) {
            selectedCommand.supplements.forEach(supplement => {
                const quantity = supplementQuantities[supplement.id] || 0;
                total += supplement.price * quantity;
            });
        }
        
        return total;
    };

    // Fonction pour gérer la commande
    const handleOrder = () => {
        if (!selectedCommand) return;
        
        // Créer un ID unique basé sur les suppléments sélectionnés
        const generateUniqueId = () => {
            const baseId = selectedCommand._id;
            const supplementsKey = JSON.stringify(supplementQuantities);
            return `${baseId}_${supplementsKey}`;
        };
        
        // Créer l'objet à ajouter au panier
        const cartItem: Omit<CartItem, 'quantity'> = {
            id: generateUniqueId(),
            title: selectedCommand.name,
            image: selectedCommand.image || '',
            price: parseFloat(selectedCommand.price || '0'),
            category: selectedCommand.category,
            supplements: selectedCommand.supplements?.map(supplement => ({
                id: supplement.id,
                name: supplement.name,
                price: supplement.price,
                quantity: supplementQuantities[supplement.id] || 0
            })).filter(supp => supp.quantity > 0)
        };

        // Ajouter au panier
        addToCart(cartItem);
        
        console.log('Commande ajoutée au panier:', cartItem);
        setIsOpen(false);
        setSupplementQuantities({});
        setSelectedCommand(null);
    };

    // Charger les données depuis MongoDB au montage du composant
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Récupérer les catégories, produits et options en parallèle
                const [categoriesRes, productsRes, supplementsRes, extrasRes, saucesRes, accompagnementsRes, boissonsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/products'),
                    fetch('/api/supplements'),
                    fetch('/api/extras'),
                    fetch('/api/sauces'),
                    fetch('/api/accompagnements'),
                    fetch('/api/boissons')
                ]);

                // Traiter les catégories
                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    if (categoriesData.success && Array.isArray(categoriesData.categories)) {
                        // Trier les catégories selon leur ordre dans la base de données
                        const sortedCategories = categoriesData.categories.sort((a: Category, b: Category) => {
                            // Si les deux ont un ordre valide, trier par ordre
                            if (a.order && b.order) {
                                return a.order - b.order;
                            }
                            // Si une seule a un ordre, la mettre en premier
                            if (a.order && !b.order) return -1;
                            if (!a.order && b.order) return 1;
                            // Si aucune n'a d'ordre, trier par createdAt
                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                            return dateA - dateB;
                        });
                        
                        setCategories(sortedCategories);
                        
                        // Sélectionner la première catégorie par défaut si aucune n'est sélectionnée
                        if (sortedCategories.length > 0 && !selectedCategory) {
                            const firstCategoryId = sortedCategories[0].id || sortedCategories[0]._id || sortedCategories[0].name;
                            setSelectedCategory(firstCategoryId);
                        }
                    }
                }

                // Traiter les produits

                // Traiter les produits
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    if (productsData.success && Array.isArray(productsData.products)) {
                        setProducts(productsData.products);
                    }
                }

                // Traiter les suppléments
                if (supplementsRes.ok) {
                    const supplementsData = await supplementsRes.json();
                    if (supplementsData.success && Array.isArray(supplementsData.supplements)) {
                        setDynamicOptions(prev => ({ ...prev, supplements: supplementsData.supplements }));
                    }
                }

                // Traiter les extras
                if (extrasRes.ok) {
                    const extrasData = await extrasRes.json();
                    if (extrasData.success && Array.isArray(extrasData.extras)) {
                        setDynamicOptions(prev => ({ ...prev, extras: extrasData.extras }));
                    }
                }

                // Traiter les sauces
                if (saucesRes.ok) {
                    const saucesData = await saucesRes.json();
                    if (saucesData.success && Array.isArray(saucesData.sauces)) {
                        setDynamicOptions(prev => ({ ...prev, sauces: saucesData.sauces }));
                    }
                }

                // Traiter les accompagnements
                if (accompagnementsRes.ok) {
                    const accompagnementsData = await accompagnementsRes.json();
                    if (accompagnementsData.success && Array.isArray(accompagnementsData.accompagnements)) {
                        setDynamicOptions(prev => ({ ...prev, accompagnements: accompagnementsData.accompagnements }));
                    }
                }

                // Traiter les boissons
                if (boissonsRes.ok) {
                    const boissonsData = await boissonsRes.json();
                    if (boissonsData.success && Array.isArray(boissonsData.boissons)) {
                        setDynamicOptions(prev => ({ ...prev, boissons: boissonsData.boissons }));
                    }
                }

            } catch (error) {
                console.error('Erreur lors du chargement des données MongoDB:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        fetchCategoryOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Fonction pour charger les options de catégories (comme dans /Commande)
    const fetchCategoryOptions = async () => {
        try {
            const response = await fetch('/api/categories/options');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.categoryOptionsMap) {
                    setCategoryOptionsMap(data.categoryOptionsMap);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des options de catégories:', error);
            // Les valeurs par défaut sont déjà définies dans l'état initial
        }
    };

    // Fonction pour récupérer les options d'une catégorie depuis les données dynamiques (comme dans /Commande)
    const getCategoryOptions = (categoryName: string) => {
        const optionsForCategory = categoryOptionsMap[categoryName.toLowerCase()] || [];
        
            return {
            supplements: optionsForCategory.includes('supplements') ? dynamicOptions.supplements : [],
            sauces: optionsForCategory.includes('sauces') ? dynamicOptions.sauces : [],
            extras: optionsForCategory.includes('extras') ? dynamicOptions.extras : [],
            accompagnements: optionsForCategory.includes('accompagnements') ? dynamicOptions.accompagnements : [],
            boissons: optionsForCategory.includes('boissons') ? dynamicOptions.boissons : []
        };
    };

    // Fonction pour récupérer les étapes disponibles basées sur allowedOptions (comme dans /check)
    const getAvailableStepsFromAllowedOptions = () => {
        if (!selectedCommand) {
            return [];
        }
        
        // Normaliser la catégorie du produit pour la comparaison
        const productCategoryNormalized = selectedCommand.category?.toLowerCase().trim();
        
        const selectedCat = categories.find(cat => {
            // Essayer plusieurs méthodes de correspondance
            const catNameNormalized = cat.name?.toLowerCase().trim();
            const catId = cat.id || cat._id;
            
            // Correspondance exacte par nom (normalisé)
            if (catNameNormalized === productCategoryNormalized) {
                return true;
            }
            
            // Correspondance par ID si la catégorie du produit est un ID
            if (catId === selectedCommand.category) {
                return true;
            }
            
            // Correspondance partielle par nom
            if (catNameNormalized && productCategoryNormalized) {
                const partialMatch = catNameNormalized.includes(productCategoryNormalized) || 
                                   productCategoryNormalized.includes(catNameNormalized);
                return partialMatch;
            }
            
            return false;
        });
        
        if (!selectedCat) {
            // Tentative de correspondance alternative avec plus de flexibilité
            const alternativeMatch = categories.find(cat => {
                const catName = cat.name?.toLowerCase().trim();
                const productCat = selectedCommand.category?.toLowerCase().trim();
                
                if (!catName || !productCat) return false;
                
                // Correspondance plus flexible
                return catName.includes(productCat) || 
                       productCat.includes(catName) ||
                       catName === productCat;
            });
            
            if (alternativeMatch?.allowedOptions) {
                return alternativeMatch.allowedOptions;
            }
            
            return [];
        }
        
        if (!selectedCat?.allowedOptions || !Array.isArray(selectedCat.allowedOptions)) {
            return [];
        }
        
        return selectedCat.allowedOptions;
    };
    
    // Fonction pour obtenir les données d'une étape spécifique (comme dans /check)
    const getStepData = (stepType: string) => {
        if (!selectedCommand || !selectedCommand.category) return null;
        
        const categoryName = selectedCommand.category;
        const categoryOptions = getCategoryOptions(categoryName);
        
        switch (stepType) {
            case 'supplements':
                return {
                    type: 'supplements' as const,
                    title: 'Choisissez vos crudités',
                    data: categoryOptions.supplements
                };
            case 'extras':
                return {
                    type: 'extras' as const,
                    title: 'Choisissez vos suppléments',
                    data: categoryOptions.extras
                };
            case 'sauces':
                return {
                    type: 'sauces' as const,
                    title: 'Choisissez vos sauces',
                    data: categoryOptions.sauces
                };
            case 'accompagnements':
                return {
                    type: 'accompagnements' as const,
                    title: 'Choisissez vos accompagnements',
                    data: categoryOptions.accompagnements
                };
            case 'boissons':
                return {
                    type: 'boissons' as const,
                    title: 'Choisissez vos boissons',
                    data: categoryOptions.boissons
                };
            default:
                return null;
        }
    };

    // === NOUVELLES FONCTIONS POUR LE FLUX DE COMMANDE COMPLET ===

    // 1. CALCUL DES PRIX EN TEMPS RÉEL
    const calculateModalTotal = () => {
        if (!selectedCommand) return 0;
        
        const basePrice = extractPrice(selectedCommand.price || '0');
        let total = basePrice;
        
        // Ajout du prix de toutes les options sélectionnées
        Object.values(selectedOptionsDetails)
            .filter((option): option is StepDataItem => option !== undefined)
            .forEach((option: StepDataItem) => {
                if (option && option.price) {
                    total += option.price;
                }
            });
        
        return total;
    };

    // Utilitaires de formatage des prix
    const formatPrice = (price: string | number): string => {
        if (typeof price === 'number') {
            return `${price.toFixed(2)}€`;
        }
        if (typeof price === 'string') {
            if (price.includes('€')) {
                return price;
            }
            const numPrice = parseFloat(price);
            return isNaN(numPrice) ? '0.00€' : `${numPrice.toFixed(2)}€`;
        }
        return '0.00€';
    };

    const extractPrice = (price: string | number): number => {
        if (typeof price === 'number') {
            return price;
        }
        if (typeof price === 'string') {
            const priceString = price.replace('€', '').trim();
            const numPrice = parseFloat(priceString);
            return isNaN(numPrice) ? 0 : numPrice;
        }
        return 0;
    };

    // 2. GESTION AVANCÉE DES OPTIONS
    const toggleOption = (optionId: string, optionData: StepDataItem) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionId]: !prev[optionId]
        }));
        
        setSelectedOptionsDetails(prev => {
            if (prev[optionId]) {
                const newState = { ...prev };
                delete newState[optionId];
                return newState;
            } else {
                return { ...prev, [optionId]: optionData };
            }
        });
    };

    const toggleUnique = (optionId: string, optionData: StepDataItem, type: 'accompagnements' | 'boissons' | 'sauces') => {
        const currentSelected = selectedUniqueOptions[type];
        
        if (currentSelected === optionId) {
            // Désélectionner
            setSelectedUniqueOptions(prev => ({
                ...prev,
                [type]: null
            }));
            setSelectedOptionsDetails(prev => {
                const newState = { ...prev };
                delete newState[optionId];
                return newState;
            });
        } else {
            // Sélectionner (remplace la sélection précédente)
            setSelectedUniqueOptions(prev => ({
                ...prev,
                [type]: optionId
            }));
            setSelectedOptionsDetails(prev => ({
                ...prev,
                [optionId]: optionData
            }));
        }
    };

    // 3. SYSTÈME DE PANIER AVANCÉ
    const addToCartFromModal = () => {
        if (selectedCommand) {
            // Création d'un ID unique pour cette commande
            const uniqueId = `${selectedCommand._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Récupération des options sélectionnées
            const selectedOptionsList = Object.values(selectedOptionsDetails)
                .filter((option): option is StepDataItem => option !== undefined)
                .map(option => ({
                    id: option.id,
                    name: option.name,
                    price: option.price || 0,
                    quantity: 1
                }));
            
            // Création de l'objet de commande
            const orderItem: Omit<CartItem, 'quantity'> = {
                id: uniqueId,
                title: selectedCommand.name,
                image: selectedCommand.image || '',
                price: parseFloat(selectedCommand.price || '0'),
                category: selectedCommand.category || '',
                supplements: selectedOptionsList
            };
            
            addToCart(orderItem);
            closeProductModal();
        }
    };

    // 4. GESTION DES ÉTAPES AVANCÉE
    const getCurrentStepData = () => {
        if (!selectedCommand) return null;
        
        // Utiliser la nouvelle fonction getStepData
        return getStepData(currentStep);
    };

    const getAvailableSteps = () => {
        return getAvailableStepsFromAllowedOptions();
    };

    const isFirstStep = () => {
        const availableSteps = getAvailableSteps();
        return availableSteps.length === 0 || currentStep === availableSteps[0];
    };
    
    const isLastStep = () => {
        const availableSteps = getAvailableSteps();
        return availableSteps.length === 0 || currentStep === availableSteps[availableSteps.length - 1];
    };

    const goToNextStep = () => {
        const availableSteps = getAvailableSteps();
        const currentIndex = availableSteps.indexOf(currentStep);
        if (currentIndex < availableSteps.length - 1) {
            setCurrentStep(availableSteps[currentIndex + 1]);
        }
    };

    const goToPreviousStep = () => {
        const availableSteps = getAvailableSteps();
        const currentIndex = availableSteps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(availableSteps[currentIndex - 1]);
        }
    };

    // 5. GESTION DES QUANTITÉS PAR ÉTAPE
    const handleStepQuantityChange = (itemId: string, change: number) => {
        setStepSelections(prev => {
            const currentSelections = prev[currentStep] || {};
            const currentQuantity = currentSelections[itemId] || 0;
            const newQuantity = Math.max(0, Math.min(1, currentQuantity + change));
            
            const newSelections = { ...currentSelections };
            if (newQuantity === 0) {
                delete newSelections[itemId];
            } else {
                newSelections[itemId] = newQuantity;
            }
            
            return { ...prev, [currentStep]: newSelections };
        });
    };

    // 6. NAVIGATION DES ÉTAPES
    const handleStepNavigation = (direction: 'next' | 'previous') => {
        if (direction === 'next') {
            if (isLastStep()) {
                // Si c'est la dernière étape, terminer la commande
                handleFinishOrder();
            } else {
                goToNextStep();
            }
        } else {
            goToPreviousStep();
        }
    };

    // 7. FINALISATION DE LA COMMANDE
    const handleFinishOrder = () => {
        if (!selectedCommand) return;
        
        // Créer un ID unique basé sur les sélections des steps
        const generateUniqueId = () => {
            const baseId = selectedCommand._id;
            const stepSelectionsKey = JSON.stringify(stepSelections);
            return `${baseId}_${stepSelectionsKey}`;
        };
        
        // Créer l'objet à ajouter au panier avec toutes les sélections des étapes
        const cartItem: Omit<CartItem, 'quantity'> = {
            id: generateUniqueId(),
            title: selectedCommand.name,
            image: selectedCommand.image || '',
            price: parseFloat(selectedCommand.price || '0'),
            category: selectedCommand.category || '',
            supplements: selectedCommand.supplements?.map(supplement => ({
                id: supplement.id,
                name: supplement.name,
                price: supplement.price,
                quantity: supplementQuantities[supplement.id] || 0
            })).filter(supp => supp.quantity > 0),
            stepSelections: stepSelections
        };

        // Ajouter au panier
        addToCart(cartItem);
        
        console.log('Commande terminée et ajoutée au panier:', cartItem);
        
        // Fermer le dialog et réinitialiser
        setIsOpen(false);
        setSupplementQuantities({});
        setStepSelections({});
        setSelectedCommand(null);
        const availableSteps = getAvailableSteps();
        if (availableSteps.length > 0) {
            setCurrentStep(availableSteps[0]);
        }
    };

    // 8. FONCTIONS UTILITAIRES
    const closeProductModal = () => {
        setIsOpen(false);
        setSelectedCommand(null);
        setSelectedOptions({});
        setSelectedOptionsDetails({});
        setSelectedUniqueOptions({
            accompagnements: null,
            boissons: null,
            sauces: null
        });
    };

    // Filtrer les produits par catégorie sélectionnée
    const filteredCommands = products.filter(product => {
        if (!selectedCategory || !product.category) return false;
        
        // Trouver la catégorie sélectionnée
        const selectedCat = categories.find(cat => 
            cat.id === selectedCategory || 
            cat._id === selectedCategory || 
            cat.name === selectedCategory
        );
        
        if (!selectedCat) return false;
        
        // Normaliser les catégories pour la comparaison
        const productCategory = product.category.toLowerCase().trim();
        const selectedCategoryName = selectedCat.name.toLowerCase().trim();
        
        // Vérifier si le produit appartient à la catégorie sélectionnée
        const matches = productCategory === selectedCategoryName ||
                       productCategory.includes(selectedCategoryName) ||
                       selectedCategoryName.includes(productCategory);
        
        return matches;
    });

    // Réinitialiser les étapes quand le dialog s'ouvre
    useEffect(() => {
        if (isOpen && selectedCommand) {
            const availableSteps = getAvailableSteps();
            
            if (availableSteps.length > 0) {
                setCurrentStep(availableSteps[0]);
            }
            setStepSelections({});
            // Réinitialiser aussi les sélections d'options
            setSelectedOptions({});
            setSelectedOptionsDetails({});
            setSelectedUniqueOptions({
                accompagnements: null,
                boissons: null,
                sauces: null
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, selectedCommand]);

    return (
        <div className="h-screen overflow-hidden">
            {/* Header intégré */}
            <motion.header 
                className="relative bg-white shadow-md overflow-hidden"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Vidéo en arrière-plan */}
                <motion.div 
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/burger.mp4" type="video/mp4" />
                    </video>
                </motion.div>
                
                {/* Contenu du header */}
                <motion.div 
                    className="relative z-0 container mx-auto px-4 flex items-center justify-between h-[17rem]"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                </motion.div>
            </motion.header>
            
            <div className="flex h-screen">
                {/* Sidebar des catégories */}
            <motion.div 
                className="w-80 bg-gray-100 overflow-y-auto z-0 h-full"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <LayoutGroup>
                    {categories.map((cat, index) => (
                        <motion.button
                            key={cat.id || cat._id || `category-${index}`}
                            onClick={() => setSelectedCategory(cat.id || cat._id || cat.name || 'default')}
                            className={`w-full flex flex-col items-center transition-all duration-300 ${
                                selectedCategory === (cat.id || cat._id || cat.name) 
                                    ? 'bg-white text-gray-700 opacity-100' 
                                    : 'bg-gray-200 text-gray-700 opacity-40'
                            }`}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeOut",
                                delay: index * 0.1 
                            }}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div 
                                className={`${(cat.id || cat._id) === 'cat3' ? 'w-43 h-48' : 'w-48 h-48'} rounded-lg flex items-center justify-center overflow-hidden`}
                                layoutId={`category-${cat.id || cat._id || index}`}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                {cat.image ? (
                                    <motion.img 
                                        src={cat.image} 
                                        alt={cat.name}
                                        className="w-full h-full object-contain"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                ) : (
                                    <span className="text-lg font-medium">{cat.name.charAt(0)}</span>
                                )}
                            </motion.div>
                            <motion.div 
                                className="text-center"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                    duration: 0.3, 
                                    delay: index * 0.1 + 0.2 
                                }}
                            >
                                <h3 className="font-medium text-md">{cat.name}</h3>
                            </motion.div>
                        </motion.button>
                    ))}
                </LayoutGroup>
            </motion.div>

            {/* Zone principale avec les commandes */}
            <motion.div 
                className="flex-1 p-6 overflow-y-auto bg-white rounded-l-3xl shadow-10xl border-l-2 border-t-2 border-gray-300 z-30 -ml-8 relative -mt-5 h-full"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
            <motion.div 
                key={`header-${selectedCategory}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center mb-6"
            >
                <motion.div 
                    className={`${selectedCategory === 'cat3' ? 'h-56' : 'h-56'} w-70 rounded-lg flex items-center justify-center overflow-hidden mr-6 ml-10 mt-2`}
                    layoutId={`header-image-${selectedCategory}`}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {categories.find((cat) => cat.id === selectedCategory)?.image ? (
                        <motion.img
                            src={categories.find((cat) => cat.id === selectedCategory)?.image}
                            alt={
                                categories.find((cat) => cat.id === selectedCategory)?.name || 'Catégorie'
                            }
                            className={`${
                                selectedCategory === 'cat3' ? 'max-h-50' : 'max-h-56'
                            } max-w-full object-contain`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        />
                    ) : (
                        <span className="text-lg font-bold text-gray-600">
                            {categories.find((cat) => cat.id === selectedCategory)?.name?.charAt(0) || 'C'}
                        </span>
                    )}
                </motion.div>
                <motion.h1 
                    className="text-gray-500 font-bold uppercase tracking-wide text-5xl mt-14"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    {categories.find(cat => cat.id === selectedCategory)?.name || 'Catégorie'}
                </motion.h1>
            </motion.div>
                
                {/* Debug info */}
                <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800">
                        Debug: {categories.length} catégories, {products.length} produits, {filteredCommands.length} produits filtrés
                    </p>
                    <p className="text-sm text-blue-800">
                        Catégorie sélectionnée: {selectedCategory}
                    </p>
                </div>
                
                <AnimatePresence mode="wait">
                    {filteredCommands.length > 0 ? (
                        <motion.div 
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9, rotateX: 15 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: [0.4, 0.0, 0.2, 1],
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredCommands.map((command, index) => (
                                <motion.button 
                                    key={command._id}
                                    className="w-full cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                                    onMouseDown={handleMouseDown(command._id)}
                                    onMouseUp={handleMouseUp(command)}
                                    onMouseLeave={() => setFocusedButton(null)}
                                    onTouchStart={handleTouchStart(command._id)}
                                    onTouchEnd={handleTouchEnd(command)}
                                    onKeyDown={(e) => handleKeyDown(e, command)}
                                    onClick={(e) => {
                                        e.stopPropagation();
            console.log('Click event triggered for:', command.name);
                                        const clickDuration = Date.now() - mouseDownTime;
                                        const touchDuration = Date.now() - touchStartTime;
                                        
                                        // Si le clic/touch a duré moins de 200ms, c'est un clic/touch simple
                                        if ((clickDuration < 200 || touchDuration < 200) && !isOpeningDialog) {
                                            setIsOpeningDialog(true);
                                            setSelectedCommand(command);
                                            setTimeout(() => {
                                                setIsOpen(true);
                                                setIsOpeningDialog(false);
                                            }, 10);
                                        }
                                    }}
                                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        ease: "easeOut",
                                        delay: index * 0.1 
                                    }}
                                    whileHover={{ 
                                        scale: 1.03,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Card className={`w-full h-80 text-center focus:shadow-lg transition-all duration-300 focus:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-0 !border-0 shadow-none !shadow-none py-0 ${focusedButton === command._id ? 'scale-110' : 'scale-100'}`}>
                                        <motion.div 
                                            className={`${command.category === 'cat3' ? 'h-50' : 'h-56'} flex items-center justify-center px-4`}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {command.image ? (
                                                <motion.img 
                                                    src={command.image} 
                                                    alt={command.name}
                                                    className={`${command.category === 'cat3' ? 'max-h-44' : 'max-h-48'} max-w-full object-contain`}
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                                                    <span className="text-gray-400 text-sm">Aucune image</span>
                                                </div>
                                            )}
                                        </motion.div>
                                        
                                        <motion.div 
                                            className="p-3"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                                        >
                                                                                <CardTitle className="text-2xl font-semibold mb-1">{command.name}</CardTitle>
                                            {command.price ? (
                                        <p className="text-xl font-bold text-green-600">{parseFloat(command.price).toFixed(2)}€</p>
                                            ) : (
                                                <p className="text-gray-400 text-sm">Prix non disponible</p>
                                            )}
                                        </motion.div>
                                    </Card>
                                </motion.button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={`empty-${selectedCategory}`}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center py-12"
                        >
                            <p className="text-lg text-gray-600">Aucun produit disponible dans cette catégorie.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Dialog pour les détails de la commande */}
            {selectedCommand && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        {(() => {
                            const selectedCategory = categories.find(cat => cat.id === selectedCommand?.category || cat._id === selectedCommand?.category);
                            const hasStepsOrAccompaniments = selectedCategory?.steps || selectedCategory?.accompaniments;
                            
                            // Vérifier si le produit a des étapes via allowedOptions de sa catégorie
                            const availableSteps = getAvailableSteps();
                            const hasAllowedOptions = availableSteps && availableSteps.length > 0;
                            
                            // Cas particulier : commande sans steps ni allowedOptions
                            if (!hasStepsOrAccompaniments && !hasAllowedOptions) {
                                return (
                                    <>
                                        {/* Header fixe pour les commandes simples */}
                                        <DialogHeader>
                                            <div className="flex justify-between items-start mb-6">
                                                                                            <DialogTitle className="text-4xl font-bold">{selectedCommand.name}</DialogTitle>
                                                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-tl-lg">
                                                    <p className="text-5xl font-bold text-gray-500">
                                                    {parseFloat(selectedCommand.price || '0').toFixed(2)}€
                                                    </p>
                                                </div>
                                            </div>
                                        </DialogHeader>
                                        
                                        {/* Image centrée pour les commandes simples */}
                                        <div className="flex-1 flex items-center justify-center px-6 pb-32">
                                            <div className="text-center">
                                                {selectedCommand.image ? (
                                                    <img 
                                                        src={selectedCommand.image} 
                                                        alt={selectedCommand.name}
                                                        className="max-h-96 max-w-full object-contain rounded-lg mx-auto"
                                                    />
                                                ) : (
                                                    <div className="w-96 h-96 rounded-lg flex items-center justify-center bg-gray-200">
                                                        <span className="text-gray-500 text-lg">Aucune image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Bouton Terminer uniquement pour les commandes simples */}
                                        <div className="absolute bottom-5 left-0 right-0 bg-white pt-6 pb-6 px-6">
                                            <div className="flex justify-center">
                                                <Button 
                                                    onClick={() => {
                                                        if (selectedCommand) {
                                                            // Créer un ID unique pour les commandes simples
                                                            const generateUniqueId = () => {
                                                                const baseId = selectedCommand._id;
                                                                return `${baseId}_simple`;
                                                            };
                                                            
                                                            const cartItem: Omit<CartItem, 'quantity'> = {
                                                                id: generateUniqueId(),
                                                                title: selectedCommand.name,
                                                                image: selectedCommand.image || '',
                                                                price: parseFloat(selectedCommand.price || '0'),
                                                                category: selectedCommand.category, // Ajout de la propriété category
                                                                supplements: []
                                                            };
                                                            addToCart(cartItem);
                                                            setIsOpen(false);
                                                            setSelectedCommand(null);
                                                        }
                                                    }}
                                                    onMouseDown={() => handleButtonPress('terminer')}
                                                    onMouseUp={() => handleButtonRelease('terminer')}
                                                    onMouseLeave={() => handleButtonRelease('terminer')}
                                                    onTouchStart={() => handleButtonPress('terminer')}
                                                    onTouchEnd={() => handleButtonRelease('terminer')}
                                                    className={`bg-gray-500 text-white w-65 h-20 !text-3xl font-semibold !rounded-full transition-transform duration-300 hover:scale-110 ${isButtonPressed('terminer') ? 'scale-110' : 'scale-100'}`}
                                                >
                                                    Terminer
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                );
                            }
                            
                            // Cas normal : commande avec steps, accompaniments OU allowedOptions
                            return (
                                <>
                                    {/* Header fixe */}
                                    <DialogHeader>
                                        <DialogTitle className="text-4xl font-bold mb-6">{selectedCommand.name}</DialogTitle>
                                        
                                        {/* Indicateur d'étapes fixe avec la nouvelle logique */}
                                        {(() => {
                                            const availableSteps = getAvailableSteps();
                                            return availableSteps.length > 0;
                                        })() && (
                                            <div className="flex items-center justify-start space-x-8 mt-15 mb-6">
                                                {/* Image principale */}
                                                <div className="relative">
                                                    <img 
                                                        src={selectedCommand.image} 
                                                        alt={selectedCommand.name}
                                                        className="max-h-46 max-w-full object-contain rounded-lg"
                                                    />
                                                </div>
                                                
                                                {/* Barre de séparation */}
                                                <div className="w-1 h-32 bg-gray-300"></div>
                                                
                                                {/* Étapes dynamiques basées sur allowedOptions avec la nouvelle logique */}
                                                {getAvailableSteps().map((stepType, index) => {
                                                    // Utiliser la nouvelle fonction getStepData
                                                    const stepData = getStepData(stepType);
                                                    const stepImage = stepData?.data && stepData.data.length > 0 ? stepData.data[0]?.image : '';
                                                    const stepTitle = stepData?.title || stepType;
                                                    
                                                    return (
                                                        <motion.div 
                                                            key={`${stepType}-${index}`} 
                                                            className="flex items-center cursor-pointer"
                                                            onClick={() => setCurrentStep(stepType)}
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {/* Image d'étape */}
                                                            <div className="relative">
                                                                <img 
                                                                    src={stepImage || '/Frites.png'} 
                                                                    alt={stepTitle}
                                                                    className={`w-32 h-32 object-contain rounded-lg transition-opacity ${
                                                                        currentStep === stepType ? 'opacity-100' : 'opacity-30'
                                                                    }`}
                                                                />
                                                            </div>
                                                            
                                                            {/* Chevron entre les étapes */}
                                                            {index < getAvailableSteps().length - 1 && (
                                                                <div className="ml-8 flex items-center">
                                                                    <svg className={`w-8 h-8 transition-opacity ${
                                                                        currentStep === stepType ? 'text-gray-400 opacity-100' : 'text-gray-300 opacity-60'
                                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                                
                                                {/* Prix total dynamique */}
                                                <div className="absolute top-0 right-0 bg-white bg-opacity-90 px-4 py-2 rounded-tl-lg">
                                                    <p className="text-5xl font-bold text-gray-500 mt-12 mr-10">
                                                        {(() => {
                                                            let total = parseFloat(selectedCommand.price || '0');
                                                            
                                                            // Ajouter les prix des sélections de toutes les étapes
                                                            Object.keys(stepSelections).forEach(stepKey => {
                                                                // Utiliser la nouvelle fonction getCurrentStepData
                                                                const stepData = getCurrentStepData();
                                                                if (stepData && stepData.data) {
                                                                        stepData.data.forEach((item: StepDataItem) => {
                                                                        const quantity = stepSelections[stepKey]?.[item.id] || 0;
                                                                            if (item.price !== undefined && quantity > 0) {
                                                                            total += (item.price || 0) * quantity;
                                                                            }
                                                                        });
                                                                }
                                                            });
                                                            
                                                            return total.toFixed(2);
                                                        })()}€
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </DialogHeader>
                                    
                                    {/* Contenu scrollable */}
                                    <div className="flex-1 overflow-y-auto px-6 pb-32">
                                        {/* Contenu de l'étape actuelle */}
                                        <AnimatePresence mode="wait">
                                            {getCurrentStepData() && (
                                                <motion.div 
                                                    key={currentStep}
                                                    className="space-y-8"
                                                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                                    transition={{ 
                                                        duration: 0.5, 
                                                        ease: [0.4, 0.0, 0.2, 1],
                                                        type: "spring",
                                                        stiffness: 120,
                                                        damping: 20
                                                    }}
                                                >
                                                    <motion.h3 
                                                        className="text-2xl font-bold text-gray-800 border-b pb-4"
                                                        initial={{ y: -20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ duration: 0.4, delay: 0.1 }}
                                                    >
                                                        {getCurrentStepData()?.title}
                                                    </motion.h3>
                                                
                                                                                                {/* Affichage spécial pour sauces, accompagnements, boissons */}
                                                {(currentStep === "sauces" || currentStep === "accompagnements" || currentStep === "boissons") ? (
                                                    <>
                                                        {/* Zone scrollable pour les sauces disponibles */}
                                                        <motion.div 
                                                            className="flex-1 overflow-y-auto pb-4"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                                        >
                                                            <div className="grid grid-cols-3 gap-16">
                                                                {getCurrentStepData()?.data?.map((item: StepDataItem, index: number) => {
                                                                    // Logique différente pour accompagnements et boissons
                                                                    const isAccompagnementsOrBoissons = currentStep === "accompagnements" || currentStep === "boissons";
                                                                    const isSelected = (stepSelections[currentStep]?.[item.id] || 0) > 0;
                                                                    const hasAnySelection = Object.values(stepSelections[currentStep] || {}).some(qty => qty > 0);
                                                                    
                                                                    // Pour accompagnements et boissons : tous en opacity 100 au départ, puis logique de sélection
                                                                    // Pour sauces : comportement normal
                                                                    const getOpacity = () => {
                                                                        if (currentStep === "sauces") {
                                                                            return isSelected ? 'opacity-100' : 'opacity-40';
                                                                        } else {
                                                                            // accompagnements et boissons
                                                                            if (!hasAnySelection) {
                                                                                return 'opacity-100'; // Tous visibles au départ
                                                                            } else {
                                                                                return isSelected ? 'opacity-100' : 'opacity-40';
                                                                            }
                                                                        }
                                                                    };
                                                                    
                                                                    return (
                                                                        <motion.div 
                                                                            key={`${currentStep}-${item.id}-${index}`} 
                                                                            className="text-center"
                                                                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                            transition={{ 
                                                                                duration: 0.4, 
                                                                                ease: "easeOut",
                                                                                delay: index * 0.1 
                                                                            }}
                                                                            whileHover={{ 
                                                                                scale: 1.05,
                                                                                transition: { duration: 0.2 }
                                                                            }}
                                                                        >
                                                                            <div className="relative group cursor-pointer m-3" onClick={() => handleStepQuantityChange(item.id, 1)}>
                                                                                {/* Bouton "+" en haut à droite */}
                                                                                <motion.button 
                                                                                    className={`absolute top-0 right-12 w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center z-50 shadow-lg border-2 border-white transition-all ${getOpacity()}`}
                                                                                    whileHover={{ scale: 1.1 }}
                                                                                    whileTap={{ scale: 0.9 }}
                                                                                >
                                                                                    <span className="text-white text-xl font-bold">+</span>
                                                                                </motion.button>
                                                                                
                                                                                {/* Image de la sauce */}
                                                                                <motion.div 
                                                                                    className="relative"
                                                                                    whileHover={{ scale: 1.02 }}
                                                                                >
                                                                                    {item.image ? (
                                                                                        <motion.img 
                                                                                            src={item.image} 
                                                                                            alt={item.name}
                                                                                            className={`w-56 h-56 object-contain rounded-lg transition-all mx-auto ${getOpacity()}`}
                                                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                                                            animate={{ scale: 1, opacity: 1 }}
                                                                                            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-56 h-56 rounded-lg flex items-center justify-center bg-gray-200 mx-auto">
                                                                                            <span className="text-gray-500">No img</span>
                                                                                        </div>
                                                                                    )}
                                                                                </motion.div>
                                                                                
                                                                                {/* Titre de la sauce */}
                                                                                <motion.h5 
                                                                                    className={`text-2xl font-medium mt-3 transition-all ${
                                                                                        getOpacity() === 'opacity-100' ? 'text-gray-900' : 'text-gray-600'
                                                                                    }`}
                                                                                    initial={{ y: 20, opacity: 0 }}
                                                                                    animate={{ y: 0, opacity: 1 }}
                                                                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                                                                                >
                                                                                    {item.name}
                                                                                </motion.h5>
                                                                            </div>
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    </>
                                                ) : (
                                                    /* Affichage normal pour supplements et extra */
                                                    <motion.div 
                                                        className="space-y-0"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                                    >
                                                        {getCurrentStepData()?.data?.map((item: StepDataItem, index: number) => (
                                                            <motion.div 
                                                                key={`${currentStep}-${item.id}-${index}`} 
                                                                className={`flex items-center space-x-8 p-8 transition-all ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                                                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                                transition={{ 
                                                                    duration: 0.4, 
                                                                    ease: "easeOut",
                                                                    delay: index * 0.1 
                                                                }}
                                                                whileHover={{ 
                                                                    scale: 1.01,
                                                                    transition: { duration: 0.2 }
                                                                }}
                                                            >
                                                                <motion.div 
                                                                    className="flex-shrink-0"
                                                                    whileHover={{ scale: 1.05 }}
                                                                >
                                                                    {item.image ? (
                                                                        <motion.img 
                                                                            src={item.image} 
                                                                            alt={item.name}
                                                                            className={`w-28 h-28 object-contain rounded-lg transition-all ${
                                                                                (stepSelections[currentStep]?.[item.id] || 0) > 0 ? 'opacity-100' : 'opacity-40'
                                                                            }`}
                                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                                            animate={{ scale: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-28 h-28 rounded-lg flex items-center justify-center transition-all bg-gray-200">
                                                                            <span className={`text-sm transition-all ${
                                                                                (stepSelections[currentStep]?.[item.id] || 0) > 0 ? 'text-gray-700' : 'text-gray-500'
                                                                            }`}>No img</span>
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                                
                                                                <motion.div 
                                                                    className="flex-1 min-w-0"
                                                                    initial={{ x: 30, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                                                                >
                                                                    <h5 className={`text-2xl font-medium truncate transition-all ${
                                                                        (stepSelections[currentStep]?.[item.id] || 0) > 0 ? 'text-gray-900' : 'text-gray-500'
                                                                    }`}>{item.name}</h5>
                                                                    {/* Ne pas afficher les prix pour les suppléments gratuits */}
                                                                    {item.price !== undefined && currentStep !== "supplements" && (
                                                                        <p className={`text-lg font-medium transition-all ${
                                                                            (stepSelections[currentStep]?.[item.id] || 0) > 0 ? 'text-gray-700' : 'text-gray-500'
                                                                        }`}>
                                                                            {item.price.toFixed(2)}€
                                                                        </p>
                                                                    )}
                                                                </motion.div>
                                                                
                                                                <motion.div 
                                                                    className="flex items-center space-x-3"
                                                                    initial={{ x: 50, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                                                                >
                                                                    <motion.button
                                                                        onClick={() => handleStepQuantityChange(item.id, -1)}
                                                                        disabled={(stepSelections[currentStep]?.[item.id] || 0) <= 0}
                                                                        onMouseDown={() => handleButtonPress(`minus-${item.id}`)}
                                                                        onMouseUp={() => handleButtonRelease(`minus-${item.id}`)}
                                                                        onMouseLeave={() => handleButtonRelease(`minus-${item.id}`)}
                                                                        onTouchStart={() => handleButtonPress(`minus-${item.id}`)}
                                                                        onTouchEnd={() => handleButtonRelease(`minus-${item.id}`)}
                                                                        className={`w-16 h-16 rounded-full border-2 transition-all duration-300 font-bold text-2xl ${
                                                                            (stepSelections[currentStep]?.[item.id] || 0) > 0 
                                                                                ? 'bg-gray-700 text-white border-gray-700' 
                                                                                : 'bg-gray-200 text-gray-400 border-gray-300 opacity-40'
                                                                        } ${isButtonPressed(`minus-${item.id}`) ? 'scale-110' : 'scale-100'}`}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        -
                                                                    </motion.button>
                                                                    <motion.span 
                                                                        className="w-16 text-center font-medium text-2xl"
                                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        transition={{ duration: 0.2, delay: index * 0.1 + 0.5 }}
                                                                    >
                                                                        {stepSelections[currentStep]?.[item.id] || 0}
                                                                    </motion.span>
                                                                    <motion.button
                                                                        onClick={() => handleStepQuantityChange(item.id, 1)}
                                                                        onMouseDown={() => handleButtonPress(`plus-${item.id}`)}
                                                                        onMouseUp={() => handleButtonRelease(`plus-${item.id}`)}
                                                                        onMouseLeave={() => handleButtonRelease(`plus-${item.id}`)}
                                                                        onTouchStart={() => handleButtonPress(`plus-${item.id}`)}
                                                                        onTouchEnd={() => handleButtonRelease(`plus-${item.id}`)}
                                                                        className={`w-16 h-16 rounded-full border-2 transition-all duration-300 font-bold text-2xl ${
                                                                            (stepSelections[currentStep]?.[item.id] || 0) < 1 
                                                                                ? 'bg-gray-700 text-white border-gray-700' 
                                                                                : 'bg-gray-200 text-gray-400 border-gray-300 opacity-40'
                                                                        } ${isButtonPressed(`plus-${item.id}`) ? 'scale-110' : 'scale-100'}`}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        +
                                                                    </motion.button>
                                                                </motion.div>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                {/* Boutons de navigation - toujours en bas */}
                                <motion.div 
                                    className="absolute bottom-5 left-0 right-0 bg-white pt-6 pb-6 px-6"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <div className="flex justify-between">
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                        >
                                            <Button 
                                                onClick={() => handleStepNavigation('previous')}
                                                disabled={isFirstStep()}
                                                onMouseDown={() => handleButtonPress('precedent')}
                                                onMouseUp={() => handleButtonRelease('precedent')}
                                                onMouseLeave={() => handleButtonRelease('precedent')}
                                                onTouchStart={() => handleButtonPress('precedent')}
                                                onTouchEnd={() => handleButtonRelease('precedent')}
                                                className={`w-65 h-20 !text-3xl font-semibold !rounded-full transition-transform duration-300 hover:scale-110 ${
                                                    isFirstStep() 
                                                        ? 'bg-white text-gray-500 border-gray-300' 
                                                        : 'bg-gray-500 text-white'
                                                } ${isButtonPressed('precedent') ? 'scale-110' : 'scale-100'}`}
                                            >
                                                Précédent
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.2 }}
                                        >
                                            <Button 
                                                onClick={() => handleStepNavigation('next')}
                                                onMouseDown={() => handleButtonPress('suivant')}
                                                onMouseUp={() => handleButtonRelease('suivant')}
                                                onMouseLeave={() => handleButtonRelease('suivant')}
                                                onTouchStart={() => handleButtonPress('suivant')}
                                                onTouchEnd={() => handleButtonRelease('suivant')}
                                                className={`bg-gray-500 text-white w-65 h-20 !text-3xl font-semibold !rounded-full transition-transform duration-300 hover:scale-110 ${isButtonPressed('suivant') ? 'scale-110' : 'scale-100'}`}
                                            >
                                                {isLastStep() ? 'Terminer' : 'Suivant'}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </>
                        );
                    })()}
                    
                </DialogContent>
                
                {/* Bouton retour qui dépasse sur le blur - EN DEHORS du DialogContent */}
                <motion.div 
                    className="absolute bottom-0 left-1/2 pl-5 transform -translate-x-1/2 translate-y-1/2 z-[10001]"
                    initial={{ y: 100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button 
                            onClick={() => setIsOpen(false)}
                            onMouseDown={() => handleButtonPress('retour')}
                            onMouseUp={() => handleButtonRelease('retour')}
                            onMouseLeave={() => handleButtonRelease('retour')}
                            onTouchStart={() => handleButtonPress('retour')}
                            onTouchEnd={() => handleButtonRelease('retour')}
                            className={`bg-white text-gray-600 w-72 h-20 border-2 border-gray-600 !text-3xl font-semibold !rounded-full transition-transform duration-300 hover:scale-110 ${isButtonPressed('retour') ? 'scale-110' : 'scale-100'}`}
                        >
                            Retour
                        </Button>
                    </motion.div>
                </motion.div>
            </Dialog>
        )}
            </div>
    </div>
    );
}