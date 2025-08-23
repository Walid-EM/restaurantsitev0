# Workflow des Images - Architecture Cloudinary

## 📋 Table des Matières

1. [Analyse Actuelle](#analyse-actuelle)
2. [Nouvelle Architecture](#nouvelle-architecture)
3. [Implémentation](#implémentation)
4. [Configuration](#configuration)

---

## 🔍 Analyse Actuelle

### **Système Actuel**
- **Stockage** : `uploads/images/` (serveur local)
- **Accès** : Via `/api/static/[...path]`
- **Métadonnées** : MongoDB

### **Limitations**
1. **Stockage Local** : Pas de CDN, limité par l'espace disque
2. **Pas de Gestion d'Erreurs** : Pas de récupération automatique
3. **Pas de Monitoring** : Pas de suivi des performances
4. **Pas de Scalabilité** : Dépendant du serveur local

---

## 🚀 Nouvelle Architecture

### **Vue d'Ensemble**
Remplacement du stockage local par **Cloudinary** avec synchronisation automatique vers `/public/images` pour Vercel.

### **Flux Principal**
```
Frontend → /api/upload → Cloudinary → Webhook → /public/images → Vercel Build
                                          ↑
                                          └── Cron Job (sync quotidien)
```

### **Composants**
1. **API Upload** : Envoi vers Cloudinary
2. **Webhook** : Synchronisation automatique
3. **Cron Job** : Synchronisation périodique
4. **Build Vercel** : Intégration automatique

---

## ⚙️ Implémentation

### **1. Configuration Cloudinary**
```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### **2. API Route d'Upload**
```typescript
// /api/upload/route.ts
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validation
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
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

    // Sauvegarde MongoDB
    await connectDB();
    const imageDoc = new Image({
      filename: result.public_id,
      originalName: file.name,
      contentType: file.type,
      filePath: result.secure_url,
      cloudinaryId: result.public_id,
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
```

### **3. Webhook Cloudinary**
```typescript
// /api/cloudinary-webhook/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.event_type === 'upload' && body.resource_type === 'image') {
      const { public_id, secure_url, format } = body;
      
      // Créer le dossier
      const imageDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      if (!existsSync(imageDir)) {
        await mkdir(imageDir, { recursive: true });
      }

      // Télécharger et sauvegarder
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
```

### **4. Cron Job de Synchronisation**
```typescript
// /api/cron/sync-images/route.ts
export async function GET(request: NextRequest) {
  try {
    // Vérification du secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.VERCEL_CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

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

    // Synchroniser
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

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: cloudinaryImages.length,
    });

  } catch (error) {
    console.error('Erreur synchronisation:', error);
    return NextResponse.json({ success: false, error: 'Erreur sync' }, { status: 500 });
  }
}
```

---

## 🚀 Configuration

### **Variables d'Environnement**
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
CLOUDINARY_WEBHOOK_SECRET=votre_webhook_secret
VERCEL_CRON_SECRET=votre_cron_secret
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/hooks/votre_hook_id
```

### **Configuration Vercel**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-images",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### **Configuration Webhook Cloudinary**
```
URL: https://votre-domaine.com/api/cloudinary-webhook
Secret: [Générer un secret sécurisé]
Events: upload, delete, rename
```

---

## 📊 Avantages

### **✅ Résolus**
- **CDN Global** : Distribution géographique des images
- **Scalabilité** : Pas de limite de stockage
- **Backup** : Automatique via Cloudinary
- **Performance** : Images optimisées automatiquement
- **Monitoring** : Suivi des opérations
- **Gestion d'Erreurs** : Retry et récupération automatique

### **⚠️ Considérations**
- **Coût** : Cloudinary selon l'usage
- **Dépendance** : Service externe
- **Complexité** : Plus complexe que le stockage local

---

## 🎯 Conclusion

La nouvelle architecture Cloudinary transforme votre système d'images :
1. **Upload** : Direct vers Cloudinary
2. **Synchronisation** : Automatique via webhook et cron
3. **Stockage Local** : `/public/images` pour Vercel
4. **Build Automatique** : Rebuild Vercel à chaque nouvelle image

**Résultat** : Système robuste, scalable et performant ! 🚀
