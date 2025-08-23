import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Vérification de la configuration
    console.log('🔧 Configuration Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configuré' : '❌ Manquant',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Configuré' : '❌ Manquant',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Configuré' : '❌ Manquant'
    });

    // Récupérer tous les paramètres de requête
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('max_results') || '50');
    const nextCursor = searchParams.get('next_cursor') || undefined;

    // Options pour l'API Cloudinary
    const options: any = {
      max_results: maxResults,
      type: 'upload', // Seulement les images uploadées (pas les transformations)
    };

    if (nextCursor) {
      options.next_cursor = nextCursor;
    }

    // Récupérer la liste des images depuis Cloudinary
    const result = await cloudinary.api.resources(options);

    // Formater les résultats
    const images = result.resources.map((resource: any) => ({
      id: `cloudinary-${resource.public_id.replace(/[^a-zA-Z0-9]/g, '-')}`,
      publicId: resource.public_id,
      url: resource.secure_url,
      thumbnailUrl: resource.secure_url.replace('/upload/', '/upload/c_thumb,w_200,h_200/'),
      format: resource.format,
      width: resource.width,
      height: resource.height,
      size: resource.bytes,
      createdAt: resource.created_at,
      updatedAt: resource.updated_at,
      tags: resource.tags || [],
      folder: resource.folder || 'racine'
    }));

    return NextResponse.json({
      success: true,
      images: images,
      pagination: {
        nextCursor: result.next_cursor,
        hasMore: !!result.next_cursor,
        totalCount: result.total_count
      },
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des images Cloudinary:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des images Cloudinary',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
