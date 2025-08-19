import { NextRequest, NextResponse } from 'next/server';

// GET - Test simple pour vérifier l'accessibilité
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API reorder accessible',
    timestamp: new Date().toISOString()
  });
}

// POST - Test avec des données factices
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test POST réussi',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test POST',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
