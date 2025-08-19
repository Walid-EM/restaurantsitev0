import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// Vérifier les permissions admin
async function checkAdminPermissions(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// POST - Migrer les catégories existantes pour ajouter un ordre
export async function POST(_request: NextRequest) {
  try {
    console.log('🔄 Migration des catégories - début');
    
    if (!(await checkAdminPermissions(_request))) {
      console.log('❌ Permissions refusées');
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    console.log('✅ Connexion MongoDB établie');

    // Récupérer TOUTES les catégories, triées par createdAt
    const allCategories = await Category.find({}).sort({ createdAt: 1 });
    console.log(`📋 ${allCategories.length} catégories trouvées`);

    if (allCategories.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucune catégorie à migrer',
        updatedCount: 0
      });
    }

    // Forcer la mise à jour de TOUTES les catégories avec un nouvel ordre
    const bulkOps = allCategories.map((category, index) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { $set: { order: index + 1 } }
      }
    }));

    console.log('📝 Opérations bulk préparées:', bulkOps.length);
    console.log('🔄 Exécution des mises à jour...');

    // Exécuter les mises à jour en lot
    const result = await Category.bulkWrite(bulkOps);
    console.log('📊 Résultat bulkWrite:', result);

    // Vérifier que les mises à jour ont bien été appliquées
    const updatedCategories = await Category.find({}).sort({ order: 1, createdAt: -1 });
    console.log('🔄 Vérification des catégories mises à jour:');
    updatedCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} - order: ${cat.order}, _id: ${cat._id}`);
    });

    return NextResponse.json({
      success: true,
      message: `Migration terminée: ${result.modifiedCount} catégorie(s) mise(s) à jour`,
      updatedCount: result.modifiedCount,
      categories: updatedCategories
    });

  } catch (error) {
    console.error('❌ Erreur lors de la migration des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la migration des catégories'
    }, { status: 500 });
  }
}

// GET - Vérifier l'état de la migration
export async function GET(_request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();

    // Compter les catégories avec et sans ordre
    const totalCategories = await Category.countDocuments({});
    const categoriesWithOrder = await Category.countDocuments({ 
      order: { $exists: true, $ne: null, $gt: 0 } 
    });
    const categoriesWithoutOrder = totalCategories - categoriesWithOrder;

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCategories,
        withOrder: categoriesWithOrder,
        withoutOrder: categoriesWithoutOrder,
        needsMigration: categoriesWithoutOrder > 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de la migration:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la vérification de la migration'
    }, { status: 500 });
  }
}
