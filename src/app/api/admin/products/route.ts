import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

async function checkAdminPermissions(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

export async function GET(_request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(_request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des produits',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();
    
    const product = new Product(body);
    const savedProduct = await product.save();
    
    return NextResponse.json({
      success: true,
      product: savedProduct
    });
    
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du produit',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
