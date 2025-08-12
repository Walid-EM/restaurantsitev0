import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Extra from '@/models/Extra';

// Vérifier les permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// GET - Récupérer tous les suppléments
export async function GET() {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const extras = await Extra.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      extras,
      count: extras.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des suppléments:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des suppléments'
    }, { status: 500 });
  }
}

// POST - Créer un nouveau supplément
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, category } = body;

    // Validation
    if (!name || !description || !price || !category) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    await connectDB();
    const extra = new Extra({
      name,
      description,
      price: parseFloat(price),
      category
    });

    await extra.save();

    return NextResponse.json({
      success: true,
      message: 'Supplément créé avec succès',
      extra
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du supplément:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du supplément'
    }, { status: 500 });
  }
}
