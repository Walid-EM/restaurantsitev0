import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Accompagnement from '@/models/Accompagnement';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer tous les accompagnements actifs
    const accompagnements = await Accompagnement.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      accompagnements: accompagnements,
      count: accompagnements.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des accompagnements:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des accompagnements' },
      { status: 500 }
    );
  }
}
