import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    
    // Vérifier si le dossier existe
    try {
      await stat(uploadsDir);
    } catch (error) {
      // Si le dossier n'existe pas, retourner une liste vide
      return NextResponse.json({
        success: true,
        images: []
      });
    }

    // Lire le contenu du dossier
    const files = await readdir(uploadsDir);
    
    // Filtrer les fichiers d'images et obtenir leurs informations
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    const images = await Promise.all(
      imageFiles.map(async (fileName) => {
        try {
          const filePath = path.join(uploadsDir, fileName);
          const fileStats = await stat(filePath);
          
          return {
            name: fileName,
            path: `/public/images/uploads/${fileName}`,
            size: fileStats.size,
            lastModified: fileStats.mtime
          };
        } catch (error) {
          console.error(`Erreur lors de la lecture du fichier ${fileName}:`, error);
          return {
            name: fileName,
            path: `/public/images/uploads/${fileName}`,
            size: undefined,
            lastModified: undefined
          };
        }
      })
    );

    // Trier par date de modification (plus récent en premier)
    images.sort((a, b) => {
      if (!a.lastModified || !b.lastModified) return 0;
      return b.lastModified.getTime() - a.lastModified.getTime();
    });

    return NextResponse.json({
      success: true,
      images: images,
      total: images.length,
      directory: '/public/images/uploads'
    });

  } catch (error) {
    console.error('Erreur lors de la lecture des images locales:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la lecture des images locales',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
