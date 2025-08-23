import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { cloudinaryUrl, imageName } = await request.json();

    if (!cloudinaryUrl) {
      return NextResponse.json(
        { success: false, error: 'URL Cloudinary requise' },
        { status: 400 }
      );
    }

    // Extraire l'ID de l'image depuis l'URL Cloudinary
    const urlParts = cloudinaryUrl.split('/');
    const imageId = urlParts[urlParts.length - 1];
    
    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Impossible d\'extraire l\'ID de l\'image' },
        { status: 400 }
      );
    }

    // Créer le dossier de destination s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Construire le nom du fichier local
    const fileName = imageName || imageId;
    const localFilePath = path.join(uploadsDir, fileName);
    const publicPath = `/public/images/uploads/${fileName}`;

    // Télécharger directement depuis l'URL Cloudinary
    const response = await fetch(cloudinaryUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Erreur lors du téléchargement: ${response.status}` },
        { status: 400 }
      );
    }

    // Convertir en buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Sauvegarder l'image localement
    await writeFile(localFilePath, imageBuffer);

    console.log(`✅ Image synchronisée: ${imageId} → ${localFilePath}`);

    return NextResponse.json({
      success: true,
      message: 'Image synchronisée avec succès',
      data: {
        cloudinaryId: imageId,
        localPath: publicPath,
        fileName: fileName,
        size: imageBuffer.length,
        originalUrl: cloudinaryUrl
      }
    });

  } catch (error) {
    console.error('Erreur lors de la synchronisation de l\'image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la synchronisation de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
