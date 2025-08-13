import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Extra from '@/models/Extra';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer tous les extras actifs
    const extras = await Extra.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      extras: extras,
      count: extras.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des extras:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des extras' },
      { status: 500 }
    );
  }
}
