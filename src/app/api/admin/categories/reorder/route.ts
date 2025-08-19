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

// POST - Réorganiser les catégories en lot
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API reorder appelée');
    
    if (!(await checkAdminPermissions(request))) {
      console.log('❌ Permissions refusées');
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { categoryOrders } = body;
    
    console.log('📦 Données reçues:', JSON.stringify(categoryOrders, null, 2));

    // Validation
    if (!Array.isArray(categoryOrders) || categoryOrders.length === 0) {
      console.log('❌ Validation échouée: format invalide');
      return NextResponse.json({
        success: false,
        error: 'Format invalide: categoryOrders doit être un tableau non vide'
      }, { status: 400 });
    }

    // Validation de la structure
    for (const item of categoryOrders) {
      if (!item._id || typeof item.order !== 'number' || item.order < 0) {
        console.log('❌ Validation échouée: structure invalide pour', item);
        return NextResponse.json({
          success: false,
          error: 'Format invalide: chaque élément doit avoir _id et order'
        }, { status: 400 });
      }
    }

    console.log('✅ Validation réussie, connexion à MongoDB...');
    await connectDB();

    // Utiliser bulkWrite pour une mise à jour optimisée
    const bulkOps = categoryOrders.map(({ _id, order }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { order } }
      }
    }));

    console.log('📝 Opérations bulk:', JSON.stringify(bulkOps, null, 2));

    const result = await Category.bulkWrite(bulkOps);
    console.log('📊 Résultat bulkWrite:', result);

    if (result.matchedCount !== categoryOrders.length) {
      console.log('❌ Certaines catégories non trouvées');
      return NextResponse.json({
        success: false,
        error: 'Certaines catégories n\'ont pas été trouvées'
      }, { status: 400 });
    }

    // Récupérer les catégories mises à jour
    const updatedCategories = await Category.find({}).sort({ order: 1, createdAt: -1 });
    console.log('🔄 Catégories mises à jour récupérées:', updatedCategories.length);

    return NextResponse.json({
      success: true,
      message: 'Ordre des catégories mis à jour avec succès',
      categories: updatedCategories,
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Erreur lors de la réorganisation des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la réorganisation des catégories'
    }, { status: 500 });
  }
}

// GET - Récupérer l'ordre actuel des catégories
export async function GET(_request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const categories = await Category.find({}, { _id: 1, name: 1, order: 1 })
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      categories: categories.map(cat => ({
        _id: cat._id,
        name: cat.name,
        order: cat.order
      }))
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ordre des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération de l\'ordre des catégories'
    }, { status: 500 });
  }
}
