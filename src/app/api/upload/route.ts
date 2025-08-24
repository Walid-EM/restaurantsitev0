import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { connectDB } from '@/lib/mongodb';
import Image from '@/models/Image';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Fichier invalide' }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const filename = `${uniqueId}-${file.name}`;
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier localement
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);

    // Sauvegarde MongoDB
    await connectDB();
    const imageDoc = new Image({
      filename: filename,
      originalName: file.name,
      contentType: file.type,
      filePath: `/public/images/uploads/${filename}`,
      size: file.size,
      uploadedAt: new Date(),
    });

    await imageDoc.save();

    return NextResponse.json({ 
      success: true, 
      image: {
        ...imageDoc.toObject(),
        _id: imageDoc._id.toString()
      }
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({ success: false, error: 'Erreur upload' }, { status: 500 });
  }
}
