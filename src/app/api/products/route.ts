import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const spicy = searchParams.get('spicy');
    const vegetarian = searchParams.get('vegetarian');
    const hasIngredients = searchParams.get('hasIngredients');
    
    // Construire le filtre de base
    const filter: Record<string, unknown> = { isAvailable: true };
    
    // Filtrer par catégorie
    if (category) {
      filter.category = category.toLowerCase();
    }
    
    // Filtrer par épicé
    if (spicy !== null) {
      filter.isSpicy = spicy === 'true';
    }
    
    // Filtrer par végétarien
    if (vegetarian !== null) {
      filter.isVegetarian = vegetarian === 'true';
    }
    
    // Filtrer les produits avec ingrédients
    if (hasIngredients === 'true') {
      filter.ingredients = { $exists: true, $ne: [] };
    }
    
    console.log('🔍 Filtre appliqué:', filter);
    
    // Récupérer les produits avec le filtre
    const products = await Product.find(filter).sort({ name: 1 });
    
    console.log(`📦 ${products.length} produits trouvés avec les filtres`);
    
    return NextResponse.json({
      success: true,
      products: products,
      count: products.length,
      filters: {
        category,
        spicy: spicy === 'true' ? true : spicy === 'false' ? false : null,
        vegetarian: vegetarian === 'true' ? true : vegetarian === 'false' ? false : null,
        hasIngredients: hasIngredients === 'true'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}