import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Extra from '@/models/Extra';

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
    
    const extras = await Extra.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      extras,
      count: extras.length
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des extras:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des extras',
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
    
    const extra = new Extra(body);
    const savedExtra = await extra.save();
    
    return NextResponse.json({
      success: true,
      extra: savedExtra
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'extra:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de l\'extra',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
