import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface SyncRequest {
  addedImages: Array<{
    id: string;
    publicId: string;
    url: string;
    format: string;
    width: number;
    height: number;
    size: number;
    tags: string[];
    folder: string;
  }>;
  removedImages: Array<{
    id: string;
    publicId: string;
    url: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { addedImages, removedImages } = body;

    console.log('🔄 Synchronisation Cloudinary:', {
      ajouts: addedImages.length,
      suppressions: removedImages.length
    });

    const results = {
      added: [] as any[],
      removed: [] as any[],
      errors: [] as string[]
    };

    // Ajouter les nouvelles images
    for (const image of addedImages) {
      try {
        console.log(`📤 Ajout de l'image: ${image.publicId}`);
        
        // Si c'est une image locale (base64), la télécharger d'abord
        let imageUrl = image.url;
        if (image.url.startsWith('data:')) {
          // Convertir base64 en buffer et uploader
          const base64Data = image.url.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Upload vers Cloudinary
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                public_id: image.publicId,
                folder: image.folder === 'local' ? undefined : image.folder,
                tags: image.tags,
                resource_type: 'image'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });

          results.added.push({
            id: image.id,
            publicId: image.publicId,
            cloudinaryResult: uploadResult
          });

        } else {
          // Si c'est une URL, l'uploader directement
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              imageUrl,
              {
                public_id: image.publicId,
                folder: image.folder === 'local' ? undefined : image.folder,
                tags: image.tags,
                resource_type: 'image'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });

          results.added.push({
            id: image.id,
            publicId: image.publicId,
            cloudinaryResult: uploadResult
          });
        }

      } catch (error) {
        console.error(`❌ Erreur lors de l'ajout de ${image.publicId}:`, error);
        results.errors.push(`Erreur lors de l'ajout de ${image.publicId}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    // Supprimer les images
    for (const image of removedImages) {
      try {
        console.log(`🗑️ Suppression de l'image:`, {
          id: image.id,
          publicId: image.publicId,
          url: image.url
        });
        
        // Utiliser directement le publicId fourni par le composant
        const publicId = image.publicId;
        
        console.log(`🔍 Public ID à supprimer:`, {
          publicId,
          originalUrl: image.url
        });
        
        if (publicId && publicId !== 'local') {
          console.log(`✅ Public ID valide: ${publicId}, suppression en cours...`);
          
          const deleteResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
              if (error) {
                console.error(`❌ Erreur Cloudinary destroy:`, error);
                reject(error);
              } else {
                console.log(`✅ Suppression Cloudinary réussie:`, result);
                resolve(result);
              }
            });
          });

          results.removed.push({
            id: image.id,
            publicId: image.publicId,
            cloudinaryResult: deleteResult
          });
        } else {
          const errorMsg = `Public ID invalide ou manquant pour l'image: ${image.publicId}`;
          console.error(`❌ ${errorMsg}`);
          results.errors.push(errorMsg);
        }

      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${image.publicId}:`, error);
        results.errors.push(`Erreur lors de la suppression de ${image.publicId}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    console.log('✅ Synchronisation terminée:', {
      ajouts: results.added.length,
      suppressions: results.removed.length,
      erreurs: results.errors.length
    });

    return NextResponse.json({
      success: true,
      message: `Synchronisation terminée: ${results.added.length} ajout(s), ${results.removed.length} suppression(s)`,
      results,
      summary: {
        added: results.added.length,
        removed: results.removed.length,
        errors: results.errors.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la synchronisation avec Cloudinary',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
