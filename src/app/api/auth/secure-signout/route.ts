import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // ✅ Réponse avec instructions de nettoyage
    const response = NextResponse.json({ 
      success: true, 
      message: 'Déconnexion sécurisée effectuée' 
    });

    // ✅ Supprimer tous les cookies de session
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.csrf-token');
    response.cookies.delete('__Host-next-auth.csrf-token');

    // ✅ Définir des cookies expirés pour forcer la suppression
    const expiredDate = new Date(0);
    
    response.cookies.set('next-auth.session-token', '', { 
      expires: expiredDate,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    response.cookies.set('next-auth.csrf-token', '', { 
      expires: expiredDate,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de la déconnexion sécurisée:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
