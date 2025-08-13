import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// Route de test SANS vérification admin pour isoler le problème
export async function GET() {
  try {
    console.log('🔍 Test API - Tentative de connexion à MongoDB...');
    
    await connectDB();
    console.log('✅ MongoDB connecté avec succès');
    
    const categories = await Category.find({}).sort({ createdAt: -1 });
    console.log(`✅ ${categories.length} catégories récupérées`);
    
    return NextResponse.json({
      success: true,
      message: 'Test réussi - Pas de vérification admin',
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
