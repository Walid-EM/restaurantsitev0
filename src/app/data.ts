import { Product, Category, Deal, OptionSupplement, OptionExtra, Accompagnements, Boissons } from './types';

// ============================================================================
// CONSTANTES ET CONFIGURATIONS
// ============================================================================

// Images communes
const IMAGES = {
  ASSIETTES: {
    MIXTE: "/AssietteMixte.png",
    MIXTE_XL: "/AssietteMixteXL.png",
    KEBAB: "/AssietteKebab.png",
    PLANCHA: "/Assiette-Plancha.png",
    MENU: "/MenuAssiette.png"
  },
  SANDWICHES: {
    PITTA: "/sandwishpitta.png"
  },
  BURGERS: {
    CHEESE: "/cheeseburger.png",
    DOUBLE: "/doublecheeseburger.png",
    CHICKEN: "/DoubleChickenBurger.png"
  },
  SNACKS: {
    FRITES: "/Frites.png",
    FRITES_CHEDDAR: "/FritesCheddarKebab.png",
    FRITES_JALAPENOS: "/FritesCheddarJalapenos.png",
    MENU: "/MenuSnacks.png"
  },
  BOISSONS: {
    COCA: "/Coca.png",
    SPRITE: "/sprite.png",
    FANTA: "/fanta.png",
    PEPSI: "/pepsi.png",
    ICETEA: "/icetea.png"
  },
  SUPPLEMENTS: {
    OIGNONS: "/oignons.png",
    TOMATES: "/tomates.png",
    CAROTTES: "/Carrotte.png",
    SALADE: "/Salade.png",
    MAIS: "/Mais.png",
    CORNICHONS: "/cornichon.png",
    CHEDDAR: "/cheddar.png",
    JALAPENOS: "/jalapenos.png",
    OLIVES: "/olives.png"
  }
} as const;

// ============================================================================
// DONNÉES DES OPTIONS
// ============================================================================

// Suppléments gratuits (tous disponibles)
export const supplements: OptionSupplement[] = [
  { id: "supp1", name: "Oignons", image: IMAGES.SUPPLEMENTS.OIGNONS, price: 0.0 },
  { id: "supp2", name: "Tomates", image: IMAGES.SUPPLEMENTS.TOMATES, price: 0.0 },
  { id: "supp3", name: "Carottes", image: IMAGES.SUPPLEMENTS.CAROTTES, price: 0.0 },
  { id: "supp4", name: "Salade", image: IMAGES.SUPPLEMENTS.SALADE, price: 0.0 },
  { id: "supp5", name: "Mais", image: IMAGES.SUPPLEMENTS.MAIS, price: 0.0 }
];

// Suppléments payants (tous disponibles)
export const extra: OptionExtra[] = [
  { id: "extra1", name: "Cornichons", image: IMAGES.SUPPLEMENTS.CORNICHONS, price: 0.5 },
  { id: "extra2", name: "Cheddar", image: IMAGES.SUPPLEMENTS.CHEDDAR, price: 0.5 },
  { id: "extra3", name: "Jalapenos", image: IMAGES.SUPPLEMENTS.JALAPENOS, price: 0.5 },
  { id: "extra4", name: "Olives", image: IMAGES.SUPPLEMENTS.OLIVES, price: 0.5 }
];

// Accompagnements (tous disponibles)
export const accompagnements: Accompagnements[] = [
  { id: "accomp1", name: "Frites", image: IMAGES.SNACKS.FRITES, price: 2.5 },
  { id: "accomp2", name: "Frites XL", image: IMAGES.SNACKS.FRITES, price: 3.0 },
  { id: "accomp3", name: "Frites Cheddar Jalapenos", image: IMAGES.SNACKS.FRITES_JALAPENOS, price: 3.5 },
  { id: "accomp4", name: "Frites Cheddar Kebab", image: IMAGES.SNACKS.FRITES_CHEDDAR, price: 3.5 }
];

// Boissons (toutes disponibles)
export const boissons: Boissons[] = [
  { id: "boisson1", name: "Coca-Cola", image: IMAGES.BOISSONS.COCA, price: 2.5 },
  { id: "boisson2", name: "Sprite", image: IMAGES.BOISSONS.SPRITE, price: 2.5 },
  { id: "boisson3", name: "Fanta", image: IMAGES.BOISSONS.FANTA, price: 2.5 },
  { id: "boisson4", name: "Pepsi", image: IMAGES.BOISSONS.PEPSI, price: 1.5 },
  { id: "boisson5", name: "Ice Tea", image: IMAGES.BOISSONS.ICETEA, price: 3.5 },
  { id: "boisson6", name: "Café", image: IMAGES.BOISSONS.COCA, price: 2.0 }
];

