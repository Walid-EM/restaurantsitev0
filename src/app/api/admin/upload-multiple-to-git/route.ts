import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import sharp from 'sharp';

// Configuration pour désactiver le body parser par défaut
export const config = {
  api: {
    bodyParser: false,
  },
};

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// Fonction de redimensionnement automatique
async function resizeImageIfNeeded(buffer: Buffer, maxSizeBytes: number = 4.5 * 1024 * 1024): Promise<Buffer> {
  try {
    // Vérifier la taille actuelle
    if (buffer.length <= maxSizeBytes) {
      console.log(`✅ Image déjà dans la limite (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
      return buffer;
    }

    console.log(`🔄 Redimensionnement nécessaire: ${(buffer.length / 1024 / 1024).toFixed(2)} MB > ${(maxSizeBytes / 1024 / 1024).toFixed(2)} MB`);

    // Analyser l'image
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      console.log('⚠️ Impossible de lire les métadonnées, retour de l\'image originale');
      return buffer;
    }

    console.log(`📐 Dimensions originales: ${metadata.width}x${metadata.height}`);

    // Calculer le ratio de réduction nécessaire
    const currentSizeMB = buffer.length / 1024 / 1024;
    const targetSizeMB = maxSizeBytes / 1024 / 1024;
    const reductionRatio = Math.sqrt(targetSizeMB / currentSizeMB);
    
    // Appliquer une marge de sécurité (90% de la taille cible)
    const safeReductionRatio = reductionRatio * 0.9;
    
    const newWidth = Math.round(metadata.width * safeReductionRatio);
    const newHeight = Math.round(metadata.height * safeReductionRatio);

    console.log(`🎯 Nouvelles dimensions: ${newWidth}x${newHeight} (ratio: ${safeReductionRatio.toFixed(3)})`);

    // Redimensionner l'image avec une qualité optimisée
    let resizedBuffer = await image
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

    // Vérifier si le redimensionnement a suffi
    if (resizedBuffer.length > maxSizeBytes) {
      console.log(`⚠️ Premier redimensionnement insuffisant: ${(resizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
      
      // Réduire encore plus la qualité
      resizedBuffer = await sharp(resizedBuffer)
        .jpeg({ quality: 70 })
        .png({ quality: 70 })
        .webp({ quality: 70 })
        .toBuffer();
      
      console.log(`🔄 Deuxième redimensionnement: ${(resizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    }

    const finalSizeMB = resizedBuffer.length / 1024 / 1024;
    console.log(`✅ Redimensionnement terminé: ${finalSizeMB.toFixed(2)} MB (réduction: ${((1 - finalSizeMB / currentSizeMB) * 100).toFixed(1)}%)`);

    return resizedBuffer;

  } catch (error) {
    console.error('❌ Erreur lors du redimensionnement:', error);
    console.log('⚠️ Retour de l\'image originale');
    return buffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API upload-multiple-to-git appelée');
    
    // Vérifier les variables d'environnement
    console.log('🔧 Variables d\'environnement:');
    console.log('- GITHUB_OWNER:', process.env.GITHUB_OWNER);
    console.log('- GITHUB_REPO:', process.env.GITHUB_REPO);
    console.log('- GITHUB_BRANCH:', process.env.GITHUB_BRANCH);
    console.log('- GITHUB_ACCESS_TOKEN:', process.env.GITHUB_ACCESS_TOKEN ? '✅ Présent' : '❌ Manquant');
    
    if (!process.env.GITHUB_ACCESS_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      return NextResponse.json({ 
        error: 'Configuration GitHub manquante' 
      }, { status: 500 });
    }
    
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    console.log('📁 Fichiers reçus:', files.length);
    
    if (!files || files.length === 0) {
      console.log('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }
    
    // 1. Valider tous les fichiers
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(file.type);
    });
    
    console.log('✅ Fichiers valides:', validFiles.length);
    
    if (validFiles.length === 0) {
      console.log('❌ Aucun fichier valide');
      return NextResponse.json({ error: 'Aucun fichier valide' }, { status: 400 });
    }
    
    // 2. Uploader chaque fichier individuellement avec redimensionnement
    const uploadedImages = [];
    const errors = [];
    
    for (const file of validFiles) {
      try {
        console.log(`🔄 Upload en cours: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        const imageId = generateUniqueImageId();
        const fileName = `${imageId}-${file.name}`;
        const filePath = `public/images/uploads/${fileName}`;
        
        console.log(`📝 ID généré: ${imageId}`);
        console.log(`📁 Chemin fichier: ${filePath}`);
        
        // Convertir le fichier en buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Redimensionner automatiquement si nécessaire
        const optimizedBuffer = await resizeImageIfNeeded(buffer);
        
        console.log(`📊 Taille finale: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        
        // Convertir en base64
        const base64Content = optimizedBuffer.toString('base64');
        
        // Uploader vers GitHub
        console.log('🌐 Appel API GitHub...');
        const response = await octokit.repos.createOrUpdateFileContents({
          owner: process.env.GITHUB_OWNER!,
          repo: process.env.GITHUB_REPO!,
          path: filePath,
          message: `Ajout image: ${fileName}`,
          content: base64Content,
          branch: process.env.GITHUB_BRANCH || 'main',
        });
        
        console.log(`✅ Réponse GitHub reçue pour ${fileName}`);
        
        uploadedImages.push({
          imageId,
          fileName,
          gitPath: `/images/uploads/${fileName}`,
          size: optimizedBuffer.length,
          originalSize: file.size,
          type: file.type,
          githubUrl: response.data.content?.html_url,
          sizeReduction: file.size > optimizedBuffer.length ? 
            `${((1 - optimizedBuffer.length / file.size) * 100).toFixed(1)}%` : '0%'
        });
        
        console.log(`✅ Image uploadée: ${fileName}`);
        
      } catch (error) {
        console.error(`❌ Erreur upload ${file.name}:`, error);
        errors.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }
    
    console.log(`📊 Résumé: ${uploadedImages.length} succès, ${errors.length} erreurs`);
    
    // 3. Retourner le résultat
    if (uploadedImages.length > 0) {
      const response = {
        success: true,
        message: `${uploadedImages.length} image(s) uploadée(s) avec succès`,
        images: uploadedImages,
        errors: errors.length > 0 ? errors : undefined,
        totalProcessed: validFiles.length,
        successCount: uploadedImages.length,
        errorCount: errors.length,
      };
      
      console.log('📤 Réponse de succès:', response);
      return NextResponse.json(response);
    } else {
      const response = {
        success: false,
        error: 'Aucune image n\'a pu être uploadée',
        errors: errors,
        totalProcessed: validFiles.length,
        successCount: 0,
        errorCount: errors.length,
      };
      
      console.log('📤 Réponse d\'erreur:', response);
      return NextResponse.json(response, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Erreur générale upload multiple vers Git:', error);
    const response = { 
      success: false,
      error: 'Erreur upload multiple vers Git', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
    
    console.log('📤 Réponse d\'erreur générale:', response);
    return NextResponse.json(response, { status: 500 });
  }
}

function generateUniqueImageId(): string {
  // Format: img-YYYYMMDD-HHMMSS-XXXXX
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').slice(0, 15);
  const random = Math.random().toString(36).substring(2, 7);
  return `img-${timestamp}-${random}`;
}
