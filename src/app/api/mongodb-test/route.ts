import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Tentative de connexion MongoDB...');
    
    // Test simple de connexion
    const mongoose = await connectDB();
    console.log('Connexion MongoDB établie');
    
    // Vérifier que la connexion est active
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`État de la connexion: ${mongoose.connection.readyState}`);
    }
    
    console.log('Base de données accessible');
    
    // Vérifier que la base de données existe
    if (!mongoose.connection.db) {
      throw new Error('Base de données non accessible');
    }
    
    // Lister les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections trouvées:', collections.length);
    
    return NextResponse.json({
      success: true,
      message: 'Connexion MongoDB réussie !',
      database: 'FristDB',
      collections: collections.map((col: any) => col.name),
      timestamp: new Date().toISOString(),
      connectionState: mongoose.connection.readyState
    });
    
  } catch (error) {
    console.error('Erreur détaillée MongoDB:', error);
    
    // Retourner plus de détails sur l'erreur
    return NextResponse.json({
      success: false,
      message: 'Erreur de connexion MongoDB',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
