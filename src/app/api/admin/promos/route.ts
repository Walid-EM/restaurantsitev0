import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Promo from '@/models/Promo';

// Vérifier les permissions admin
async function checkAdminPermissions() {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// GET - Récupérer toutes les promotions
export async function GET() {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const promos = await Promo.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      promos,
      count: promos.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des promotions'
    }, { status: 500 });
  }
}

// POST - Créer une nouvelle promotion
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions())) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      code, 
      description, 
      discountType, 
      discountValue, 
      minimumOrder, 
      maxUses,
      validFrom,
      validUntil
    } = body;

    // Validation
    if (!code || !description || !discountType || !discountValue || !minimumOrder || !maxUses || !validFrom || !validUntil) {
      return NextResponse.json({
        success: false,
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    await connectDB();
    const promo = new Promo({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: parseFloat(discountValue),
      minimumOrder: parseFloat(minimumOrder),
      maxUses: parseInt(maxUses),
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil)
    });

    await promo.save();

    return NextResponse.json({
      success: true,
      message: 'Promotion créée avec succès',
      promo
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la promotion:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de la promotion'
    }, { status: 500 });
  }
}