// ============================================================================
// CONFIGURATION DES CATÉGORIES
// ============================================================================

// Configuration des étapes par catégorie
const CATEGORY_STEPS: Record<string, { [key: string]: { type: "supplements" | "extra" | "accompagnements" | "boissons"; data: (OptionSupplement | OptionExtra | Accompagnements | Boissons)[]; title: string; } }> = {
  assiette: {
    supplements: { type: "supplements" as const, data: supplements, title: "Salades" },
    extra: { type: "extra" as const, data: extra, title: "Suppléments" },
    accompagnements: { type: "accompagnements" as const, data: accompagnements, title: "Accompagnements" },
    boissons: { type: "boissons" as const, data: boissons, title: "Boissons" }
  },
  sandwich: {
    supplements: { type: "supplements" as const, data: supplements, title: "Salades" },
    extra: { type: "extra" as const, data: extra, title: "Suppléments" },
    boissons: { type: "boissons" as const, data: boissons, title: "Boissons" }
  },
  tacos: {
    supplements: { type: "supplements" as const, data: supplements, title: "Salades" },
    extra: { type: "extra" as const, data: extra, title: "Suppléments" },
    boissons: { type: "boissons" as const, data: boissons, title: "Boissons" }
  },
  Bicky: {
    supplements: { 
      type: "supplements" as const, 
      data: [supplements[0], supplements[1], supplements[3]], // Oignons, Tomates, Salade
      title: "Suppléments gratuits" 
    },
    extra: { 
      type: "extra" as const, 
      data: [extra[0], extra[1], extra[2]], // Cornichons, Cheddar, Jalapenos
      title: "Suppléments payants" 
    },
    accompagnements: { 
      type: "accompagnements" as const, 
      data: [accompagnements[0], accompagnements[1], accompagnements[2]], // Frites, Frites XL, Frites Cheddar Jalapenos
      title: "Accompagnements" 
    },
    boissons: { 
      type: "boissons" as const, 
      data: [boissons[0], boissons[1], boissons[2]], // Coca-Cola, Sprite, Fanta
      title: "Boissons" 
    }
  }
};

// ============================================================================
// PRODUITS PAR CATÉGORIE
// ============================================================================

const ASSIETTES: Product[] = [
  { id: 1, name: "Assiette Mixte", price: "12.50 €", image: IMAGES.ASSIETTES.MIXTE, category: "assiette", description: "Assortiment de viandes avec frites et salade" },
  { id: 2, name: "Assiette Mixte XL", price: "14.90 €", image: IMAGES.ASSIETTES.MIXTE_XL, category: "assiette", description: "Grande assiette avec viandes variées et accompagnements" },
  { id: 3, name: "Assiette Kebab", price: "11.50 €", image: IMAGES.ASSIETTES.KEBAB, category: "assiette", description: "Kebab traditionnel avec frites et salade" },
  { id: 4, name: "Assiette Plancha", price: "16.90 €", image: IMAGES.ASSIETTES.PLANCHA, category: "assiette", description: "Viandes grillées à la plancha avec légumes" },
  { id: 5, name: "Menu Assiette", price: "10.50 €", image: IMAGES.ASSIETTES.MENU, category: "assiette", description: "Assiette complète avec boisson incluse" },
  { id: 6, name: "Assiette Mixte", price: "9.90 €", image: IMAGES.ASSIETTES.MIXTE, category: "assiette", description: "Assortiment de viandes avec accompagnements" }
];

const SANDWICHES: Product[] = [
  { id: 7, name: "Sandwich Kefta", price: "6.50 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Sandwich Kefta avec frites et salade" },
  { id: 8, name: "Sandwich Poulet", price: "7.50 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Poulet grillé avec salade et sauce" },
  { id: 9, name: "Sandwich Boulette", price: "6.90 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Sandwich Boulette avec frites et salade" },
  { id: 10, name: "Sandwich Kebab", price: "7.90 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Sandwich Kebab avec frites et salade" },
  { id: 11, name: "Sandwich Merguez", price: "5.90 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Merguez piquante ou non piquante avec frites et salade" },
  { id: 12, name: "Sandwich Brochette de dinde", price: "8.50 €", image: IMAGES.SANDWICHES.PITTA, category: "sandwich", description: "Brochette de dinde avec frites et salade" }
];

