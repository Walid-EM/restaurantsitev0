import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - Récupérer les catégories avec leurs options configurées
export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true }, 'name allowedOptions');
    
    // Transformer les données en format compatible avec l'ancienne structure
    const categoryOptionsMap: { [key: string]: string[] } = {};
    
    categories.forEach(category => {
      categoryOptionsMap[category.name.toLowerCase()] = category.allowedOptions || [];
    });

    return NextResponse.json({
      success: true,
      categoryOptionsMap,
      categories: categories.map(cat => ({
        name: cat.name,
        allowedOptions: cat.allowedOptions || []
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des options de catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des options de catégories',
      // Fallback vers les options par défaut en cas d'erreur
      categoryOptionsMap: {
        'assiette': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'sandwich': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'tacos': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
        'bicky': ['supplements', 'sauces', 'extras'],
        'snacks': ['sauces'],
        'dessert': [],
        'boissons': []
      }
    }, { status: 500 });
  }
}

