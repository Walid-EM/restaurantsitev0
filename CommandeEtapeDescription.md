# 📋 CommandeEtapeDescription.md

## 🎯 **Vue d'ensemble de la page Commande**

La page `Commande/page.tsx` est une interface complète de commande de restaurant qui permet aux utilisateurs de :
- Parcourir les catégories et produits
- Personnaliser leurs commandes avec des options
- Gérer un panier d'achat
- Procéder au paiement

---

## 🏗️ **Architecture et Structure des Données**

### **Types et Interfaces Principales**

```typescript
// Produit dynamique récupéré depuis l'API
interface DynamicProduct {
  _id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image: string;
  isAvailable: boolean;
}

// Catégorie avec étapes de configuration
interface DynamicCategory {
  _id: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
  order?: number;
  steps?: {
    supplements?: { type: "supplements"; data: OptionSupplement[]; title: string; };
    sauces?: { type: "sauces"; data: OptionSauce[]; title: string; };
    extra?: { type: "extra"; data: OptionExtra[]; title: string; };
    accompagnements?: { type: "accompagnements"; data: Accompagnements[]; title: string; };
    boissons?: { type: "boissons"; data: Boissons[]; title: string; };
  };
}
```

### **États Principaux du Composant**

```typescript
// États de navigation et UI
const [activeCategory, setActiveCategory] = useState("");
const [isHeaderVisible, setIsHeaderVisible] = useState(true);
const [isScrolled, setIsScrolled] = useState(false);

// États du modal produit
const [selectedProduct, setSelectedProduct] = useState<DynamicProduct | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// États du panier et commande
const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

// États des options sélectionnées
const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
const [selectedOptionsDetails, setSelectedOptionsDetails] = useState<{ [key: string]: (OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce) | undefined }>({});

// États pour la sélection unique (accompagnements, boissons, sauces)
const [selectedUniqueOptions, setSelectedUniqueOptions] = useState<{
  accompagnements: string | null;
  boissons: string | null;
  sauces: string | null;
}>({
  accompagnements: null,
  boissons: null,
  sauces: null
});

// États des données dynamiques
const [dynamicProducts, setDynamicProducts] = useState<DynamicProduct[]>([]);
const [dynamicCategories, setDynamicCategory[]>([]);
const [dynamicOptions, setDynamicOptions] = useState<{
  supplements: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
  sauces: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
  extras: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
  accompagnements: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
  boissons: Array<{ id: string; _id: string; name: string; price: number; image?: string }>;
}>({...});
```

---

## 🔄 **Gestion des Données Dynamiques**

### **1. Chargement Initial des Données**

```typescript
const fetchDynamicData = async () => {
  try {
    setIsLoading(true);
    
    // Récupération parallèle de toutes les données
    const [productsRes, categoriesRes, extrasRes, saucesRes, supplementsRes, accompagnementsRes, boissonsRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories'),
      fetch('/api/extras'),
      fetch('/api/sauces'),
      fetch('/api/supplements'),
      fetch('/api/accompagnements'),
      fetch('/api/boissons')
    ]);

    // Traitement des réponses...
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    setIsLoading(false);
  }
};
```

**Avantages de cette approche :**
- **Chargement parallèle** : Toutes les API sont appelées simultanément
- **Performance optimisée** : Réduction du temps de chargement total
- **Gestion d'erreur centralisée** : Un seul try-catch pour toutes les données

### **2. Tri et Organisation des Catégories**

```typescript
// Tri des catégories selon leur ordre dans la base de données
const sortedCategories = categoriesData.categories.sort((a: DynamicCategory, b: DynamicCategory) => {
  // Priorité 1 : Ordre défini dans la DB
  if (a.order && b.order) {
    return a.order - b.order;
  }
  // Priorité 2 : Catégories avec ordre en premier
  if (a.order && !b.order) return -1;
  if (!a.order && b.order) return 1;
  // Priorité 3 : Tri par date de création
  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return dateA - dateB;
});
```

---

## 🎛️ **Système de Gestion des Options**

### **1. Logique de Sélection des Options**

#### **Options Multiples (Suppléments, Extras)**
```typescript
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
```

**Fonctionnement :**
- **Toggle simple** : Ajout/suppression d'une option
- **Stockage des détails** : Conservation des informations complètes de l'option
- **État réactif** : Mise à jour immédiate de l'interface

#### **Options Uniques (Sauces, Accompagnements, Boissons)**
```typescript
const toggleUnique = (optionId: string, optionData: Accompagnements | Boissons | OptionSauce, type: 'accompagnements' | 'boissons' | 'sauces') => {
  const currentSelected = selectedUniqueOptions[type];
  
  if (currentSelected === optionId) {
    // Désélectionner
    setSelectedUniqueOptions(prev => ({ ...prev, [type]: null }));
    setSelectedOptions(prev => ({ ...prev, [optionId]: false }));
    setSelectedOptionsDetails(prev => ({ ...prev, [optionId]: undefined }));
  } else {
    // Sélectionner (remplace la sélection précédente)
    // Nettoyer l'ancienne option
    if (currentSelected) {
      setSelectedOptionsDetails(prev => {
        const newState = { ...prev };
        delete newState[currentSelected];
        return newState;
      });
      setSelectedOptions(prev => ({ ...prev, [currentSelected]: false }));
    }
    
    // Ajouter la nouvelle option
    setSelectedOptionsDetails(prev => ({ ...prev, [optionId]: optionData }));
    setSelectedOptions(prev => ({ ...prev, [optionId]: true }));
    setSelectedUniqueOptions(prev => ({ ...prev, [type]: optionId }));
  }
};
```

