import { Product, Category, Deal, OptionSupplement, OptionExtra, Accompagnements, Boissons, OptionSauce } from '../app/types';
import { StepDataItem } from '../components/ui/types';

// Interface étendue pour Category avec les propriétés MongoDB
interface ExtendedCategory extends Category {
  order?: number;
  allowedOptions?: string[];
}

// ============================================================================
// SERVICE DE DONNÉES MONGODB (LECTURE SEULE)
// ============================================================================

// Cache des données pour éviter les appels répétés
let dataCache: {
  categories: ExtendedCategory[];
  supplements: OptionSupplement[];
  extra: OptionExtra[];
  sauces: OptionSauce[];
  accompagnements: Accompagnements[];
  boissons: Boissons[];
  lastFetch: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction utilitaire pour récupérer les données depuis l'API
async function fetchFromAPI<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.success ? data[endpoint] || [] : [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des ${endpoint}:`, error);
    return [];
  }
}

// Récupérer toutes les données depuis MongoDB
export async function fetchAllData() {
  const now = Date.now();
  
  // Vérifier si le cache est encore valide
  if (dataCache && (now - dataCache.lastFetch) < CACHE_DURATION) {
    return dataCache;
  }

  try {
    console.log('🔄 Récupération des données depuis MongoDB...');
    
    // Récupérer toutes les données en parallèle
    const [categories, supplements, extra, sauces, accompagnements, boissons] = await Promise.all([
      fetchFromAPI<ExtendedCategory>('categories'),
      fetchFromAPI<OptionSupplement>('supplements'),
      fetchFromAPI<OptionExtra>('extras'),
      fetchFromAPI<OptionSauce>('sauces'),
      fetchFromAPI<Accompagnements>('accompagnements'),
      fetchFromAPI<Boissons>('boissons')
    ]);

    // Mettre à jour le cache
    dataCache = {
      categories: categories.sort((a, b) => (a.order || 0) - (b.order || 0)),
      supplements,
      extra,
      sauces,
      accompagnements,
      boissons,
      lastFetch: now
    };

    console.log('✅ Données récupérées avec succès:', {
      categories: categories.length,
      supplements: supplements.length,
      extra: extra.length,
      sauces: sauces.length,
      accompagnements: accompagnements.length,
      boissons: boissons.length
    });

    return dataCache;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données:', error);
    
    // Retourner le cache existant s'il y en a un, sinon des tableaux vides
    if (dataCache) {
      console.log('⚠️ Utilisation du cache existant en raison d\'une erreur');
      return dataCache;
    }
    
    return {
      categories: [],
      supplements: [],
      extra: [],
      sauces: [],
      accompagnements: [],
      boissons: [],
      lastFetch: now
    };
  }
}

// Récupérer les catégories avec leurs étapes configurées
export async function getCategoriesWithSteps(): Promise<ExtendedCategory[]> {
  const data = await fetchAllData();
  return data.categories.filter(cat => cat.isActive);
}

// Récupérer les suppléments
export async function getSupplements(): Promise<OptionSupplement[]> {
  const data = await fetchAllData();
  return data.supplements;
}

// Récupérer les extras
export async function getExtra(): Promise<OptionExtra[]> {
  const data = await fetchAllData();
  return data.extra;
}

// Récupérer les sauces
export async function getSauces(): Promise<OptionSauce[]> {
  const data = await fetchAllData();
  return data.sauces;
}

// Récupérer les accompagnements
export async function getAccompagnements(): Promise<Accompagnements[]> {
  const data = await fetchAllData();
  return data.accompagnements;
}

// Récupérer les boissons
export async function getBoissons(): Promise<Boissons[]> {
  const data = await fetchAllData();
  return data.boissons;
}

// Récupérer la configuration des étapes pour une catégorie
export async function getCategorySteps(categoryId: string) {
  const data = await fetchAllData();
  const category = data.categories.find(cat => cat.id === categoryId || cat.name.toLowerCase() === categoryId.toLowerCase());
  
  if (!category || !category.allowedOptions) {
    return {};
  }

  const steps: { [key: string]: { type: "supplements" | "extra" | "accompagnements" | "boissons" | "sauces"; data: StepDataItem[]; title: string; } } = {};

  // Configurer les étapes selon les options autorisées
  if (category.allowedOptions.includes('supplements')) {
    steps.supplements = { 
      type: "supplements" as const, 
      data: data.supplements, 
      title: "Crudités" 
    };
  }

  if (category.allowedOptions.includes('extras')) {
    steps.extra = { 
      type: "extra" as const, 
      data: data.extra, 
      title: "Suppléments" 
    };
  }

  if (category.allowedOptions.includes('sauces')) {
    steps.sauces = { 
      type: "sauces" as const, 
      data: data.sauces, 
      title: "Sauces" 
    };
  }

  if (category.allowedOptions.includes('accompagnements')) {
    steps.accompagnements = { 
      type: "accompagnements" as const, 
      data: data.accompagnements, 
      title: "Accompagnements" 
    };
  }

  if (category.allowedOptions.includes('boissons')) {
    steps.boissons = { 
      type: "boissons" as const, 
      data: data.boissons, 
      title: "Boissons" 
    };
  }

  return steps;
}

// Fonction pour forcer le rafraîchissement du cache
export function refreshCache() {
  dataCache = null;
  console.log('🔄 Cache vidé, prochaine récupération sera depuis MongoDB');
}

// Export des fonctions pour compatibilité avec l'ancien data.ts
export const category = getCategoriesWithSteps;
export const supplements = getSupplements;
export const extra = getExtra;
export const sauces = getSauces;
export const accompagnements = getAccompagnements;
export const boissons = getBoissons;

