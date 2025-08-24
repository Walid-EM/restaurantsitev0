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
    
    // Test avec une image de test plus réaliste
    try {
      // Créer une image de test plus grande (100x100 pixels avec des couleurs)
      const testImageBuffer = Buffer.from(`
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#ff6b6b"/>
          <circle cx="50" cy="50" r="30" fill="#4ecdc4"/>
          <text x="50" y="60" text-anchor="middle" fill="white" font-size="12">TEST</text>
        </svg>
      `);
      
      // Convertir SVG en PNG avec Sharp
      const originalPng = await sharp(testImageBuffer)
        .png()
        .toBuffer();
      
      console.log(`📊 Taille originale: ${(originalPng.length / 1024).toFixed(2)} KB`);
      
      // Test de redimensionnement vers le bas (50x50)
      const resizedDown = await sharp(originalPng)
        .resize(50, 50, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 85 })
        .toBuffer();
      
      console.log(`📊 Taille redimensionnée (50x50): ${(resizedDown.length / 1024).toFixed(2)} KB`);
      
      // Test de redimensionnement vers le haut (200x200)
      const resizedUp = await sharp(originalPng)
        .resize(200, 200, {
          fit: 'inside'
        })
        .png({ quality: 85 })
        .toBuffer();
      
      console.log(`📊 Taille redimensionnée (200x200): ${(resizedUp.length / 1024).toFixed(2)} KB`);
      
      // Test de compression avec qualité réduite
      const compressed = await sharp(originalPng)
        .png({ quality: 50 })
        .toBuffer();
      
      console.log(`📊 Taille compressée (qualité 50%): ${(compressed.length / 1024).toFixed(2)} KB`);
      
      const results = {
        original: {
          size: originalPng.length,
          sizeKB: (originalPng.length / 1024).toFixed(2)
        },
        resizedDown: {
          size: resizedDown.length,
          sizeKB: (resizedDown.length / 1024).toFixed(2),
          reduction: ((1 - resizedDown.length / originalPng.length) * 100).toFixed(1)
        },
        resizedUp: {
          size: resizedUp.length,
          sizeKB: (resizedUp.length / 1024).toFixed(2),
          increase: ((resizedUp.length / originalPng.length - 1) * 100).toFixed(1)
        },
        compressed: {
          size: compressed.length,
          sizeKB: (compressed.length / 1024).toFixed(2),
          reduction: ((1 - compressed.length / originalPng.length) * 100).toFixed(1)
        }
      };
      
      console.log('✅ Tests de redimensionnement et compression réussis');
      console.log('📊 Résultats:', results);
      
      return NextResponse.json({
        success: true,
        sharpAvailable: true,
        sharpVersion,
        testResults: results,
        message: 'Tests complets de redimensionnement et compression'
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
