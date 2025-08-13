import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

// Route pour vérifier le contenu actuel de la base de données
export async function GET() {
  try {
    console.log('🔍 Vérification du contenu actuel de la base de données...');
    
    await connectDB();
    console.log('✅ MongoDB connecté');
    
    // Compter les documents
    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    
    console.log(`📊 Comptage: ${categoriesCount} catégories, ${productsCount} produits`);
    
    // Récupérer quelques exemples
    const sampleCategories = await Category.find({}).limit(3);
    const sampleProducts = await Product.find({}).limit(3);
    
    // Vérifier la structure des données existantes
    const categoryStructure = sampleCategories.length > 0 ? Object.keys(sampleCategories[0].toObject()) : [];
    const productStructure = sampleProducts.length > 0 ? Object.keys(sampleProducts[0].toObject()) : [];
    
    console.log('📋 Structure catégorie:', categoryStructure);
    console.log('📋 Structure produit:', productStructure);
    
    // Vérifier les types de données
    const categoryTypes = sampleCategories.length > 0 ? {
      name: typeof sampleCategories[0].name,
      description: typeof sampleCategories[0].description,
      image: typeof sampleCategories[0].image,
      isActive: typeof sampleCategories[0].isActive
    } : {};
    
    const productTypes = sampleProducts.length > 0 ? {
      name: typeof sampleProducts[0].name,
      description: typeof sampleProducts[0].description,
      price: typeof sampleProducts[0].price,
      category: typeof sampleProducts[0].category,
      image: typeof sampleProducts[0].image,
      isActive: typeof sampleProducts[0].isActive
    } : {};
    
    console.log('🔍 Types catégorie:', categoryTypes);
    console.log('🔍 Types produit:', productTypes);
    
    return NextResponse.json({
      success: true,
      message: 'Contenu de la base de données vérifié',
      stats: {
        categories: categoriesCount,
        products: productsCount
      },
      samples: {
        categories: sampleCategories.map(cat => ({
          id: cat._id,
          name: cat.name,
          description: cat.description,
          image: cat.image,
          isActive: cat.isActive,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt
        })),
        products: sampleProducts.map(prod => ({
          id: prod._id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          category: prod.category,
          image: prod.image,
          isActive: prod.isActive,
          createdAt: prod.createdAt,
          updatedAt: prod.updatedAt
        }))
      },
      structure: {
        categories: categoryStructure,
        products: productStructure
      },
      types: {
        categories: categoryTypes,
        products: productTypes
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la vérification du contenu',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
