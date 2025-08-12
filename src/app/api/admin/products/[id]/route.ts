import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

// Vérifier les permissions admin
async function checkAdminPermissions(_request: NextRequest) {
  // Cette fonction sera implémentée plus tard avec NextAuth
  // Pour l'instant, on laisse passer
  return true;
}

// Mettre à jour un produit
export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await _request.json();
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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
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
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression du produit'
    }, { status: 500 });
  }
}
