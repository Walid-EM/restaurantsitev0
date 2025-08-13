import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Extra from '@/models/Extra';
import Sauce from '@/models/Sauce';
import Supplement from '@/models/Supplement';
import Accompagnement from '@/models/Accompagnement';
import Boisson from '@/models/Boisson';
// import Bicky from '@/models/Bicky'; // Modèle supprimé - utilise Product
import { 
  categories, 
  products, 
  extra, 
  sauces, 
  supplements, 
  accompagnements, 
  boissons,
  BICKY
} from '@/app/data';
import { Product as ProductType } from '@/app/types';

// Route pour initialiser TOUS les éléments de la base de données
export async function POST() {
  try {
    console.log('🔍 Initialisation complète de la base de données...');
    
    await connectDB();
    console.log('✅ MongoDB connecté avec succès');
    
    // 1. Initialiser les catégories
    console.log('🏷️ Initialisation des catégories...');
    await Category.deleteMany({});
    const categoryData = categories.map(cat => ({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      isActive: true
    }));
    const createdCategories = await Category.insertMany(categoryData);
    console.log(`✅ ${createdCategories.length} catégories créées`);
    
    // 2. Initialiser les produits
    console.log('🏗️ Initialisation des produits...');
    await Product.deleteMany({});
    const productData = products.map(prod => ({
      name: prod.name,
      description: prod.description,
      price: parseFloat(prod.price.replace(' €', '')),
      category: prod.category,
      image: prod.image,
      isAvailable: true
    }));
    const createdProducts = await Product.insertMany(productData);
    console.log(`✅ ${createdProducts.length} produits créés`);
    
    // 3. Initialiser les extras (suppléments payants)
    console.log('🆕 Initialisation des extras...');
    await Extra.deleteMany({});
    const extraData = extra.map(ext => ({
      name: ext.name,
      price: ext.price,
      image: ext.image,
      isActive: true
    }));
    const createdExtras = await Extra.insertMany(extraData);
    console.log(`✅ ${createdExtras.length} extras créés`);
    
    // 4. Initialiser les sauces
    console.log('🥫 Initialisation des sauces...');
    await Sauce.deleteMany({});
    const sauceData = sauces.map(sauce => ({
      name: sauce.name,
      price: sauce.price,
      image: sauce.image,
      isActive: true
    }));
    const createdSauces = await Sauce.insertMany(sauceData);
    console.log(`✅ ${createdSauces.length} sauces créées`);
    
    // 5. Initialiser les suppléments (gratuits)
    console.log('🥬 Initialisation des suppléments...');
    await Supplement.deleteMany({});
    const supplementData = supplements.map(supp => ({
      name: supp.name,
      price: supp.price,
      image: supp.image,
      isActive: true
    }));
    const createdSupplements = await Supplement.insertMany(supplementData);
    console.log(`✅ ${createdSupplements.length} suppléments créés`);
    
    // 6. Initialiser les accompagnements
    console.log('🍟 Initialisation des accompagnements...');
    await Accompagnement.deleteMany({});
    const accompagnementData = accompagnements.map(acc => ({
      name: acc.name,
      price: acc.price,
      image: acc.image,
      isActive: true
    }));
    const createdAccompagnements = await Accompagnement.insertMany(accompagnementData);
    console.log(`✅ ${createdAccompagnements.length} accompagnements créés`);
    
    // 7. Initialiser les boissons
    console.log('🥤 Initialisation des boissons...');
    await Boisson.deleteMany({});
    const boissonData = boissons.map(boisson => ({
      name: boisson.name,
      price: boisson.price,
      image: boisson.image,
      isActive: true
    }));
    const createdBoissons = await Boisson.insertMany(boissonData);
    console.log(`✅ ${createdBoissons.length} boissons créées`);
    
    // 8. Initialiser les Bicky via Product unifié
    console.log('🍔 Initialisation des Bicky comme Products...');
    await Product.deleteMany({ category: 'bicky' }); // Supprimer les anciens Bicky
    const bickyData = BICKY.map((bicky: ProductType) => ({
      name: bicky.name,
      description: bicky.description,
      price: parseFloat(bicky.price.replace(' €', '')),
      category: 'bicky', // Catégorie unifiée
      image: bicky.image,
      isAvailable: true,
      ingredients: [bicky.description], // Utiliser la description comme ingrédient principal
      isSpicy: bicky.name.toLowerCase().includes('kefta') || bicky.name.toLowerCase().includes('merguez'),
      isVegetarian: false, // Tous les Bicky contiennent de la viande
      extras: [], // Vide par défaut
      metadata: {
        initializedFromData: true,
        initDate: new Date()
      }
    }));
    const createdBickies = await Product.insertMany(bickyData);
    console.log(`✅ ${createdBickies.length} Bicky créés comme Products`);
    
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
        boissons: createdBoissons.length,
        bickies: createdBickies.length
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
