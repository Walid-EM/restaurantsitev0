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
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
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
    const { name, description, image } = body;

    // Validation
    if (!name || !description || !image) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    await connectDB();
    const category = new Category({
      name,
      description,
      image
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
