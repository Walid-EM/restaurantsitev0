import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

// Route de test étape par étape pour diagnostiquer l'initialisation
export async function POST() {
  try {
    console.log('🧪 Test étape par étape de l\'initialisation...');
    
    // Étape 1: Vérifier l'environnement
    console.log('📋 Étape 1: Vérification de l\'environnement...');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- MONGODB_URI:', !!process.env.MONGODB_URI);
    
    // Étape 2: Connexion MongoDB
    console.log('📋 Étape 2: Connexion MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connecté');
    
    // Étape 3: Vérifier les modèles
    console.log('📋 Étape 3: Vérification des modèles...');
    console.log('- Modèle Category:', !!Category);
    console.log('- Modèle Product:', !!Product);
    
    // Étape 4: Vérifier la base de données existante
    console.log('📋 Étape 4: Vérification de la base de données...');
    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    
    console.log('- Catégories existantes:', categoriesCount);
    console.log('- Produits existants:', productsCount);
    
    // Étape 5: Test de création d'une seule catégorie
    console.log('📋 Étape 5: Test création d\'une catégorie...');
    const testCategory = new Category({
      name: 'Test Catégorie',
      description: 'Catégorie de test',
      image: '/test.png',
      isActive: true,
      allowedOptions: ['supplements', 'sauces'],
      order: 999
    });
    
    const savedCategory = await testCategory.save();
    console.log('✅ Catégorie de test créée:', savedCategory._id);
    
    // Étape 6: Test de création d'un seul produit
    console.log('📋 Étape 6: Test création d\'un produit...');
    const testProduct = new Product({
      name: 'Test Produit',
      description: 'Produit de test',
      price: 9.99,
      category: 'test',
      image: '/test.png',
      isAvailable: true
    });
    
    const savedProduct = await testProduct.save();
    console.log('✅ Produit de test créé:', savedProduct._id);
    
    // Étape 7: Nettoyage des tests
    console.log('📋 Étape 7: Nettoyage des tests...');
    await Category.deleteOne({ _id: savedCategory._id });
    await Product.deleteOne({ _id: savedProduct._id });
    console.log('✅ Tests nettoyés');
    
    return NextResponse.json({
      success: true,
      message: 'Test étape par étape réussi',
      steps: {
        environment: '✅',
        connection: '✅',
        models: '✅',
        database: '✅',
        categoryCreation: '✅',
        productCreation: '✅',
        cleanup: '✅'
      },
      data: {
        categoriesCount,
        productsCount,
        testCategory: {
          name: testCategory.name,
          description: testCategory.description
        },
        testProduct: {
          name: testProduct.name,
          price: testProduct.price
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test étape par étape:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test étape par étape',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
