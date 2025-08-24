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
    console.log('🚀 API upload-to-git appelée');
    
    // Vérifier les variables d'environnement
    if (!process.env.GITHUB_ACCESS_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      return NextResponse.json({ 
        error: 'Configuration GitHub manquante' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation du fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    console.log(`📁 Fichier reçu: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Redimensionner automatiquement si nécessaire
    const optimizedBuffer = await resizeImageIfNeeded(buffer);
    
    // Générer un ID unique
    const imageId = generateUniqueImageId();
    const fileName = `${imageId}-${file.name}`;
    const filePath = `public/images/uploads/${fileName}`;
    
    console.log(`📝 ID généré: ${imageId}`);
    console.log(`📁 Chemin fichier: ${filePath}`);
    console.log(`📊 Taille finale: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Convertir en base64
    const base64Content = optimizedBuffer.toString('base64');
    
    // Upload vers GitHub
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: filePath,
      message: `Ajout image: ${fileName}`,
      content: base64Content,
      branch: process.env.GITHUB_BRANCH || 'main',
    });

    console.log(`✅ Image uploadée avec succès: ${fileName}`);

    return NextResponse.json({
      success: true,
      imageId,
      fileName,
      gitPath: `/images/uploads/${fileName}`,
      githubUrl: response.data.content?.html_url,
      originalSize: file.size,
      optimizedSize: optimizedBuffer.length,
      sizeReduction: file.size > optimizedBuffer.length ? 
        `${((1 - optimizedBuffer.length / file.size) * 100).toFixed(1)}%` : '0%'
    });

  } catch (error) {
    console.error('❌ Erreur upload vers Git:', error);
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
