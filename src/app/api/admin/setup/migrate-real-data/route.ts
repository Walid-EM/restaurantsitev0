import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Extra from '@/models/Extra';
import Sauce from '@/models/Sauce';
import Supplement from '@/models/Supplement';
import Accompagnement from '@/models/Accompagnement';
import Boisson from '@/models/Boisson';

// Données réelles extraites de data.ts (structure simplifiée)
const realData = {
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
    },
    {
      name: 'Sauces',
      description: 'Sauces maison et condiments',
      image: '/Sauceicone.png',
      isActive: true,
      allowedOptions: [],
      order: 4
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
    },
    {
      name: 'Chicken Burger',
      description: 'Burger au poulet pané',
      price: 9.50,
      category: 'burgers',
      image: '/DoubleChickenBurger.png',
      isAvailable: true
    }
  ],
  supplements: [
    {
      name: 'Salade',
      price: 0.00,
      image: '/Crudités.png',
      isActive: true
    },
    {
      name: 'Tomates',
      price: 0.00,
      image: '/Crudités.png',
      isActive: true
    },
    {
      name: 'Oignons',
      price: 0.00,
      image: '/Crudités.png',
      isActive: true
    }
  ],
  extras: [
    {
      name: 'Cheddar',
      price: 1.00,
      image: '/Crudités.png',
      isActive: true
    },
    {
      name: 'Bacon',
      price: 1.50,
      image: '/Crudités.png',
      isActive: true
    },
    {
      name: 'Œuf',
      price: 1.00,
      image: '/Crudités.png',
      isActive: true
    }
  ],
  sauces: [
    {
      name: 'Ketchup',
      price: 0.00,
      image: '/Sauceicone.png',
      isActive: true
    },
    {
      name: 'Mayonnaise',
      price: 0.00,
      image: '/Sauceicone.png',
      isActive: true
    },
    {
      name: 'Sauce BBQ',
      price: 0.00,
      image: '/Sauceicone.png',
      isActive: true
    },
    {
      name: 'Sauce Blanche',
      price: 0.00,
      image: '/Sauceicone.png',
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
      price: 3.50,
      image: '/Frites.png',
      isActive: true
    },
    {
      name: 'Frites Cheddar',
      price: 3.00,
      image: '/FritesCheddarKebab.png',
      isActive: true
    },
    {
      name: 'Frites Jalapeños',
      price: 3.00,
      image: '/FritesCheddarJalapenos.png',
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
    },
    {
      name: 'Fanta',
      price: 2.50,
      image: '/fanta.png',
      isActive: true
    },
    {
      name: 'Pepsi',
      price: 2.50,
      image: '/pepsi.png',
      isActive: true
    },
    {
      name: 'Ice Tea',
      price: 2.50,
      image: '/icetea.png',
      isActive: true
    }
  ]
};

// Route pour migrer les vraies données vers MongoDB
export async function POST() {
  try {
    console.log('🚀 Migration des vraies données vers MongoDB...');
    
    await connectDB();
    console.log('✅ MongoDB connecté avec succès');
    
    // 1. Migrer les catégories
    console.log('🏷️ Migration des catégories...');
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(realData.categories);
    console.log(`✅ ${createdCategories.length} catégories migrées`);
    
    // 2. Migrer les produits
    console.log('🏗️ Migration des produits...');
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(realData.products);
    console.log(`✅ ${createdProducts.length} produits migrés`);
    
    // 3. Migrer les suppléments
    console.log('🥬 Migration des suppléments...');
    await Supplement.deleteMany({});
    const createdSupplements = await Supplement.insertMany(realData.supplements);
    console.log(`✅ ${createdSupplements.length} suppléments migrés`);
    
    // 4. Migrer les extras
    console.log('🆕 Migration des extras...');
    await Extra.deleteMany({});
    const createdExtras = await Extra.insertMany(realData.extras);
    console.log(`✅ ${createdExtras.length} extras migrés`);
    
    // 5. Migrer les sauces
    console.log('🥫 Migration des sauces...');
    await Sauce.deleteMany({});
    const createdSauces = await Sauce.insertMany(realData.sauces);
    console.log(`✅ ${createdSauces.length} sauces migrées`);
    
    // 6. Migrer les accompagnements
    console.log('🍟 Migration des accompagnements...');
    await Accompagnement.deleteMany({});
    const createdAccompagnements = await Accompagnement.insertMany(realData.accompagnements);
    console.log(`✅ ${createdAccompagnements.length} accompagnements migrés`);
    
    // 7. Migrer les boissons
    console.log('🥤 Migration des boissons...');
    await Boisson.deleteMany({});
    const createdBoissons = await Boisson.insertMany(realData.boissons);
    console.log(`✅ ${createdBoissons.length} boissons migrées`);
    
    // Vérification finale
    const stats = {
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      supplements: await Supplement.countDocuments(),
      extras: await Extra.countDocuments(),
      sauces: await Sauce.countDocuments(),
      accompagnements: await Accompagnement.countDocuments(),
      boissons: await Boisson.countDocuments()
    };
    
    console.log('📊 Vérification finale:', stats);
    
    return NextResponse.json({
      success: true,
      message: 'Migration des vraies données terminée avec succès',
      stats,
      migrated: {
        categories: createdCategories.length,
        products: createdProducts.length,
        supplements: createdSupplements.length,
        extras: createdExtras.length,
        sauces: createdSauces.length,
        accompagnements: createdAccompagnements.length,
        boissons: createdBoissons.length
      },
      data: {
        categories: realData.categories.map(c => ({ name: c.name, allowedOptions: c.allowedOptions })),
        products: realData.products.map(p => ({ name: p.name, category: p.category, price: p.price })),
        supplements: realData.supplements.map(s => ({ name: s.name, price: s.price })),
        extras: realData.extras.map(e => ({ name: e.name, price: e.price })),
        sauces: realData.sauces.map(s => ({ name: s.name, price: s.price })),
        accompagnements: realData.accompagnements.map(a => ({ name: a.name, price: a.price })),
        boissons: realData.boissons.map(b => ({ name: b.name, price: b.price }))
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration des vraies données:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la migration des vraies données',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


