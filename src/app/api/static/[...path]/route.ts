import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    // Construire le chemin vers le fichier
    const filePath = path.join(process.cwd(), 'uploads', ...pathSegments);
    
    // Vérifier que le fichier existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }
    
    // Lire le fichier
    const fileBuffer = await readFile(filePath);
    
    // Déterminer le type MIME basé sur l'extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Retourner le fichier avec les bons headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache pendant 1 an
      },
    });
    
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier statique:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la lecture du fichier' },
      { status: 500 }
    );
  }
}
