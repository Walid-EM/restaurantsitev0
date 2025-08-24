import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET() {
  try {
    console.log('🧪 Test de Sharp...');
    
    // Vérifier que Sharp est disponible
    if (typeof sharp === 'undefined') {
      console.log('❌ Sharp n\'est pas disponible');
      return NextResponse.json({ 
        success: false, 
        error: 'Sharp n\'est pas disponible',
        sharpAvailable: false 
      });
    }
    
    console.log('✅ Sharp importé avec succès');
    
    // Vérifier la version de Sharp
    const sharpVersion = sharp.versions;
    console.log('📦 Version Sharp:', sharpVersion);
    
    // Test simple de création d'image
    try {
      const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      const resized = await sharp(testBuffer)
        .resize(100, 100)
        .png()
        .toBuffer();
      
      console.log('✅ Test de redimensionnement réussi');
      console.log(`📊 Taille originale: ${testBuffer.length} bytes`);
      console.log(`📊 Taille redimensionnée: ${resized.length} bytes`);
      
      return NextResponse.json({
        success: true,
        sharpAvailable: true,
        sharpVersion,
        testResize: {
          originalSize: testBuffer.length,
          resizedSize: resized.length,
          success: true
        }
      });
      
    } catch (resizeError) {
      console.error('❌ Erreur test redimensionnement:', resizeError);
      return NextResponse.json({
        success: false,
        sharpAvailable: true,
        sharpVersion,
        testResize: {
          success: false,
          error: resizeError instanceof Error ? resizeError.message : 'Erreur inconnue'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur générale test Sharp:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur générale',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
