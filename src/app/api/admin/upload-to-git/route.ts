import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    // Toutes les images vont dans uploads/
    
    // 1. Valider le fichier
    if (!validateImageFile(file)) {
      return NextResponse.json({ error: 'Fichier invalide' }, { status: 400 });
    }
    
    // 2. Générer un ID unique pour l'image
    const imageId = generateUniqueImageId();
    const fileName = `${imageId}-${file.name}`;
    
    // 3. Convertir le fichier en base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');
    
    // 4. Uploader directement vers GitHub via l'API
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `public/images/uploads/${fileName}`, // Toutes les images dans uploads/
      message: `Ajout image: ${fileName} - ${new Date().toISOString()}`,
      content: base64Content,
      branch: process.env.GITHUB_BRANCH || 'main',
    });
    
    // 5. Retourner les informations de l'image
    return NextResponse.json({
      success: true,
      imageId,
      fileName,
      gitPath: `/images/uploads/${fileName}`, // Toutes les images dans uploads/
      githubUrl: response.data.content?.html_url,
      message: 'Image ajoutée directement au repository Git'
    });
    
  } catch (error) {
    console.error('Erreur upload vers Git:', error);
    return NextResponse.json(
      { error: 'Erreur upload vers Git' },
      { status: 500 }
    );
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
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}
