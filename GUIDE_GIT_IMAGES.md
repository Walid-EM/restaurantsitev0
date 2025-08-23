# 🚀 Guide de Migration : Cloudinary → Système Git

## 📋 **Table des Matières**

1. [Vue d'Ensemble de la Migration](#vue-densemble-de-la-migration)
2. [Architecture Actuelle vs Nouvelle](#architecture-actuelle-vs-nouvelle)
3. [Plan de Migration](#plan-de-migration)
4. [Modifications Techniques](#modifications-techniques)
5. [Nouvelle Interface Admin](#nouvelle-interface-admin)
6. [Workflow Git Automatisé](#workflow-git-automatisé)
7. [Gestion des Conflits et Sécurité](#gestion-des-conflits-et-sécurité)
8. [Tests et Validation](#tests-et-validation)
9. [Déploiement et Maintenance](#déploiement-et-maintenance)

---

## 🎯 **Vue d'Ensemble de la Migration**

### **Objectif de la Migration**
Remplacer le système Cloudinary par un système basé sur **Git** qui :
- ✅ Stocke les images directement dans le projet local
- ✅ Synchronise automatiquement avec le repository distant
- ✅ Conserve une UX simple et intuitive
- ✅ Élimine la dépendance aux services tiers

### **Avantages de la Migration**
- 🚀 **Contrôle total** : Plus de dépendance à Cloudinary
- 💰 **Coût réduit** : Pas de frais de service cloud
- 🔒 **Sécurité renforcée** : Images stockées dans votre infrastructure
- 📱 **Performance** : Images servies directement depuis le serveur
- 🔄 **Versioning** : Historique complet des modifications d'images

### **Inconvénients à Considérer**
- 📈 **Taille du repo** : Augmentation de la taille du repository Git
- ⚠️ **Gestion des conflits** : Risque de conflits lors des merges
- 🚫 **Pas de CDN** : Perte des avantages de distribution géographique
- 📊 **Stockage limité** : Dépendant de l'espace disque du serveur

---

## 🔄 **Architecture Actuelle vs Nouvelle**

### **Architecture Actuelle (Cloudinary)**
```
Interface Admin → Cloudinary → Synchronisation → /public/images/uploads/ → Affichage Public
```

**Composants actuels :**
- `CloudinaryImageManager` - Gestion des images Cloudinary
- `CloudinaryImagesList` - Affichage des images Cloudinary
- `AdminCloudinaryImage` - Prévisualisation Cloudinary
- API `/api/admin/sync-cloudinary-images` - Synchronisation

### **Nouvelle Architecture (Git)**
```
Interface Admin → Stockage Local → Git Commit → Git Push → Repository → Affichage Public
```

**Nouveaux composants :**
- `GitImageManager` - Gestion des images locales
- `GitImageList` - Affichage des images du repo
- `GitImagePreview` - Prévisualisation locale
- API `/api/admin/git-sync` - Synchronisation Git

---

## 📋 **Plan de Migration**

### **Phase 1 : Préparation**
1. **Sauvegarde** des images Cloudinary existantes
2. **Création** de la nouvelle structure de dossiers
3. **Migration** des images vers le système local

### **Phase 2 : Développement**
1. **Création** des nouveaux composants Git
2. **Modification** des composants existants
3. **Implémentation** des API Git

### **Phase 3 : Test et Validation**
1. **Tests** de l'interface admin
2. **Validation** du workflow Git
3. **Tests** d'affichage public

### **Phase 4 : Déploiement**
1. **Migration** des données
2. **Déploiement** en production
3. **Nettoyage** de l'ancien système

---

## ⚙️ **Modifications Techniques**

### **1. Nouvelle Structure des Dossiers**

```
public/
  └── images/
      ├── uploads/           # Images uploadées via l'admin
      ├── products/          # Images des produits
      ├── categories/        # Images des catégories
      └── .gitkeep          # Garde le dossier dans Git

src/
  └── components/
      └── ui/
          ├── GitImageManager.tsx      ← Nouveau composant
          ├── GitImageList.tsx         ← Nouveau composant
          ├── GitImagePreview.tsx      ← Nouveau composant
          ├── GitSyncButton.tsx        ← Nouveau composant
          └── ... (composants existants modifiés)
```

### **2. Nouveaux Composants React**

#### **`GitImageManager.tsx`**
```tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, GitBranch, CheckCircle } from 'lucide-react';

interface GitImageManagerProps {
  onImagesChange: (images: LocalImage[]) => void;
}

export default function GitImageManager({ onImagesChange }: GitImageManagerProps) {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [gitStatus, setGitStatus] = useState<'clean' | 'dirty' | 'syncing'>('clean');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion des uploads d'images
  const handleFileUpload = async (file: File) => {
    // Logique d'upload vers /public/images/uploads/
    // Mise à jour du statut Git
  };

  // Suppression d'images
  const handleImageDelete = async (imagePath: string) => {
    // Suppression du fichier local
    // Mise à jour du statut Git
  };

  return (
    <div className="space-y-6">
      {/* Interface de gestion des images */}
      {/* Bouton de synchronisation Git */}
    </div>
  );
}
```

#### **`GitSyncButton.tsx`**
```tsx
'use client';

import { useState } from 'react';
import { GitBranch, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function GitSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleGitSync = async () => {
    setIsSyncing(true);
    try {
      // Appel à l'API de synchronisation Git
      const response = await fetch('/api/admin/git-sync', {
        method: 'POST'
      });
      
      if (response.ok) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleGitSync}
      disabled={isSyncing}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      {isSyncing ? (
        <RefreshCw className="w-5 h-5 animate-spin" />
      ) : (
        <GitBranch className="w-5 h-5" />
      )}
      <span className="ml-2">
        {isSyncing ? 'Synchronisation...' : '🔄 Synchroniser Git'}
      </span>
    </button>
  );
}
```

### **3. Nouvelles API Routes**

#### **`/api/admin/git-sync/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const projectRoot = process.cwd();
    
    // Vérifier le statut Git
    const { stdout: gitStatus } = await execAsync('git status --porcelain', { cwd: projectRoot });
    
    if (!gitStatus.trim()) {
      return NextResponse.json({
        success: true,
        message: 'Aucun changement à synchroniser',
        status: 'clean'
      });
    }

    // Ajouter tous les fichiers modifiés
    await execAsync('git add .', { cwd: projectRoot });
    
    // Créer un commit
    const commitMessage = `Synchronisation des images - ${new Date().toISOString()}`;
    await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
    
    // Pousser vers le repository distant
    await execAsync('git push', { cwd: projectRoot });
    
    return NextResponse.json({
      success: true,
      message: 'Synchronisation Git réussie',
      status: 'synced',
      changes: gitStatus.split('\n').filter(line => line.trim())
    });

  } catch (error) {
    console.error('Erreur synchronisation Git:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur synchronisation Git' },
      { status: 500 }
    );
  }
}
```

#### **`/api/admin/git-status/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const projectRoot = process.cwd();
    
    // Vérifier le statut Git
    const { stdout: gitStatus } = await execAsync('git status --porcelain', { cwd: projectRoot });
    const { stdout: branchName } = await execAsync('git branch --show-current', { cwd: projectRoot });
    
    const hasChanges = gitStatus.trim().length > 0;
    const changeCount = gitStatus.split('\n').filter(line => line.trim()).length;
    
    return NextResponse.json({
      success: true,
      status: hasChanges ? 'dirty' : 'clean',
      branch: branchName.trim(),
      changeCount,
      changes: hasChanges ? gitStatus.split('\n').filter(line => line.trim()) : []
    });

  } catch (error) {
    console.error('Erreur récupération statut Git:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur récupération statut Git' },
      { status: 500 }
    );
  }
}
```

### **4. Modification des Composants Existants**

#### **`MongoImage.tsx` (Modifié)**
```tsx
// ... imports existants ...

interface MongoImageProps {
  imageId: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  filePath?: string;        // Maintenant chemin local uniquement
  gitPath?: string;         // Nouveau : chemin dans le repo Git
}

export default function MongoImage({
  imageId,
  alt = 'Image',
  className = '',
  fallback,
  onLoad,
  onError,
  filePath,
  gitPath
}: MongoImageProps) {
  // ... logique existante ...
  
  // Priorité : 1. gitPath, 2. filePath, 3. imageId (API locale)
  let imageSrc = '';
  
  if (gitPath && gitPath.startsWith('/images/')) {
    // Image depuis le repository Git
    imageSrc = gitPath;
  } else if (filePath && filePath.startsWith('/public/images/')) {
    // Image locale (fallback)
    imageSrc = filePath.replace('/public/images/', '/images/');
  } else if (imageId && imageId !== 'undefined') {
    // Fallback vers l'API locale
    imageSrc = `/api/images/${imageId}`;
  }
  
  // ... reste du composant ...
}
```

---

## 🖥️ **Nouvelle Interface Admin**

### **Page Principale : `/admin/git-images`**

#### **1. Gestionnaire d'Images Git**
- **Composant** : `GitImageManager`
- **Fonctionnalités** :
  - ✅ Upload d'images vers `/public/images/uploads/`
  - ✅ Suppression d'images locales
  - ✅ Prévisualisation des images
  - ✅ Gestion des métadonnées

#### **2. Statut Git en Temps Réel**
- **Composant** : `GitStatusDisplay`
- **Fonctionnalités** :
  - ✅ Affichage de la branche actuelle
  - ✅ Nombre de fichiers modifiés
  - ✅ Liste des changements en attente
  - ✅ Indicateur visuel du statut

#### **3. Bouton de Synchronisation Git**
- **Composant** : `GitSyncButton`
- **Fonctionnalités** :
  - ✅ Exécution automatique de `git add .`
  - ✅ Création de commit avec message automatique
  - ✅ Push vers le repository distant
  - ✅ Feedback visuel du processus

### **Interface Utilisateur**

```tsx
// Exemple d'interface complète
<div className="max-w-7xl mx-auto p-6 space-y-6">
  <h1 className="text-3xl font-bold text-gray-800">
    Gestionnaire d'Images Git
  </h1>
  
  {/* Statut Git */}
  <GitStatusDisplay />
  
  {/* Gestionnaire d'images */}
  <GitImageManager />
  
  {/* Bouton de synchronisation */}
  <div className="flex justify-center">
    <GitSyncButton />
  </div>
  
  {/* Liste des images */}
  <GitImageList />
</div>
```

---

## 🔄 **Workflow Git Automatisé**

### **Processus de Synchronisation**

#### **1. Upload d'Image**
```
Interface Admin → Sélection fichier → Stockage local → Statut Git "dirty"
```

#### **2. Synchronisation Git**
```
Bouton "Synchroniser Git" → git add . → git commit → git push → Statut "clean"
```

#### **3. Déploiement Automatique**
```
Repository distant → Webhook → Déploiement automatique → Images disponibles
```

### **Commandes Git Automatisées**

#### **Script de Synchronisation**
```bash
#!/bin/bash
# scripts/git-sync.sh

set -e

echo "🔄 Début de la synchronisation Git..."

# Vérifier le statut
if git diff-index --quiet HEAD --; then
    echo "✅ Aucun changement à synchroniser"
    exit 0
fi

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers..."
git add .

# Créer un commit
COMMIT_MESSAGE="Synchronisation des images - $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 Création du commit: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Pousser vers le repository distant
echo "🚀 Push vers le repository distant..."
git push

echo "✅ Synchronisation Git terminée avec succès!"
```

#### **Intégration dans l'API**
```typescript
// Dans /api/admin/git-sync/route.ts
const syncScript = path.join(process.cwd(), 'scripts', 'git-sync.sh');

try {
  // Exécuter le script de synchronisation
  const { stdout, stderr } = await execAsync(`bash ${syncScript}`, {
    cwd: projectRoot,
    timeout: 30000 // 30 secondes max
  });
  
  console.log('Sortie du script:', stdout);
  if (stderr) console.warn('Avertissements:', stderr);
  
} catch (error) {
  console.error('Erreur exécution script:', error);
  throw new Error('Échec de la synchronisation Git');
}
```

---

## ⚠️ **Gestion des Conflits et Sécurité**

### **Gestion des Conflits Git**

#### **Types de Conflits Possibles**
1. **Conflits de fichiers** : Deux développeurs modifient la même image
2. **Conflits de merge** : Branches divergentes avec modifications d'images
3. **Conflits de suppression** : Image supprimée dans une branche, modifiée dans une autre

#### **Stratégies de Résolution**
```typescript
// API de résolution des conflits
export async function resolveGitConflict(request: NextRequest) {
  const { conflictType, resolution } = await request.json();
  
  switch (conflictType) {
    case 'file_conflict':
      // Résolution automatique : garder la version la plus récente
      await resolveFileConflict(resolution);
      break;
      
    case 'merge_conflict':
      // Demander à l'utilisateur de choisir
      await handleMergeConflict(resolution);
      break;
      
    case 'delete_conflict':
      // Vérifier si l'image est encore utilisée
      await checkImageUsage(resolution);
      break;
  }
}
```

### **Sécurité et Permissions**

#### **Vérifications de Sécurité**
```typescript
// Middleware de sécurité pour les API Git
export function validateGitOperation(request: NextRequest) {
  // Vérifier l'authentification admin
  if (!isAdminUser(request)) {
    throw new Error('Accès non autorisé');
  }
  
  // Vérifier les permissions Git
  if (!hasGitPermissions()) {
    throw new Error('Permissions Git insuffisantes');
  }
  
  // Vérifier la validité des fichiers
  if (!validateImageFiles(request)) {
    throw new Error('Fichiers d\'images invalides');
  }
}
```

#### **Validation des Fichiers**
```typescript
function validateImageFiles(request: NextRequest) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  // Vérifier le type MIME
  // Vérifier la taille
  // Vérifier le contenu (pas de code malveillant)
  
  return true; // Validation réussie
}
```

---

## 🧪 **Tests et Validation**

### **Tests de l'Interface Admin**

#### **1. Test d'Upload d'Images**
```typescript
// tests/git-image-manager.test.ts
describe('GitImageManager', () => {
  test('devrait uploader une image vers le dossier local', async () => {
    const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simuler l'upload
    const result = await uploadImage(file);
    
    expect(result.success).toBe(true);
    expect(result.path).toContain('/public/images/uploads/');
  });
});
```

#### **2. Test de Synchronisation Git**
```typescript
// tests/git-sync.test.ts
describe('GitSync', () => {
  test('devrait synchroniser les changements avec Git', async () => {
    // Créer des changements
    await createTestImage();
    
    // Synchroniser
    const result = await syncWithGit();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe('synced');
  });
});
```

### **Tests d'Affichage Public**

#### **3. Test d'Affichage des Images**
```typescript
// tests/mongo-image-git.test.ts
describe('MongoImage avec Git', () => {
  test('devrait afficher une image depuis le repo Git', () => {
    const { getByAltText } = render(
      <MongoImage 
        gitPath="/images/uploads/test.jpg"
        alt="Test Image"
      />
    );
    
    const image = getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('/images/uploads/test.jpg');
  });
});
```

---

## 🚀 **Déploiement et Maintenance**

### **Script de Migration**

#### **Migration depuis Cloudinary**
```bash
#!/bin/bash
# scripts/migrate-cloudinary-to-git.sh

echo "🚀 Migration Cloudinary → Git..."

# 1. Télécharger toutes les images Cloudinary
echo "📥 Téléchargement des images Cloudinary..."
node scripts/download-cloudinary-images.js

# 2. Organiser les images dans la nouvelle structure
echo "📁 Organisation des images..."
node scripts/organize-images.js

# 3. Mettre à jour les références dans le code
echo "🔧 Mise à jour des références..."
node scripts/update-image-references.js

# 4. Premier commit Git
echo "💾 Premier commit Git..."
git add .
git commit -m "Migration Cloudinary → Git - Images initiales"
git push

echo "✅ Migration terminée avec succès!"
```

### **Configuration de Production**

#### **Variables d'Environnement**
```env
# Git Configuration
GIT_REPOSITORY_URL=https://github.com/user/repo.git
GIT_BRANCH=main
GIT_USER_NAME=Deployment Bot
GIT_USER_EMAIL=deploy@example.com

# Sécurité
GIT_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
ADMIN_GIT_SYNC_ENABLED=true
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
```

#### **Webhook de Déploiement**
```typescript
// pages/api/webhooks/github.ts
export default function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { ref, commits } = req.body;
  
  // Vérifier que c'est un push sur la branche main
  if (ref === 'refs/heads/main') {
    // Déclencher le déploiement
    await triggerDeployment(commits);
  }
  
  res.status(200).json({ message: 'Webhook processed' });
}
```

---

## 📊 **Impacts et Considérations**

### **Impact sur la Taille du Repository**

#### **Calcul de la Taille**
```bash
# Avant migration
du -sh .git
# Résultat : ~50MB

# Après migration (avec 100 images de 2MB chacune)
du -sh .git
# Résultat : ~250MB
```

#### **Stratégies de Gestion**
1. **Git LFS** : Stockage des gros fichiers en dehors du repo principal
2. **Compression** : Optimisation automatique des images
3. **Nettoyage** : Suppression des anciennes versions d'images

### **Gestion des Conflits**

#### **Prévention des Conflits**
```typescript
// Système de verrouillage des images
export async function lockImage(imagePath: string, userId: string) {
  const lockKey = `image_lock:${imagePath}`;
  
  // Vérifier si l'image est verrouillée
  const isLocked = await redis.get(lockKey);
  
  if (isLocked && isLocked !== userId) {
    throw new Error('Image en cours de modification par un autre utilisateur');
  }
  
  // Verrouiller l'image
  await redis.setex(lockKey, 300, userId); // Verrou de 5 minutes
}
```

#### **Résolution Automatique**
```typescript
// Résolution automatique des conflits
export async function autoResolveConflict(conflictData: ConflictData) {
  const { localVersion, remoteVersion, imagePath } = conflictData;
  
  // Comparer les timestamps
  if (localVersion.timestamp > remoteVersion.timestamp) {
    // Garder la version locale
    await keepLocalVersion(imagePath);
  } else {
    // Garder la version distante
    await keepRemoteVersion(imagePath);
  }
  
  // Marquer le conflit comme résolu
  await markConflictResolved(conflictData.id);
}
```

---

## 🎯 **Conclusion et Prochaines Étapes**

### **Résumé de la Migration**

Cette migration transforme votre système d'images de :
- **Cloudinary** (service tiers) → **Git** (contrôle total)
- **Synchronisation API** → **Synchronisation Git**
- **Stockage cloud** → **Stockage local + versioning**

### **Avantages Obtenus**
- ✅ **Contrôle total** sur vos images
- ✅ **Versioning complet** de l'historique des modifications
- ✅ **Pas de coûts** de service tiers
- ✅ **Sécurité renforcée** (images dans votre infrastructure)
- ✅ **Workflow Git** familier pour les développeurs

### **Points de Vigilance**
- ⚠️ **Taille du repository** (gestion avec Git LFS si nécessaire)
- ⚠️ **Gestion des conflits** (stratégies de résolution automatique)
- ⚠️ **Performance** (pas de CDN, images servies localement)
- ⚠️ **Backup** (responsabilité de sauvegarder le repository)

### **Prochaines Étapes Recommandées**

1. **Phase 1** : Développement des nouveaux composants
2. **Phase 2** : Tests en environnement de développement
3. **Phase 3** : Migration des données existantes
4. **Phase 4** : Déploiement en production
5. **Phase 5** : Nettoyage de l'ancien système Cloudinary

---

**🚀 Votre système d'images sera maintenant entièrement contrôlé par Git, offrant transparence, contrôle et flexibilité !**

**💡 Conseil : Commencez par tester la migration sur une branche de développement avant de déployer en production !**
