# Système d'Upload d'Images Dynamique avec Stockage Local

Ce système permet d'uploader des images dynamiquement et de les stocker dans un dossier local de votre projet Next.js, avec les métadonnées stockées dans MongoDB.

## 🏗️ Architecture

### Composants créés :
- **`Image.ts`** : Modèle MongoDB pour stocker les métadonnées des images
- **`/api/upload/route.ts`** : API pour l'upload d'images sur le disque
- **`/api/images/[id]/route.ts`** : API pour récupérer les images via ID
- **`/api/static/[...path]/route.ts`** : API pour servir les fichiers statiques
- **`ImageUpload.tsx`** : Composant React pour l'upload et l'affichage
- **`MongoImage.tsx`** : Composant utilitaire pour afficher les images

## 🚀 Utilisation

### 1. Page de test
Accédez à `/test-upload` pour tester le système d'upload.

### 2. Upload d'images
- Glissez-déposez une image ou cliquez pour sélectionner
- Formats supportés : JPG, PNG, GIF, WebP
- Taille maximale : 5MB
- Les images sont automatiquement renommées avec un UUID unique

### 3. Affichage des images
Les images sont accessibles via :
- **Chemin direct** : `/uploads/images/{filename}` (plus rapide)
- **API** : `/api/images/{imageId}` (avec métadonnées)

## 💾 Stockage

### **Fichiers images** : Dossier `uploads/images/`
```
uploads/
  └── images/
      ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
      ├── b2c3d4e5-f6g7-8901-bcde-f23456789012.png
      └── c3d4e5f6-g7h8-9012-cdef-345678901234.gif
```

### **Métadonnées** : Collection MongoDB `images`
```typescript
{
  _id: ObjectId,
  filename: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  originalName: "ma-photo.jpg", 
  contentType: "image/jpeg",
  filePath: "/uploads/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  size: 245760,
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Intégration dans votre application

### 1. Utiliser le composant MongoImage
```tsx
import MongoImage from '@/components/ui/MongoImage';

// Affichage simple
<MongoImage imageId="64f8a1b2c3d4e5f6a7b8c9d0" alt="Description" />

// Avec chemin direct (plus rapide)
<MongoImage 
  imageId="64f8a1b2c3d4e5f6a7b8c9d0"
  filePath="/uploads/images/filename.jpg"
  alt="Description"
  className="w-32 h-32 object-cover rounded-lg"
  fallback={<div>Image non disponible</div>}
/>
```

### 2. Composants spécialisés pour l'administration

#### AdminImageUpload
Composant d'upload avec sélecteur d'images existantes :
```tsx
import AdminImageUpload from '@/components/ui/AdminImageUpload';

<AdminImageUpload
  currentImage={product.image}
  currentImageId={product.imageId}
  onImageChange={(imageData) => {
    setProduct({
      ...product,
      image: imageData.filePath,
      imageId: imageData.imageId
    });
  }}
  label="Image du produit"
  required={true}
/>
```

#### AdminImageDisplay
Composant d'affichage avec différentes tailles :
```tsx
import AdminImageDisplay from '@/components/ui/AdminImageDisplay';

<AdminImageDisplay
  image={product.image}
  imageId={product.imageId}
  alt={product.name}
  size="md" // sm, md, lg, xl
  showPreview={true}
/>
```

### 3. Upload programmatique
```typescript
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Image uploadée:', result.image.id);
    console.log('Chemin fichier:', result.image.filePath);
    return result.image;
  }
};
```

## 🛡️ Sécurité

- **Validation des types** : Seules les images sont acceptées
- **Limite de taille** : Maximum 5MB par fichier
- **Noms uniques** : UUID pour éviter les conflits
- **Validation MongoDB** : Schéma strict avec champs requis
- **Sécurité des chemins** : Validation des extensions de fichiers

## 📱 Fonctionnalités

- ✅ Upload par glisser-déposer
- ✅ Sélection de fichier classique
- ✅ Validation en temps réel
- ✅ Gestion des erreurs
- ✅ Affichage avec fallback
- ✅ Interface responsive
- ✅ Animations avec Framer Motion
- ✅ Cache des images (1 an)
- ✅ **Stockage local** : Images dans le projet Next.js
- ✅ **Métadonnées MongoDB** : Gestion des informations

## 🔄 Migration depuis le dossier public/

Pour migrer vos images existantes :

1. **Accéder à la page de migration** : `/migrate-images`
2. **Cliquer sur "Démarrer la Migration"** pour :
   - Copier toutes les images du dossier `public/` vers `uploads/images/`
   - Créer les documents MongoDB correspondants
   - Générer un fichier de mapping pour référence

3. **Vérifier la migration** :
   - Consulter le résumé de migration
   - Vérifier que les images sont dans `uploads/images/`
   - Tester l'affichage via `/test-upload`

4. **Mettre à jour vos composants** pour utiliser `MongoImage`

5. **Nettoyer le dossier public** (optionnel) :
   - Utiliser le bouton "Nettoyer le dossier public" après vérification
   - ⚠️ **Attention** : Cette action supprime définitivement les images du dossier public

### **Script de migration automatique**

La migration utilise l'API `/api/migrate-images` qui :
- Scanne récursivement le dossier `public/`
- Identifie tous les fichiers images (jpg, png, gif, webp, svg)
- Copie chaque image vers `uploads/images/` avec un nom unique (UUID)
- Crée un document MongoDB avec les métadonnées
- Génère un fichier de mapping `uploads/migration-mapping.json`

### **Fichier de mapping**

Après migration, un fichier `migration-mapping.json` est créé avec :
```json
{
  "migrationDate": "2024-08-25T21:15:00.000Z",
  "totalImages": 25,
  "migratedCount": 25,
  "errorCount": 0,
  "images": [
    {
      "originalPath": "Assiette-Plancha.png",
      "newFilename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.png",
      "mongoId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "filePath": "/uploads/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png"
    }
  ]
}
```

## 🚨 Limitations

- **Taille maximale** : 5MB par image
- **Stockage** : Images stockées sur le disque du serveur
- **Performance** : Lecture depuis le disque (plus rapide que MongoDB)
- **Cache** : Cache navigateur + serveur via Next.js

## 🔮 Améliorations futures

- [ ] Compression automatique des images
- [ ] Génération de thumbnails
- [ ] Support des métadonnées EXIF
- [ ] Système de tags et catégories
- [ ] Gestion des permissions d'accès
- [ ] CDN pour les images
- [ ] Backup automatique du dossier uploads

## 📝 Exemple d'utilisation complète

```tsx
import { useState } from 'react';
import MongoImage from '@/components/ui/MongoImage';

