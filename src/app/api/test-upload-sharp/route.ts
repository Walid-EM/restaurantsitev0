import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 TEST UPLOAD SHARP - Début');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.log('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log(`📁 Fichier reçu: ${file.name}`);
    console.log(`📊 Taille originale: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎨 Type MIME: ${file.type}`);

    // Convertir le fichier en buffer
    console.log('🔄 Conversion du fichier en buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`📊 Buffer créé: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Test Sharp directement (même logique que l'API d'upload)
    console.log('🔄 Test Sharp direct...');
    
    // Import dynamique de Sharp
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
    
    if (typeof sharp.default === 'undefined') {
      console.error('❌ Sharp.default non disponible');
      return NextResponse.json({ 
        error: 'Sharp.default non disponible',
        sharpType: typeof sharp,
        sharpKeys: Object.keys(sharp)
      }, { status: 500 });
    }
    
    console.log('✅ Sharp.default disponible');
    console.log('✅ Version Sharp:', sharp.default.versions?.sharp || 'Version inconnue');
    
    // Test de redimensionnement simple
    try {
      console.log('🔄 Test redimensionnement 50x50...');
      const resized = await sharp.default(buffer).resize(50, 50).png().toBuffer();
      console.log('✅ Redimensionnement réussi:', resized.length, 'bytes');
      
      const reduction = ((1 - resized.length / buffer.length) * 100).toFixed(1);
      console.log(`📉 Réduction: ${reduction}%`);
      
      return NextResponse.json({
        success: true,
        originalSize: buffer.length,
        resizedSize: resized.length,
        reduction: `${reduction}%`,
        message: 'Sharp fonctionne parfaitement !'
      });
      
    } catch (resizeError) {
      console.error('❌ Erreur redimensionnement:', resizeError);
      return NextResponse.json({
        success: false,
        error: 'Erreur redimensionnement',
        details: resizeError instanceof Error ? resizeError.message : 'Erreur inconnue',
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
