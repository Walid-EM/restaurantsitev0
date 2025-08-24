import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// Configuration pour désactiver le body parser par défaut
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fonction supprimée - Le redimensionnement se fait maintenant côté client

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API upload-to-git appelée');
    
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

    // TEST DIAGNOSTIC : Test de redimensionnement supprimé (Sharp sera testé dans resizeImageIfNeeded)

    // Convertir le fichier en buffer
    console.log('🔄 Conversion du fichier en buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`📊 Buffer créé: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // L'image est déjà redimensionnée côté client si nécessaire
    // Utiliser directement le buffer reçu (plus de redimensionnement côté serveur)
    const optimizedBuffer = buffer;
    console.log(`📊 Buffer utilisé directement: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Vérifier que la taille est acceptable
    if (optimizedBuffer.length > 4.5 * 1024 * 1024) {
      console.warn(`⚠️ Attention: L'image fait encore ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
      // Retourner une erreur car l'image devrait être redimensionnée côté client
      return NextResponse.json({ 
        error: 'Image trop volumineuse. Redimensionnez côté client avant l\'upload.',
        originalSize: file.size,
        currentSize: optimizedBuffer.length
      }, { status: 400 });
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
