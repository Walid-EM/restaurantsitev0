import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API upload-multiple-to-git appelée');
    
    // Vérifier les variables d'environnement
    console.log('🔧 Variables d\'environnement:');
    console.log('- GITHUB_OWNER:', process.env.GITHUB_OWNER);
    console.log('- GITHUB_REPO:', process.env.GITHUB_REPO);
    console.log('- GITHUB_BRANCH:', process.env.GITHUB_BRANCH);
    console.log('- GITHUB_ACCESS_TOKEN:', process.env.GITHUB_ACCESS_TOKEN ? '✅ Présent' : '❌ Manquant');
    
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    console.log('📁 Fichiers reçus:', files.length);
    
    if (!files || files.length === 0) {
      console.log('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }
    
    // 1. Valider tous les fichiers
    const validFiles = files.filter(validateImageFile);
    console.log('✅ Fichiers valides:', validFiles.length);
    
    if (validFiles.length === 0) {
      console.log('❌ Aucun fichier valide');
      return NextResponse.json({ error: 'Aucun fichier valide' }, { status: 400 });
    }
    
    // 2. Uploader chaque fichier individuellement mais en lot
    const uploadedImages = [];
    const errors = [];
    
    for (const file of validFiles) {
      try {
        console.log(`🔄 Upload en cours: ${file.name}`);
        
        const imageId = generateUniqueImageId();
        const fileName = `${imageId}-${file.name}`;
        const filePath = `public/images/uploads/${fileName}`;
        
        console.log(`📝 ID généré: ${imageId}`);
        console.log(`📁 Chemin fichier: ${filePath}`);
        
        // Convertir le fichier en base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Content = buffer.toString('base64');
        console.log(`📊 Taille base64: ${base64Content.length} caractères`);
        
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
          size: file.size,
          type: file.type,
          githubUrl: response.data.content?.html_url,
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

function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 35 * 1024 * 1024; // 35MB
  
  console.log(`🔍 Validation du fichier: ${file.name}`);
  console.log(`   - Type MIME: "${file.type}"`);
  console.log(`   - Taille: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`   - Types autorisés: ${allowedTypes.join(', ')}`);
  console.log(`   - Taille max: ${maxSize} bytes (${(maxSize / 1024 / 1024).toFixed(2)} MB)`);
  
  const typeValid = allowedTypes.includes(file.type);
  const sizeValid = file.size <= maxSize;
  
  console.log(`   - Type valide: ${typeValid ? '✅' : '❌'}`);
  console.log(`   - Taille valide: ${sizeValid ? '✅' : '❌'}`);
  console.log(`   - Résultat final: ${typeValid && sizeValid ? '✅ VALIDÉ' : '❌ REJETÉ'}`);
  
  return typeValid && sizeValid;
}