const TACOS: Product[] = [
  { id: 13, name: "Tacos Poulet", price: "9.50 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Poulet mariné avec légumes croquants" },
  { id: 14, name: "Tacos Merguez", price: "10.50 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Boeuf haché avec fromage râpé" },
  { id: 15, name: "Tacos Kebab", price: "11.50 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Poisson frais avec sauce crémeuse" },
  { id: 16, name: "Tacos Hamburger", price: "8.90 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Légumes grillés avec fromage" },
  { id: 17, name: "Tacos Mixte", price: "12.50 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Mélange de viandes avec sauce spéciale" },
  { id: 18, name: "Tacos Spécial", price: "13.90 €", image: IMAGES.BURGERS.CHEESE, category: "tacos", description: "Tacos premium avec ingrédients sélectionnés" }
];

const BICKY: Product[] = [
  { id: 19, name: "Bicky Hamburger", price: "8.50 €", image: IMAGES.BURGERS.CHEESE, category: "Bicky", description: "Bicky Hamburger" },
  { id: 20, name: "Double Bicky Burger", price: "12.90 €", image: IMAGES.BURGERS.DOUBLE, category: "Bicky", description: "Double Bicky Burger" },
  { id: 21, name: "Bicky Poulet", price: "9.50 €", image: IMAGES.BURGERS.CHICKEN, category: "Bicky", description: "Bicky Poulet" },
  { id: 22, name: "Bicky Kebab", price: "10.50 €", image: IMAGES.BURGERS.CHEESE, category: "Bicky", description: "Bicky Kebab" },
  { id: 23, name: "Bicky Kefta", price: "11.90 €", image: IMAGES.BURGERS.CHEESE, category: "Bicky", description: "Bicky Kefta" },
  { id: 24, name: "Bicky Boulette", price: "14.90 €", image: IMAGES.BURGERS.CHEESE, category: "Bicky", description: "Bicky Boulette" }
];

const SNACKS: Product[] = [
  { id: 25, name: "Frites Maison", price: "4.50 €", image: IMAGES.SNACKS.FRITES, category: "snacks", description: "Frites fraîches avec sel de mer" },
  { id: 26, name: "Frites Cheddar", price: "5.90 €", image: IMAGES.SNACKS.FRITES_CHEDDAR, category: "snacks", description: "Frites nappées de fromage cheddar" },
  { id: 27, name: "Frites Cheddar Jalapenos", price: "4.90 €", image: IMAGES.SNACKS.FRITES_JALAPENOS, category: "snacks", description: "Frites avec cheddar et piments jalapenos" },
  { id: 28, name: "Menu Snacks", price: "6.50 €", image: IMAGES.SNACKS.MENU, category: "snacks", description: "Assortiment de snacks avec boisson" },
  { id: 29, name: "Wings Buffalo", price: "8.90 €", image: IMAGES.SNACKS.FRITES, category: "snacks", description: "Ailes de poulet sauce buffalo" },
  { id: 30, name: "Nachos", price: "7.50 €", image: IMAGES.SNACKS.FRITES, category: "snacks", description: "Nachos avec guacamole et fromage" }
];

const DESSERTS: Product[] = [
  { id: 31, name: "Brownie Chocolat", price: "6.50 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Brownie moelleux au chocolat noir" },
  { id: 32, name: "Tiramisu", price: "7.90 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Tiramisu traditionnel italien" },
  { id: 33, name: "Cheesecake", price: "6.90 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Cheesecake crémeux aux fruits" },
  { id: 34, name: "Glace Vanille", price: "4.50 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Glace vanille artisanale" },
  { id: 35, name: "Mousse Chocolat", price: "5.90 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Mousse au chocolat onctueuse" },
  { id: 36, name: "Tarte Tatin", price: "7.50 €", image: IMAGES.SNACKS.FRITES, category: "dessert", description: "Tarte tatin aux pommes caramélisées" }
];

const BOISSONS: Product[] = [
  { id: 37, name: "Coca-Cola", price: "2.50 €", image: IMAGES.BOISSONS.COCA, category: "boissons", description: "Boisson gazeuse 33cl" },
  { id: 38, name: "Sprite", price: "2.50 €", image: IMAGES.BOISSONS.SPRITE, category: "boissons", description: "Limonade gazeuse rafraîchissante" },
  { id: 39, name: "Fanta", price: "2.50 €", image: IMAGES.BOISSONS.FANTA, category: "boissons", description: "Boisson orange pétillante" },
  { id: 40, name: "Pepsi", price: "1.50 €", image: IMAGES.BOISSONS.PEPSI, category: "boissons", description: "Cola rafraîchissant 33cl" },
  { id: 41, name: "Ice Tea", price: "3.50 €", image: IMAGES.BOISSONS.ICETEA, category: "boissons", description: "Thé glacé citron ou pêche" },
  { id: 42, name: "Café", price: "2.00 €", image: IMAGES.BOISSONS.COCA, category: "boissons", description: "Café expresso ou allongé" }
];

