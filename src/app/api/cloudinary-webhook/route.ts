import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.event_type === 'upload' && body.resource_type === 'image') {
      const { public_id, secure_url, format } = body;
      
      // Créer le dossier de destination
      const imageDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      if (!existsSync(imageDir)) {
        await mkdir(imageDir, { recursive: true });
      }

      // Télécharger et sauvegarder localement
      const response = await fetch(secure_url);
      const buffer = await response.arrayBuffer();
      const localPath = path.join(imageDir, `${public_id}.${format}`);
      await writeFile(localPath, Buffer.from(buffer));
      
      console.log(`Image synchronisée: ${public_id}.${format}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json({ error: 'Erreur webhook' }, { status: 500 });
  }
}
