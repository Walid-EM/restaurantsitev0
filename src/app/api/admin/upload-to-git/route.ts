import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import sharp from 'sharp';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// Configuration pour désactiver le body parser par défaut
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fonction de redimensionnement automatique
async function resizeImageIfNeeded(buffer: Buffer, maxSizeBytes: number = 4.5 * 1024 * 1024): Promise<Buffer> {
  try {
    console.log(`🔍 Vérification de la taille: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎯 Limite cible: ${(maxSizeBytes / 1024 / 1024).toFixed(2)} MB`);
    
    // Vérifier que Sharp est disponible
    if (typeof sharp === 'undefined') {
      console.error('❌ Sharp n\'est pas disponible');
      console.error('❌ Type de sharp:', typeof sharp);
      return buffer;
    }
    
    console.log('✅ Sharp est disponible');
    console.log('✅ Version Sharp:', sharp.versions?.sharp || 'Version inconnue');
    
    // Vérifier la taille actuelle
    if (buffer.length <= maxSizeBytes) {
      console.log(`✅ Image déjà dans la limite (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
      return buffer;
    }

    console.log(`🔄 Redimensionnement nécessaire: ${(buffer.length / 1024 / 1024).toFixed(2)} MB > ${(maxSizeBytes / 1024 / 1024).toFixed(2)} MB`);

    // Analyser l'image
    console.log('📊 Analyse des métadonnées...');
    let image;
    try {
      image = sharp(buffer);
      console.log('✅ Image Sharp créée avec succès');
    } catch (sharpError) {
      console.error('❌ Erreur création image Sharp:', sharpError);
      return buffer;
    }
    
    let metadata;
    try {
      metadata = await image.metadata();
      console.log('✅ Métadonnées récupérées avec succès');
    } catch (metadataError) {
      console.error('❌ Erreur récupération métadonnées:', metadataError);
      return buffer;
    }
    
    if (!metadata.width || !metadata.height) {
      console.log('⚠️ Impossible de lire les métadonnées, retour de l\'image originale');
      console.log('📊 Métadonnées reçues:', metadata);
      return buffer;
    }

    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);
    console.log(`🎨 Format: ${metadata.format}`);
    console.log(`🌈 Espace colorimétrique: ${metadata.space}`);

    // Calculer le ratio de réduction nécessaire
    const currentSizeMB = buffer.length / 1024 / 1024;
    const targetSizeMB = maxSizeBytes / 1024 / 1024;
    const reductionRatio = Math.sqrt(targetSizeMB / currentSizeMB);
    
    // Appliquer une marge de sécurité (90% de la taille cible)
    const safeReductionRatio = reductionRatio * 0.9;
    
    const newWidth = Math.round(metadata.width * safeReductionRatio);
    const newHeight = Math.round(metadata.height * safeReductionRatio);

    console.log(`🎯 Ratio de réduction calculé: ${reductionRatio.toFixed(3)}`);
    console.log(`🛡️ Ratio avec marge de sécurité: ${safeReductionRatio.toFixed(3)}`);
    console.log(`📐 Nouvelles dimensions: ${newWidth}x${newHeight}`);

    // Redimensionner l'image avec une qualité optimisée
    console.log('🔄 Premier redimensionnement (qualité 85%)...');
    let resizedBuffer;
    
    try {
      resizedBuffer = await image
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 85, // Qualité JPEG optimale
          progressive: true 
        })
        .png({ 
          quality: 85, // Qualité PNG optimale
          progressive: true 
        })
        .webp({ 
          quality: 85, // Qualité WebP optimale
          effort: 4 // Niveau de compression
        })
        .toBuffer();
      
      console.log('✅ Premier redimensionnement réussi');
    } catch (resizeError) {
      console.error('❌ Erreur premier redimensionnement:', resizeError);
      console.error('❌ Stack trace:', resizeError instanceof Error ? resizeError.stack : 'Pas de stack trace');
      return buffer;
    }

    const firstPassSizeMB = resizedBuffer.length / 1024 / 1024;
    console.log(`📊 Taille après premier passage: ${firstPassSizeMB.toFixed(2)} MB`);
    console.log(`📉 Réduction: ${((1 - firstPassSizeMB / currentSizeMB) * 100).toFixed(1)}%`);

    // Vérifier si le redimensionnement a suffi
    if (resizedBuffer.length > maxSizeBytes) {
      console.log(`⚠️ Premier redimensionnement insuffisant: ${firstPassSizeMB.toFixed(2)} MB > ${(maxSizeBytes / 1024 / 1024).toFixed(2)} MB`);
      
      console.log('🔄 Deuxième redimensionnement (qualité 70%)...');
      try {
        // Réduire encore plus la qualité
        resizedBuffer = await sharp(resizedBuffer)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .webp({ quality: 70 })
          .toBuffer();
        
        console.log('✅ Deuxième redimensionnement réussi');
      } catch (secondPassError) {
        console.error('❌ Erreur deuxième redimensionnement:', secondPassError);
        console.error('❌ Stack trace:', secondPassError instanceof Error ? secondPassError.stack : 'Pas de stack trace');
        // Continuer avec le premier résultat
      }
      
      const secondPassSizeMB = resizedBuffer.length / 1024 / 1024;
      console.log(`📊 Taille après deuxième passage: ${secondPassSizeMB.toFixed(2)} MB`);
      console.log(`📉 Réduction totale: ${((1 - secondPassSizeMB / currentSizeMB) * 100).toFixed(1)}%`);
    }

    const finalSizeMB = resizedBuffer.length / 1024 / 1024;
    console.log(`✅ Redimensionnement terminé: ${finalSizeMB.toFixed(2)} MB (réduction: ${((1 - finalSizeMB / currentSizeMB) * 100).toFixed(1)}%)`);
    console.log(`🎯 Limite respectée: ${resizedBuffer.length <= maxSizeBytes ? '✅ OUI' : '❌ NON'}`);

    return resizedBuffer;

  } catch (error) {
    console.error('❌ Erreur lors du redimensionnement:', error);
    console.error('❌ Détails de l\'erreur:', error instanceof Error ? error.stack : 'Erreur inconnue');
    console.log('⚠️ Retour de l\'image originale');
    return buffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API upload-to-git appelée');
    
    // TEST DIAGNOSTIC : Vérifier Sharp immédiatement
    console.log('🔍 DIAGNOSTIC SHARP:');
    console.log('🔍 Type de sharp:', typeof sharp);
    console.log('🔍 Sharp disponible:', typeof sharp !== 'undefined');
    if (typeof sharp !== 'undefined') {
      console.log('🔍 Version Sharp:', sharp.versions?.sharp || 'Version inconnue');
    }
    
    // Vérifier les variables d'environnement
    if (!process.env.GITHUB_ACCESS_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      console.error('❌ Configuration GitHub manquante');
      return NextResponse.json({ 
        error: 'Configuration GitHub manquante' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.error('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation du fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error(`❌ Type de fichier non autorisé: ${file.type}`);
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    console.log(`📁 Fichier reçu: ${file.name}`);
    console.log(`📊 Taille originale: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎨 Type MIME: ${file.type}`);

    // TEST DIAGNOSTIC : Test de redimensionnement simple
    console.log('🧪 TEST DIAGNOSTIC REDIMENSIONNEMENT:');
    try {
      const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      console.log('🧪 Taille test buffer:', testBuffer.length, 'bytes');
      
      if (typeof sharp !== 'undefined') {
        const testResized = await sharp(testBuffer).resize(50, 50).png().toBuffer();
        console.log('✅ Test redimensionnement réussi:', testResized.length, 'bytes');
      } else {
        console.log('❌ Sharp non disponible pour le test');
      }
    } catch (testError) {
      console.error('❌ Erreur test redimensionnement:', testError);
    }

    // Convertir le fichier en buffer
    console.log('🔄 Conversion du fichier en buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`📊 Buffer créé: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Redimensionner automatiquement si nécessaire
    console.log('🔄 Début du redimensionnement automatique...');
    const optimizedBuffer = await resizeImageIfNeeded(buffer);
    console.log(`📊 Buffer optimisé: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Vérifier que le redimensionnement a fonctionné
    if (optimizedBuffer.length > 4.5 * 1024 * 1024) {
      console.warn(`⚠️ Attention: L'image optimisée fait encore ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Générer un ID unique
    const imageId = generateUniqueImageId();
    const fileName = `${imageId}-${file.name}`;
    const filePath = `public/images/uploads/${fileName}`;
    
    console.log(`📝 ID généré: ${imageId}`);
    console.log(`📁 Chemin fichier: ${filePath}`);
    console.log(`📊 Taille finale: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Convertir en base64
    console.log('🔄 Conversion en base64...');
    const base64Content = optimizedBuffer.toString('base64');
    console.log(`📊 Contenu base64: ${(base64Content.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Upload vers GitHub
    console.log('🌐 Upload vers GitHub...');
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: filePath,
      message: `Ajout image: ${fileName}`,
      content: base64Content,
      branch: process.env.GITHUB_BRANCH || 'main',
    });

    console.log(`✅ Image uploadée avec succès: ${fileName}`);
    console.log(`🔗 URL GitHub: ${response.data.content?.html_url}`);

    const result = {
      success: true,
      imageId,
      fileName,
      gitPath: `/images/uploads/${fileName}`,
      githubUrl: response.data.content?.html_url,
      originalSize: file.size,
      optimizedSize: optimizedBuffer.length,
      sizeReduction: file.size > optimizedBuffer.length ? 
        `${((1 - optimizedBuffer.length / file.size) * 100).toFixed(1)}%` : '0%'
    };

    console.log('📤 Réponse de succès:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Erreur upload vers Git:', error);
    console.error('❌ Détails de l\'erreur:', error instanceof Error ? error.stack : 'Erreur inconnue');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de l\'upload', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}

function generateUniqueImageId(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').slice(0, 15);
  const random = Math.random().toString(36).substring(2, 7);
  return `img-${timestamp}-${random}`;
}
