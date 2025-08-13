import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Boisson from '@/models/Boisson';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer toutes les boissons actives
    const boissons = await Boisson.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      boissons: boissons,
      count: boissons.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des boissons:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des boissons' },
      { status: 500 }
    );
  }
}
