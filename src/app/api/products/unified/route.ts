import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    
    // Récupérer tous les produits disponibles
    const allProducts = await Product.find({ isAvailable: true }).sort({ name: 1 });
    
    // Regrouper par catégorie
    const productsByCategory = allProducts.reduce((acc, product) => {
      const category = product.category || 'autres';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, unknown[]>);
    
    // Statistiques par propriétés spéciales
    const stats = {
      total: allProducts.length,
      byCategory: Object.keys(productsByCategory).map(cat => ({
        category: cat,
        count: productsByCategory[cat].length
      })),
      spicy: allProducts.filter(p => p.isSpicy).length,
      vegetarian: allProducts.filter(p => p.isVegetarian).length,
      withIngredients: allProducts.filter(p => p.ingredients && p.ingredients.length > 0).length
    };
    
    console.log('📊 Statistiques produits unifiés:', stats);
    
    return NextResponse.json({
      success: true,
      products: allProducts,
      productsByCategory,
      stats,
      message: 'Produits unifiés récupérés avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits unifiés:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des produits unifiés' },
      { status: 500 }
    );
  }
}
