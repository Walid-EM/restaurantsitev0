import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Sauce from '@/models/Sauce';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer toutes les sauces actives
    const sauces = await Sauce.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      sauces: sauces,
      count: sauces.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sauces:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des sauces' },
      { status: 500 }
    );
  }
}
