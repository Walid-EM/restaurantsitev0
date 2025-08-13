import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Supplement from '@/models/Supplement';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer tous les suppléments actifs
    const supplements = await Supplement.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      supplements: supplements,
      count: supplements.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des suppléments:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des suppléments' },
      { status: 500 }
    );
  }
}
