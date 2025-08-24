import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function DELETE(request: NextRequest) {
  try {
    const { imageId, filePath } = await request.json();
    
    // 1. Récupérer le SHA du fichier actuel
    const { data: fileData } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: filePath.replace('/images/', 'public/images/'),
      branch: process.env.GITHUB_BRANCH || 'main',
    });
    
    if (Array.isArray(fileData)) {
      return NextResponse.json(
        { error: 'Chemin invalide' },
        { status: 400 }
      );
    }
    
    // 2. Supprimer le fichier du repository
    await octokit.repos.deleteFile({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: filePath.replace('/images/', 'public/images/'),
      message: `Suppression image: ${imageId} - ${new Date().toISOString()}`,
      sha: fileData.sha,
      branch: process.env.GITHUB_BRANCH || 'main',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Image supprimée du repository Git'
    });
    
  } catch (error) {
    console.error('Erreur suppression depuis Git:', error);
    return NextResponse.json(
      { error: 'Erreur suppression depuis Git' },
      { status: 500 }
    );
  }
}
