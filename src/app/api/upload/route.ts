import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import Image from '@/models/Image';

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

    // Upload vers Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'restaurant-uploads',
          public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Sauvegarde MongoDB avec nouveau schéma
    await connectDB();
    const imageDoc = new Image({
      filename: result.public_id,
      originalName: file.name,
      contentType: file.type,
      filePath: result.secure_url,        // URL Cloudinary
      cloudinaryId: result.public_id,     // Nouveau champ
      size: file.size,
      uploadedAt: new Date(),
    });

    await imageDoc.save();

    return NextResponse.json({ success: true, image: imageDoc });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({ success: false, error: 'Erreur upload' }, { status: 500 });
  }
}
