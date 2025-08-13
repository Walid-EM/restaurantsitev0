import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer TOUTES les catégories sans filtre pour diagnostiquer
    const allCategories = await Category.find({}).sort({ createdAt: -1 });
    const activeCategories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    
    console.log('🔍 Debug catégories:');
    console.log('- Toutes les catégories:', allCategories.length);
    console.log('- Catégories actives:', activeCategories.length);
    console.log('- Première catégorie:', allCategories[0] ? { name: allCategories[0].name, isActive: allCategories[0].isActive } : 'Aucune');
    
    // Retourner toutes les catégories pour le moment
    const categories = allCategories;
    
    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
      debug: {
        all: allCategories.length,
        active: activeCategories.length,
        firstCategory: allCategories[0] ? { name: allCategories[0].name, isActive: allCategories[0].isActive } : null
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des catégories',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
