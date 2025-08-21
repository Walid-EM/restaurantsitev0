import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Image from '@/models/Image';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    
    // Construire le filtre
    const filter: { 
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      contentType?: { $regex: string; $options: string };
    } = {};
    
    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type && type !== 'all') {
      filter.contentType = { $regex: type, $options: 'i' };
    }
    
    // Calculer le skip pour la pagination
    const skip = (page - 1) * limit;
    
    // Récupérer les images avec pagination
    const images = await Image.find(filter)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Compter le total d'images
    const total = await Image.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      images: images.map(img => ({
        _id: img._id,
        filename: img.filename,
        originalName: img.originalName,
        filePath: img.filePath,
        contentType: img.contentType,
        size: img.size,
        uploadedAt: img.uploadedAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des images',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

