import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Image from '@/models/Image';
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import path from 'path';
import { unlink } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID d\'image invalide' },
        { status: 400 }
      );
    }

    // Récupérer l'image depuis MongoDB
    const image = await Image.findById(id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que filePath existe
    if (!image.filePath) {
      return NextResponse.json(
        { success: false, error: 'Chemin de fichier manquant' },
        { status: 400 }
      );
    }

    // Si c'est une image Cloudinary, rediriger vers l'URL Cloudinary
    if (image.filePath.startsWith('http') || image.filePath.includes('cloudinary')) {
      return NextResponse.redirect(image.filePath);
    }

    // Si c'est une image locale synchronisée, essayer de la servir depuis /public/images/uploads/
    let filePath: string;
    
    if (image.filePath.startsWith('/public/images/')) {
      // Image synchronisée depuis Cloudinary
      filePath = path.join(process.cwd(), image.filePath);
    } else if (image.filePath.startsWith('/uploads/')) {
      // Ancien système d'uploads
      filePath = path.join(process.cwd(), image.filePath);
    } else {
      // Chemin relatif, essayer de le construire
      filePath = path.join(process.cwd(), 'public', 'images', 'uploads', path.basename(image.filePath));
    }
    
    try {
      // Lire le fichier depuis le disque
      const fileBuffer = await readFile(filePath);
      
      // Retourner l'image avec les bons headers
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': image.contentType || 'image/jpeg',
          'Content-Length': image.size?.toString() || fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache pendant 1 an
        },
      });
    } catch (fileError) {
      console.error('Erreur lors de la lecture du fichier:', fileError);
      
      // Si le fichier local n'existe pas, essayer de rediriger vers Cloudinary
      if (image.cloudinaryId) {
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${image.cloudinaryId}`;
        return NextResponse.redirect(cloudinaryUrl);
      }
      
      return NextResponse.json(
        { success: false, error: 'Fichier image non trouvé sur le disque' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID d\'image invalide' },
        { status: 400 }
      );
    }

    // Récupérer l'image depuis MongoDB
    const image = await Image.findById(id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que filePath existe avant de tenter la suppression
    if (image.filePath) {
      try {
        // Construire le chemin complet vers le fichier
        const filePath = path.join(process.cwd(), image.filePath);
        
        // Supprimer le fichier du disque
        await unlink(filePath);
        console.log(`🗑️ Fichier supprimé: ${filePath}`);
      } catch (fileError) {
        console.error('Erreur lors de la suppression du fichier:', fileError);
        // Continuer même si le fichier n'existe pas sur le disque
      }
    }

    // Supprimer l'image de MongoDB
    await Image.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Image supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de l\'image' },
      { status: 500 }
    );
  }
}
