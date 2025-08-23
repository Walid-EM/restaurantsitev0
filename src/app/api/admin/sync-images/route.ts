import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin (à adapter selon votre système)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.role === 'admin') {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }

    // Récupérer toutes les images Cloudinary
    const cloudinaryImages = await new Promise((resolve, reject) => {
      cloudinary.api.resources(
        { type: 'upload', prefix: 'restaurant-uploads/', max_results: 1000 },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.resources || []);
        }
      );
    });

    // Synchroniser vers /public/images
    const imageDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!existsSync(imageDir)) {
      await mkdir(imageDir, { recursive: true });
    }

    let syncedCount = 0;
    for (const cloudImage of cloudinaryImages) {
      const localFilename = `${cloudImage.public_id}.${cloudImage.format}`;
      const localPath = path.join(imageDir, localFilename);
      
      if (!existsSync(localPath)) {
        const response = await fetch(cloudImage.secure_url);
        const buffer = await response.arrayBuffer();
        await writeFile(localPath, Buffer.from(buffer));
        syncedCount++;
      }
    }

    // Déclencher le rebuild Vercel
    if (process.env.VERCEL_DEPLOY_HOOK) {
      try {
        await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
        console.log('Rebuild Vercel déclenché');
      } catch (error) {
        console.error('Erreur déclenchement rebuild:', error);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: cloudinaryImages.length,
      rebuildTriggered: !!process.env.VERCEL_DEPLOY_HOOK,
    });

  } catch (error) {
    console.error('Erreur synchronisation:', error);
    return NextResponse.json({ success: false, error: 'Erreur sync' }, { status: 500 });
  }
}
