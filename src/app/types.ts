export interface Product {
  id?: number; // ID optionnel pour la compatibilité avec l'ancien système
  _id?: string; // ID MongoDB pour la compatibilité avec le nouveau système
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string; // Description optionnelle
  isAvailable?: boolean; // Disponibilité du produit
  
  // Nouvelles propriétés inspirées de Bicky
  ingredients?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
  
  // Métadonnées extensibles
  metadata?: Record<string, unknown>;
}

export interface CartItem extends Omit<Product, 'id' | '_id'> {
  id: string; // Identifiant unique pour le panier
  originalId?: number | string; // ID original du produit (peut être number ou string MongoDB)
  selectedOptions?: (OptionSupplement | OptionExtra | Accompagnements | Boissons)[];
  totalPrice?: number;
  quantity: number;
}

export interface OptionSupplement {
  id: string;
  name: string;
  price: number;
  image?: string;
}
export interface Accompagnements {
  id: string;
  name: string;
  price: number;
  image?: string;
}
export interface OptionExtra {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface OptionSauce {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Category {
  id?: string; // ID optionnel pour la compatibilité avec l'ancien système
  _id?: string; // ID MongoDB pour la compatibilité avec le nouveau système
  name: string;
  image?: string;
  description: string;
  isActive?: boolean; // Statut actif de la catégorie
  steps?: {
      [key: string]: {
          type: "supplements" | "extra" | "accompagnements" | "boissons" | "sauces";
          data: (OptionSupplement | OptionExtra | Accompagnements | Boissons | OptionSauce)[];
          title: string;
      };
  };
  accompaniments?: Array<{
      id: string;
      image: string;
      alt: string;
      hasPlus?: boolean;
  }>;
}

export interface Boissons {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Deal {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  cta: string;
} 

export interface MenuItem {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}