import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function GET() {
  try {
    console.log('🚀 API list-uploaded-images appelée');
    
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

    try {
      // Lister le contenu du dossier public/images/uploads via l'API GitHub
      const response = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'public/images/uploads',
        ref: process.env.GITHUB_BRANCH || 'main',
      });

      console.log('✅ Réponse GitHub reçue');

      if (Array.isArray(response.data)) {
        // Filtrer seulement les fichiers images
        const imageFiles = response.data
          .filter(item => item.type === 'file')
          .filter(item => {
            const fileName = item.name.toLowerCase();
            return fileName.endsWith('.jpg') || 
                   fileName.endsWith('.jpeg') || 
                   fileName.endsWith('.png') || 
                   fileName.endsWith('.gif') || 
                   fileName.endsWith('.webp');
          })
          .map(item => ({
            name: item.name,
            path: `/images/uploads/${item.name}`,
            size: item.size,
            url: item.download_url,
            sha: item.sha
          }));

        console.log(`📁 ${imageFiles.length} images trouvées dans /public/images/uploads`);

        return NextResponse.json({
          success: true,
          images: imageFiles,
          total: imageFiles.length
        });

      } else {
        console.log('❌ Le dossier public/images/uploads n\'existe pas ou n\'est pas un dossier');
        return NextResponse.json({
          success: true,
          images: [],
          total: 0,
          message: 'Le dossier public/images/uploads n\'existe pas encore'
        });
      }

    } catch (githubError: unknown) {
      if (typeof githubError === 'object' && githubError !== null && 'status' in githubError) {
        const error = githubError as { status?: number; message?: string };
        if (error.status === 404) {
          console.log('📁 Dossier public/images/uploads non trouvé - probablement vide');
          return NextResponse.json({
            success: true,
            images: [],
            total: 0,
            message: 'Aucune image uploadée pour le moment'
          });
        }
      }
      
      console.error('❌ Erreur API GitHub:', githubError);
      throw githubError;
    }

  } catch (error) {
    console.error('❌ Erreur générale list-uploaded-images:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des images', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}
