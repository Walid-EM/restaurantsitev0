import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { categories, products } from '@/app/data';

// Route de test étape par étape pour diagnostiquer l'initialisation
export async function POST() {
  try {
    console.log('🧪 Test étape par étape de l\'initialisation...');
    
    // Étape 1: Vérifier l'import des données
    console.log('📋 Étape 1: Vérification des imports...');
    console.log('- categories importé:', !!categories);
    console.log('- products importé:', !!products);
    console.log('- Nombre de catégories:', categories?.length || 0);
    console.log('- Nombre de produits:', products?.length || 0);
    
    if (!categories || !products) {
      throw new Error('Imports des données échoués');
    }
    
    // Étape 2: Vérifier la structure des données
    console.log('📋 Étape 2: Vérification de la structure...');
    const firstCategory = categories[0];
    const firstProduct = products[0];
    
    console.log('Première catégorie:', {
      name: firstCategory?.name,
      description: firstCategory?.description,
      image: firstCategory?.image
    });
    
    console.log('Premier produit:', {
      name: firstProduct?.name,
      description: firstProduct?.description,
      price: firstProduct?.price,
      category: firstProduct?.category,
      image: firstProduct?.image
    });
    
    // Étape 3: Connexion MongoDB
    console.log('📋 Étape 3: Connexion MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connecté');
    
    // Étape 4: Vérifier les modèles
    console.log('📋 Étape 4: Vérification des modèles...');
    console.log('- Modèle Category:', !!Category);
    console.log('- Modèle Product:', !!Product);
    
    // Étape 5: Test de création d'une seule catégorie
    console.log('📋 Étape 5: Test création d\'une catégorie...');
    const testCategory = new Category({
      name: 'Test Catégorie',
      description: 'Catégorie de test',
      image: '/test.png',
      isActive: true
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
      isActive: true
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
        imports: '✅',
        structure: '✅',
        connection: '✅',
        models: '✅',
        categoryCreation: '✅',
        productCreation: '✅',
        cleanup: '✅'
      },
      data: {
        categoriesCount: categories.length,
        productsCount: products.length,
        firstCategory: firstCategory,
        firstProduct: firstProduct
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