// ============================================================================
// EXPORTS PRINCIPAUX
// ============================================================================

// Fonction utilitaire pour récupérer les étapes d'une catégorie
export const getCategorySteps = (categoryId: string) => {
  return CATEGORY_STEPS[categoryId] || null;
};

// Tous les produits
export const products: Product[] = [
  ...ASSIETTES,
  ...SANDWICHES,
  ...TACOS,
  ...BICKY,
  ...SNACKS,
  ...DESSERTS,
  ...BOISSONS
];

// Catégories avec configuration
export const categories: Category[] = [
  {
    id: "assiette",
    name: "Assiette",
    image: IMAGES.ASSIETTES.MIXTE,
    description: "Assiettes complètes avec accompagnements",
    steps: CATEGORY_STEPS.assiette
  },
  {
    id: "sandwich",
    name: "Sandwich",
    image: IMAGES.SANDWICHES.PITTA,
    description: "Sandwiches frais et savoureux",
    steps: CATEGORY_STEPS.sandwich
  },
  {
    id: "tacos",
    name: "Tacos",
    image: IMAGES.BURGERS.CHEESE,
    description: "Tacos gourmands et personnalisables",
    steps: CATEGORY_STEPS.tacos
  },
  {
    id: "Bicky",
    name: "Bicky",
    image: IMAGES.BURGERS.CHEESE,
    description: "Burgers Bicky de qualité",
    steps: CATEGORY_STEPS.Bicky
  },
  {
    id: "snacks",
    name: "Snacks",
    image: IMAGES.SNACKS.FRITES,
    description: "Snacks et accompagnements"
  },
  {
    id: "dessert",
    name: "Dessert",
    image: IMAGES.SNACKS.FRITES,
    description: "Desserts et pâtisseries"
  },
  {
    id: "boissons",
    name: "Boissons",
    image: IMAGES.BOISSONS.COCA,
    description: "Boissons fraîches et chaudes"
  }
];

// ============================================================================
// DONNÉES ADDITIONNELLES (MENU ITEMS ET DEALS)
// ============================================================================

export const menuItems = [
  { id: 1, name: "Burger Classic", description: "Steak haché, salade, tomate, oignon, fromage", price: "8.50 €", image: IMAGES.BURGERS.CHEESE },
  { id: 2, name: "Burger Deluxe", description: "Double steak, bacon, cheddar, sauce spéciale", price: "12.90 €", image: IMAGES.BURGERS.DOUBLE },
  { id: 3, name: "Frites Maison", description: "Frites fraîches avec sel de mer", price: "4.50 €", image: IMAGES.SNACKS.FRITES },
  { id: 4, name: "Coca-Cola", description: "Boisson gazeuse 33cl", price: "2.50 €", image: IMAGES.BOISSONS.COCA },
  { id: 5, name: "Menu Complet", description: "Burger + Frites + Boisson", price: "13.90 €", image: IMAGES.SNACKS.MENU },
  { id: 6, name: "Dessert Chocolat", description: "Brownie au chocolat avec glace vanille", price: "6.50 €", image: IMAGES.SNACKS.FRITES }
];

export const deals: Deal[] = [
  { id: 1, title: "Menu Burger + Frites", description: "Burger au choix avec frites et boisson", price: "12.90 €", image: IMAGES.SNACKS.MENU, cta: "Commander maintenant" },
  { id: 2, title: "2 Tacos pour le prix d'1", description: "Offre limitée - Tacos au choix", price: "9.50 €", image: IMAGES.BURGERS.CHEESE, cta: "Voir l'offre" },
  { id: 3, title: "Assiette du Jour", description: "Plat du jour avec accompagnement", price: "14.50 €", image: IMAGES.ASSIETTES.MIXTE, cta: "Commander maintenant" },
  { id: 4, title: "Sandwich + Boisson", description: "Sandwich au choix avec boisson", price: "8.90 €", image: IMAGES.SANDWICHES.PITTA, cta: "Voir l'offre" },
  { id: 5, title: "Dessert + Café", description: "Dessert au choix avec café", price: "6.50 €", image: IMAGES.SNACKS.FRITES, cta: "Commander maintenant" },
  { id: 6, title: "Snacks Party", description: "Frites + Nuggets + Boisson", price: "11.90 €", image: IMAGES.SNACKS.FRITES, cta: "Voir l'offre" }
];