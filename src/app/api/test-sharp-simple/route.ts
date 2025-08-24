import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 TEST SHARP SIMPLE - Début');
    
    // Test 1: Vérifier si Sharp est importable
    let sharp;
    try {
      sharp = await import('sharp');
      console.log('✅ Import Sharp réussi');
    } catch (importError) {
      console.error('❌ Erreur import Sharp:', importError);
      return NextResponse.json({ 
        error: 'Import Sharp échoué',
        details: importError instanceof Error ? importError.message : 'Erreur inconnue'
      }, { status: 500 });
    }
    
    // Test 2: Vérifier si Sharp est fonctionnel
    if (!sharp.default) {
      console.error('❌ Sharp.default non disponible');
      return NextResponse.json({ 
        error: 'Sharp.default non disponible',
        sharpType: typeof sharp,
        sharpKeys: Object.keys(sharp)
      }, { status: 500 });
    }
    
    console.log('✅ Sharp.default disponible');
    
    // Test 3: Test de redimensionnement simple
    try {
      const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      console.log('🧪 Buffer de test créé:', testBuffer.length, 'bytes');
      
      const resized = await sharp.default(testBuffer).resize(50, 50).png().toBuffer();
      console.log('✅ Redimensionnement réussi:', resized.length, 'bytes');
      
      return NextResponse.json({
        success: true,
        sharpAvailable: true,
        testResize: 'success',
        originalSize: testBuffer.length,
        resizedSize: resized.length
      });
      
    } catch (resizeError) {
      console.error('❌ Erreur redimensionnement:', resizeError);
      return NextResponse.json({
        success: false,
        sharpAvailable: true,
        testResize: 'failed',
        error: resizeError instanceof Error ? resizeError.message : 'Erreur inconnue',
        stack: resizeError instanceof Error ? resizeError.stack : 'Pas de stack trace'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur générale',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
