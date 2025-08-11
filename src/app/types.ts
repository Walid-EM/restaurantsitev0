export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Omit<Product, 'id'> {
  id: string; // Identifiant unique pour le panier
  originalId: number; // ID original du produit
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
  id: string;
  name: string;
  image?: string;
  description: string;
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