import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

// Vérifier les permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// GET - Récupérer tous les produits
export async function GET() {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des produits'
    }, { status: 500 });
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, category, image, extras } = body;

    // Validation
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    await connectDB();
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      extras: extras || []
    });

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Produit créé avec succès',
      product
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du produit'
    }, { status: 500 });
  }
}