**Fonctionnement :**
- **Sélection exclusive** : Une seule option par type peut être sélectionnée
- **Nettoyage automatique** : L'ancienne sélection est automatiquement supprimée
- **État cohérent** : Synchronisation entre tous les états

### **2. Récupération des Options par Catégorie**

```typescript
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
```

**Système de mapping :**
- **Configuration par catégorie** : Chaque catégorie a ses propres options autorisées
- **Filtrage dynamique** : Seules les options pertinentes sont affichées
- **Fallback intelligent** : Retour d'un tableau vide si aucune option n'est configurée

---

## 💰 **Système de Calcul des Prix**

### **1. Calcul du Prix Total du Modal**

```typescript
const calculateModalTotal = () => {
  if (!selectedProduct) return 0;
  
  const basePrice = extractPrice(selectedProduct.price);
  let total = basePrice;
  
  // Ajout du prix de toutes les options sélectionnées
  Object.values(selectedOptionsDetails).forEach((option: OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce | undefined) => {
    if (option && option.price) {
      total += option.price;
    }
  });
  
  return total;
};
```

**Logique de calcul :**
- **Prix de base** : Prix du produit principal
- **Options gratuites** : Suppléments sans coût supplémentaire
- **Options payantes** : Suppléments, accompagnements, boissons avec prix
- **Mise à jour en temps réel** : Recalcul automatique à chaque modification

### **2. Utilitaires de Formatage des Prix**

```typescript
// Formatage du prix pour l'affichage
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

// Extraction du prix numérique pour les calculs
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
```

**Gestion des formats :**
- **Support multiple** : String avec/sans "€" et nombres
- **Validation robuste** : Gestion des cas d'erreur
- **Formatage cohérent** : Affichage uniforme dans l'interface

---

## 🛒 **Système de Gestion du Panier**

### **1. Ajout au Panier depuis le Modal**

```typescript
const addToCartFromModal = () => {
  if (selectedProduct) {
    // Création d'un ID unique pour cette commande
    const uniqueId = `${selectedProduct._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Récupération des options sélectionnées
    const selectedOptionsList = Object.values(selectedOptionsDetails)
      .filter((option): option is OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce => option !== undefined);
    
    // Création de l'objet de commande
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
```

**Caractéristiques :**
- **ID unique** : Combinaison de l'ID produit, timestamp et chaîne aléatoire
- **Options complètes** : Conservation de toutes les sélections
- **Prix calculé** : Total incluant le produit et les options
- **Intégration panier** : Utilisation du contexte global du panier

### **2. Gestion des Quantités dans le Panier**

```typescript
const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
  if (currentQuantity === 1) {
    // Demander confirmation avant suppression
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  } else {
    // Diminuer la quantité
    updateQuantity(itemId, currentQuantity - 1);
  }
};

const confirmDelete = () => {
  if (itemToDelete) {
    updateQuantity(itemToDelete, 0); // Suppression en mettant la quantité à 0
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  }
};
```

**Logique de gestion :**
- **Confirmation de suppression** : Dialogue pour éviter les suppressions accidentelles
- **Gestion des quantités** : Utilisation des fonctions du contexte panier
- **Suppression propre** : Mise à zéro de la quantité plutôt que suppression directe

---

## 🎨 **Interface Utilisateur et Navigation**

### **1. Header Adaptatif avec Scroll Spy**

```typescript
// Gestion de la visibilité du header
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);
    
    // Gestion de la visibilité sur mobile
    if (currentScrollY <= 10) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Scroll Spy avec Intersection Observer
useEffect(() => {
  if (dynamicCategories.length === 0 || isLoading) return;

  const setupObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px', // Offset pour le header fixe
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      let maxVisibilityRatio = 0;

      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxVisibilityRatio) {
          maxVisibilityRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry) {
        const target = (mostVisibleEntry as any).target as HTMLElement;
        const sectionId = target.id;
        if (sectionId && sectionId !== activeCategory) {
          setActiveCategory(sectionId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observerRef.current = observer;

    // Observer toutes les sections
    dynamicCategories.forEach((category) => {
      const element = document.getElementById(category._id);
      if (element) {
        observer.observe(element);
      }
    });
  };

  // Attendre que le DOM soit rendu
  const timer = setTimeout(setupObserver, 300);
  
  return () => {
    clearTimeout(timer);
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };
}, [dynamicCategories, isLoading]);
```

**Fonctionnalités avancées :**
- **Header responsive** : Adaptation automatique selon le scroll
- **Scroll Spy intelligent** : Détection automatique de la section visible
- **Performance optimisée** : Utilisation d'Intersection Observer
- **Gestion mobile** : Comportement adapté selon l'appareil

### **2. Navigation par Catégories**

```typescript
const scrollToSection = (categoryId: string) => {
  if (typeof window !== 'undefined') {
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = isScrolled ? 80 : 100; // Hauteur variable du header
      const additionalOffset = 20; // Petit espace supplémentaire
      const elementPosition = element.offsetTop - headerHeight - additionalOffset;
      
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });
      
      // Mise à jour manuelle de l'état actif
      setActiveCategory(categoryId);
    }
  }
};

