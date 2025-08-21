import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Extra from '@/models/Extra';
import Sauce from '@/models/Sauce';
import Supplement from '@/models/Supplement';
import Accompagnement from '@/models/Accompagnement';
import Boisson from '@/models/Boisson';
import { Product as ProductType } from '@/app/types';

// Données de test intégrées pour l'initialisation
const testData = {
  categories: [
    {
      name: 'Burgers',
      description: 'Nos délicieux burgers maison',
      image: '/cheeseburger.png',
      isActive: true,
      allowedOptions: ['supplements', 'sauces', 'accompagnements', 'boissons'],
      order: 1
    },
    {
      name: 'Accompagnements',
      description: 'Frites et autres accompagnements',
      image: '/Frites.png',
      isActive: true,
      allowedOptions: ['sauces'],
      order: 2
    },
    {
      name: 'Boissons',
      description: 'Rafraîchissements et boissons chaudes',
      image: '/Coca.png',
      isActive: true,
      allowedOptions: [],
      order: 3
    }
  ],
  products: [
    {
      name: 'Cheese Burger',
      description: 'Burger avec steak, fromage, salade et tomate',
      price: 8.50,
      category: 'burgers',
      image: '/cheeseburger.png',
      isAvailable: true
    },
    {
      name: 'Double Cheese Burger',
      description: 'Double steak avec double fromage',
      price: 12.00,
      category: 'burgers',
      image: '/doublecheeseburger.png',
      isAvailable: true
    }
  ],
  extra: [
    {
      name: 'Cornichons',
      price: 0.50,
      image: '/cornichon.png',
      isActive: true
    },
    {
      name: 'Cheddar',
      price: 0.50,
      image: '/cheddar.png',
      isActive: true
    }
  ],
  sauces: [
    {
      name: 'Sauce BBQ',
      price: 0.00,
      image: '/Sauceicone.png',
      isActive: true
    },
    {
      name: 'Sauce Ketchup',
      price: 0.00,
      image: '/Sauceicone.png',
      isActive: true
    }
  ],
  supplements: [
    {
      name: 'Oignons',
      price: 0.00,
      image: '/oignons.png',
      isActive: true
    },
    {
      name: 'Tomates',
      price: 0.00,
      image: '/tomates.png',
      isActive: true
    }
  ],
  accompagnements: [
    {
      name: 'Frites',
      price: 2.50,
      image: '/Frites.png',
      isActive: true
    },
    {
      name: 'Frites XL',
      price: 3.00,
      image: '/Frites.png',
      isActive: true
    }
  ],
  boissons: [
    {
      name: 'Coca-Cola',
      price: 2.50,
      image: '/Coca.png',
      isActive: true
    },
    {
      name: 'Sprite',
      price: 2.50,
      image: '/sprite.png',
      isActive: true
    }
  ]
};

// Route pour initialiser TOUS les éléments de la base de données
export async function POST() {
  try {
    console.log('🔍 Initialisation complète de la base de données...');
    
    await connectDB();
    console.log('✅ MongoDB connecté avec succès');
    
    // 1. Initialiser les catégories
    console.log('🏷️ Initialisation des catégories...');
    await Category.deleteMany({});
    const categoryData = testData.categories.map(cat => ({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      isActive: cat.isActive,
      allowedOptions: cat.allowedOptions,
      order: cat.order
    }));
    const createdCategories = await Category.insertMany(categoryData);
    console.log(`✅ ${createdCategories.length} catégories créées`);
    
    // 2. Initialiser les produits
    console.log('🏗️ Initialisation des produits...');
    await Product.deleteMany({});
    const productData = testData.products.map(prod => ({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      image: prod.image,
      isAvailable: prod.isAvailable
    }));
    const createdProducts = await Product.insertMany(productData);
    console.log(`✅ ${createdProducts.length} produits créés`);
    
    // 3. Initialiser les extras (suppléments payants)
    console.log('🆕 Initialisation des extras...');
    await Extra.deleteMany({});
    const extraData = testData.extra.map(ext => ({
      name: ext.name,
      price: ext.price,
      image: ext.image,
      isActive: ext.isActive
    }));
    const createdExtras = await Extra.insertMany(extraData);
    console.log(`✅ ${createdExtras.length} extras créés`);
    
    // 4. Initialiser les sauces
    console.log('🥫 Initialisation des sauces...');
    await Sauce.deleteMany({});
    const sauceData = testData.sauces.map(sauce => ({
      name: sauce.name,
      price: sauce.price,
      image: sauce.image,
      isActive: sauce.isActive
    }));
    const createdSauces = await Sauce.insertMany(sauceData);
    console.log(`✅ ${createdSauces.length} sauces créées`);
    
    // 5. Initialiser les suppléments (gratuits)
    console.log('🥬 Initialisation des suppléments...');
    await Supplement.deleteMany({});
    const supplementData = testData.supplements.map(supp => ({
      name: supp.name,
      price: supp.price,
      image: supp.image,
      isActive: supp.isActive
    }));
    const createdSupplements = await Supplement.insertMany(supplementData);
    console.log(`✅ ${createdSupplements.length} suppléments créés`);
    
    // 6. Initialiser les accompagnements
    console.log('🍟 Initialisation des accompagnements...');
    await Accompagnement.deleteMany({});
    const accompagnementData = testData.accompagnements.map(acc => ({
      name: acc.name,
      price: acc.price,
      image: acc.image,
      isActive: acc.isActive
    }));
    const createdAccompagnements = await Accompagnement.insertMany(accompagnementData);
    console.log(`✅ ${createdAccompagnements.length} accompagnements créés`);
    
    // 7. Initialiser les boissons
    console.log('🥤 Initialisation des boissons...');
    await Boisson.deleteMany({});
    const boissonData = testData.boissons.map(boisson => ({
      name: boisson.name,
      price: boisson.price,
      image: boisson.image,
      isActive: boisson.isActive
    }));
    const createdBoissons = await Boisson.insertMany(boissonData);
    console.log(`✅ ${createdBoissons.length} boissons créées`);
    
    // Vérification finale
    const stats = {
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      extras: await Extra.countDocuments(),
      sauces: await Sauce.countDocuments(),
      supplements: await Supplement.countDocuments(),
      accompagnements: await Accompagnement.countDocuments(),
      boissons: await Boisson.countDocuments(),
      bickies: await Product.countDocuments({ category: 'bicky' })
    };
    
    console.log('📊 Vérification finale:', stats);
    
    return NextResponse.json({
      success: true,
      message: 'Base de données complètement initialisée',
      stats,
      created: {
        categories: createdCategories.length,
        products: createdProducts.length,
        extras: createdExtras.length,
        sauces: createdSauces.length,
        supplements: createdSupplements.length,
        accompagnements: createdAccompagnements.length,
        boissons: createdBoissons.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation complète:', error);
    
    if (error instanceof Error) {
      console.error('📋 Détails de l\'erreur:');
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        console.error('🔍 Erreur de validation Mongoose détectée');
        console.error('- Détails:', JSON.stringify(error, null, 2));
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'initialisation complète',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET pour vérifier l'état complet de la base de données
export async function GET() {
  try {
    await connectDB();
    
    const stats = {
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      extras: await Extra.countDocuments(),
      sauces: await Sauce.countDocuments(),
      supplements: await Supplement.countDocuments(),
      accompagnements: await Accompagnement.countDocuments(),
      boissons: await Boisson.countDocuments(),
      bickies: await Product.countDocuments({ category: 'bicky' })
    };
    
    return NextResponse.json({
      success: true,
      message: 'État complet de la base de données',
      stats
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la vérification',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
