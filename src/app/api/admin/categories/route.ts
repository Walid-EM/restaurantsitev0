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

// GET - Récupérer toutes les catégories
export async function GET(_request: NextRequest) {
  try {
    console.log('🔄 API categories GET appelée');
    
    if (!(await checkAdminPermissions(_request))) {
      console.log('❌ Permissions refusées');
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    console.log('✅ Permissions vérifiées, connexion à MongoDB...');
    await connectDB();
    
    console.log('📊 Récupération des catégories AVANT tri...');
    const categoriesBeforeSort = await Category.find({});
    console.log(`📋 ${categoriesBeforeSort.length} catégories trouvées avant tri`);
    categoriesBeforeSort.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} - order: ${cat.order}, _id: ${cat._id}`);
    });
    
    console.log('🔄 Application du tri: { order: 1, createdAt: -1 }');
    const categories = await Category.find({}).sort({ order: 1, createdAt: -1 });
    
    console.log(`📋 ${categories.length} catégories récupérées APRÈS tri`);
    console.log('📝 Détail des catégories triées:');
    categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} - order: ${cat.order}, createdAt: ${cat.createdAt}, _id: ${cat._id}`);
    });
    
    return NextResponse.json({
      success: true,
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des catégories'
    }, { status: 500 });
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, image, allowedOptions = [] } = body;

    // Validation
    if (!name || !description || !image) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    // Déterminer l'ordre automatiquement
    const lastCategory = await Category.findOne().sort({ order: -1 });
    const nextOrder = (lastCategory?.order || 0) + 1;

    // Validation des options autorisées
    const validOptions = ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'];
    if (allowedOptions.some((option: string) => !validOptions.includes(option))) {
      return NextResponse.json({
        success: false,
        error: 'Options non valides'
      }, { status: 400 });
    }

    await connectDB();
    const category = new Category({
      name,
      description,
      image,
      allowedOptions,
      order: nextOrder
    });

    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Catégorie créée avec succès',
      category
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de la catégorie'
    }, { status: 500 });
  }
}
