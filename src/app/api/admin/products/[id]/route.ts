import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// Vérifier les permissions admin
async function checkAdminPermissions(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const params = await context.params;
    
    // Vérifier que l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de produit invalide'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { name, description, price, category, image } = body;

    if (!name || !price || !category) {
      return NextResponse.json({
        success: false,
        error: 'Nom, prix et catégorie sont requis'
      }, { status: 400 });
    }

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price,
        category,
        image,
        isAvailable: true
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Produit non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour du produit'
    }, { status: 500 });
  }
}

// Supprimer un produit
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const params = await context.params;
    
    // Vérifier que l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de produit invalide'
      }, { status: 400 });
    }
    
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Produit non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message d\'erreur:', error instanceof Error ? error.message : error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression du produit',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
