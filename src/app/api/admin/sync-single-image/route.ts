import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Télécharger l'image depuis Cloudinary
    const imageBuffer = await new Promise<Buffer>(async (resolve, reject) => {
      try {
        // Utiliser l'API Cloudinary de manière synchrone
        const result = await cloudinary.api.resource(imageId);
        
        if (!result || !result.secure_url) {
          reject(new Error('URL de téléchargement non disponible'));
          return;
        }
        
        // Télécharger l'image en tant que buffer
        const downloadUrl = result.secure_url;
        const response = await fetch(downloadUrl);
        
        if (!response.ok) {
          reject(new Error(`Erreur HTTP: ${response.status}`));
          return;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        resolve(Buffer.from(arrayBuffer));
      } catch (error) {
        reject(error);
      }
    });

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
        size: imageBuffer.length
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
