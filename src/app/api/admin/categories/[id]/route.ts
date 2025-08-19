import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// Vérifier les permissions admin
async function checkAdminPermissions(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// PUT - Mettre à jour une catégorie
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, image, allowedOptions = [], isActive } = body;

    // Validation
    if (!name || !description || !image) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    // Validation des options autorisées
    const validOptions = ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'];
    if (allowedOptions.some((option: string) => !validOptions.includes(option))) {
      return NextResponse.json({
        success: false,
        error: 'Options non valides'
      }, { status: 400 });
    }

    await connectDB();
    
    const updateData = {
      name,
      description,
      image,
      allowedOptions,
      ...(isActive !== undefined && { isActive })
    };

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Catégorie non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      category
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour de la catégorie'
    }, { status: 500 });
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;

    await connectDB();
    
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Catégorie non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression de la catégorie'
    }, { status: 500 });
  }
}

