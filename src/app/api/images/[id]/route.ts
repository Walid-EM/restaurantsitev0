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

    // Construire le chemin complet vers le fichier
    const filePath = path.join(process.cwd(), image.filePath);
    
    try {
      // Lire le fichier depuis le disque
      const fileBuffer = await readFile(filePath);
      
      // Retourner l'image avec les bons headers
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': image.contentType,
          'Content-Length': image.size.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache pendant 1 an
        },
      });
    } catch (fileError) {
      console.error('Erreur lors de la lecture du fichier:', fileError);
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

    // Construire le chemin complet vers le fichier
    const filePath = path.join(process.cwd(), image.filePath);
    
    try {
      // Supprimer le fichier du disque
      await unlink(filePath);
      console.log(`🗑️ Fichier supprimé: ${filePath}`);
    } catch (fileError) {
      console.error('Erreur lors de la suppression du fichier:', fileError);
      // Continuer même si le fichier n'existe pas sur le disque
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