const handleCategoryClick = (categoryId: string) => {
  setActiveCategory(categoryId);
  scrollToSection(categoryId);
};
```

**Navigation fluide :**
- **Scroll automatique** : Déplacement fluide vers la section
- **Offset intelligent** : Prise en compte de la hauteur du header
- **État synchronisé** : Mise à jour immédiate de la catégorie active

---

## 🔄 **Flux de Commande Complet**

### **1. Sélection du Produit**
```
Utilisateur clique sur un produit
↓
Ouverture du modal avec openProductModal()
↓
Réinitialisation des états (options, sélections)
↓
Affichage des options disponibles selon la catégorie
```

### **2. Configuration des Options**
```
Affichage des sections d'options :
- Suppléments (gratuits)
- Sauces (sélection unique)
- Extras (payants)
- Accompagnements (sélection unique)
- Boissons (sélection unique)
↓
Sélection/désélection avec mise à jour des prix en temps réel
↓
Validation des sélections uniques
```

### **3. Ajout au Panier**
```
Clic sur "Ajouter à la commande"
↓
Création d'un ID unique
↓
Construction de l'objet CartItem avec toutes les options
↓
Ajout au panier via addToCart()
↓
Fermeture du modal
```

### **4. Gestion du Panier**
```
Affichage de tous les articles avec :
- Détails des options sélectionnées
- Contrôles de quantité
- Prix total par article
- Prix total de la commande
↓
Possibilité de modifier les quantités
↓
Confirmation de suppression si nécessaire
```

### **5. Finalisation de la Commande**
```
Clic sur "Confirmer la commande"
↓
Choix du mode de réception :
- Sur place
- À emporter
↓
Ouverture du modal de paiement
↓
Processus de paiement
```

---

## 🎯 **Points Clés de l'Architecture**

### **1. Gestion d'État Centralisée**
- **État local** : Gestion des modals et sélections
- **Contexte global** : Panier partagé entre composants
- **Synchronisation** : Mise à jour automatique des prix et totaux

### **2. Performance et Optimisation**
- **Chargement parallèle** : Appels API simultanés
- **Lazy loading** : Chargement des options à la demande
- **Memoization** : Calculs optimisés des prix

### **3. Expérience Utilisateur**
- **Feedback immédiat** : Mise à jour en temps réel des prix
- **Navigation intuitive** : Scroll spy et navigation fluide
- **Responsive design** : Adaptation mobile/desktop

### **4. Robustesse et Fiabilité**
- **Gestion d'erreur** : Try-catch sur toutes les opérations
- **Validation des données** : Vérification des types et formats
- **Fallbacks** : Valeurs par défaut en cas d'erreur

---

## 🔧 **Maintenance et Évolutivité**

### **1. Ajout de Nouvelles Options**
- **Configuration dans la DB** : Ajout dans `categoryOptionsMap`
- **Types TypeScript** : Extension des interfaces
- **Rendu automatique** : Affichage dynamique selon la configuration

### **2. Modification des Logiques de Prix**
- **Fonctions modulaires** : `calculateModalTotal()` facilement modifiable
- **Système de règles** : Possibilité d'ajouter des réductions ou promotions
- **Calculs complexes** : Support des formules de prix avancées

### **3. Intégration de Nouvelles Fonctionnalités**
- **Architecture modulaire** : Composants réutilisables
- **Hooks personnalisés** : Logique métier encapsulée
- **API extensible** : Endpoints facilement ajoutables

---

## 📱 **Responsive Design et Mobile-First**

### **1. Adaptation Mobile**
- **Header mobile** : Navigation adaptée aux petits écrans
- **Modal plein écran** : Optimisation de l'espace sur mobile
- **Contrôles tactiles** : Gestion des événements touch

### **2. Adaptation Desktop**
- **Navigation étendue** : Affichage de toutes les catégories
- **Modals centrés** : Utilisation optimale de l'espace
- **Interactions clavier** : Support des raccourcis clavier

---

## 🚀 **Conclusion**

La page `Commande/page.tsx` représente une implémentation complète et sophistiquée d'un système de commande de restaurant avec :

- **Gestion avancée des options** : Sélection multiple/unique avec validation
- **Calcul de prix en temps réel** : Mise à jour automatique des totaux
- **Système de panier robuste** : Gestion complète des articles et quantités
- **Interface utilisateur moderne** : Navigation fluide et responsive design
- **Architecture scalable** : Code modulaire et facilement extensible

Cette implémentation fournit une base solide pour un système de commande professionnel, avec une attention particulière portée à l'expérience utilisateur et à la robustesse du code.