export default function ProductCard({ product }) {
  const [imageId, setImageId] = useState(product.imageId);
  const [filePath, setFilePath] = useState(product.filePath);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    if (result.success) {
      setImageId(result.image.id);
      setFilePath(result.image.filePath);
      // Mettre à jour le produit en base
      await updateProductImage(product.id, result.image.id, result.image.filePath);
    }
  };

  return (
    <div className="product-card">
      <MongoImage 
        imageId={imageId}
        filePath={filePath}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3>{product.name}</h3>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
    </div>
  );
}
```

## 🎯 Avantages de cette approche

1. **Performance** : Images servies directement depuis le disque
2. **Flexibilité** : Ajout d'images en temps réel
3. **Organisation** : Métadonnées en MongoDB, fichiers sur disque
4. **Sécurité** : Validation et contrôle d'accès
5. **Maintenance** : Gestion centralisée des images
6. **Backup** : Fichiers et métadonnées séparés
7. **Scalabilité** : Possibilité de migrer vers un CDN plus tard

## 🎛️ Interface d'Administration

### Intégration complète dans l'admin
L'interface d'administration a été mise à jour pour utiliser le nouveau système d'images :

- **Formulaires de produits** : Upload et sélection d'images avec `AdminImageUpload`
- **Formulaires de catégories** : Gestion des images obligatoires
- **Formulaires de suppléments** : Support des images optionnelles
- **Affichage des listes** : Utilisation de `AdminImageDisplay` pour toutes les images

### Page de test
Accédez à `/admin/test-images` pour tester :
- Upload de nouvelles images
- Sélection d'images existantes
- Affichage en différentes tailles
- Gestion des fallbacks

### Fonctionnalités de l'admin
1. **Upload direct** : Glisser-déposer ou sélection de fichier
2. **Sélecteur d'images** : Modal pour choisir parmi les images existantes
3. **Prévisualisation** : Affichage immédiat des images sélectionnées
4. **Gestion des erreurs** : Validation et messages d'erreur
5. **Interface responsive** : Adaptation mobile et desktop

### Gestionnaire d'images complet
L'onglet "Images" de l'admin offre :
- **Vue d'ensemble** : Toutes les images uploadées avec métadonnées
- **Recherche et filtres** : Par nom, type de fichier
- **Actions en lot** : Sélection multiple et suppression groupée
- **Prévisualisation** : Affichage des images avec informations détaillées
- **Téléchargement** : Accès direct aux fichiers
- **Suppression sécurisée** : Suppression des fichiers et métadonnées

## 🚀 Démarrage Rapide

### 1. Migration des images existantes
```bash
# Accéder à la page de migration
http://localhost:3000/migrate-images

# Cliquer sur "Démarrer la Migration"
# Vérifier les résultats
# Optionnel : Nettoyer le dossier public
```

### 2. Test du système
```bash
# Page de test générale
http://localhost:3000/test-upload

# Page de test admin
http://localhost:3000/admin/test-images

# Gestionnaire d'images
http://localhost:3000/admin → Onglet "Images"
```

### 3. Utilisation dans vos composants
```tsx
// Remplacer les anciennes images
<img src={product.image} alt={product.name} />

// Par le nouveau composant
<MongoImage 
  imageId={product.imageId}
  filePath={product.image}
  alt={product.name}
  className="w-full h-48 object-cover rounded-lg"
/>
```

## 🎯 Résumé des Avantages

✅ **Performance** : Images servies directement depuis le disque  
✅ **Flexibilité** : Upload dynamique et sélection d'images existantes  
✅ **Organisation** : Métadonnées MongoDB + fichiers organisés  
✅ **Sécurité** : Validation, types de fichiers, tailles limitées  
✅ **Maintenance** : Interface admin complète pour la gestion  
✅ **Migration** : Outil automatique pour les images existantes  
✅ **Scalabilité** : Architecture prête pour CDN et stockage cloud  
✅ **UX** : Interface moderne avec glisser-déposer et prévisualisation  

**Votre système d'images est maintenant prêt pour la production ! 🚀**
