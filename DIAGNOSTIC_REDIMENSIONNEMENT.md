# 🔍 Guide de Diagnostic - Problème de Redimensionnement

## 🚨 **Problème identifié :**
Les images de plus de 4.5 MB ne sont pas redimensionnées automatiquement et ne s'ajoutent pas à Git.

## 🔧 **Solutions implémentées :**

### 1. **Logging amélioré**
- Ajout de logs détaillés dans `resizeImageIfNeeded()`
- Suivi complet du processus de redimensionnement
- Gestion d'erreurs avec stack traces

### 2. **API de test Sharp**
- Endpoint `/api/test-sharp` pour vérifier que Sharp fonctionne
- Composant `SharpTest` dans l'interface admin
- Test de redimensionnement simple

### 3. **Vérifications de sécurité**
- Contrôle de la disponibilité de Sharp
- Validation des métadonnées d'image
- Fallback en cas d'erreur

## 📋 **Étapes de diagnostic :**

### **Étape 1 : Tester Sharp**
1. Aller dans l'interface admin
2. Cliquer sur "🧪 Tester Sharp"
3. Vérifier le résultat du test

### **Étape 2 : Vérifier les logs**
1. Uploader une image > 4.5 MB
2. Vérifier les logs dans la console Vercel
3. Identifier où le processus échoue

### **Étape 3 : Tester l'API directement**
```bash
# Test de l'API Sharp
curl https://votre-site.vercel.app/api/test-sharp

# Test d'upload (avec une petite image d'abord)
curl -X POST https://votre-site.vercel.app/api/admin/upload-to-git \
  -F "image=@petite-image.jpg"
```

## 🐛 **Causes possibles :**

### **1. Sharp non installé sur Vercel**
- **Symptôme** : Erreur "Sharp n'est pas disponible"
- **Solution** : Vérifier que `sharp` est dans `package.json` et redéployer

### **2. Erreur de compilation Sharp**
- **Symptôme** : Erreur lors de l'import de Sharp
- **Solution** : Vérifier la compatibilité avec l'architecture Vercel

### **3. Timeout de l'API**
- **Symptôme** : L'API prend trop de temps
- **Solution** : Augmenter `maxDuration` dans `vercel.json`

### **4. Erreur silencieuse**
- **Symptôme** : Pas d'erreur visible mais pas de redimensionnement
- **Solution** : Vérifier les logs détaillés

## 🔍 **Logs à surveiller :**

### **Logs de succès :**
```
🚀 API upload-to-git appelée
📁 Fichier reçu: image.jpg
📊 Taille originale: 8.2 MB
🔄 Début du redimensionnement automatique...
🔄 Redimensionnement nécessaire: 8.2 MB > 4.5 MB
📐 Dimensions originales: 4000x3000
🎯 Nouvelles dimensions: 2800x2100
✅ Redimensionnement terminé: 2.8 MB (réduction: 65.9%)
✅ Image uploadée avec succès
```

### **Logs d'erreur :**
```
❌ Erreur lors du redimensionnement: [détails]
❌ Détails de l'erreur: [stack trace]
⚠️ Retour de l'image originale
```

## 🛠️ **Actions correctives :**

### **Si Sharp n'est pas disponible :**
```bash
# Réinstaller Sharp
npm uninstall sharp
npm install sharp

# Redéployer sur Vercel
vercel --prod
```

### **Si erreur de compilation :**
```json
// vercel.json
{
  "functions": {
    "src/app/api/admin/upload-to-git/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### **Si timeout :**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', '@octokit/rest'],
  },
};
```

## 📊 **Test de validation :**

### **Image de test recommandée :**
- **Format** : PNG ou JPEG
- **Taille** : 8-10 MB
- **Dimensions** : 4000x3000 ou plus
- **Attendu** : Redimensionnement à ~2-3 MB

### **Vérifications :**
1. ✅ Sharp fonctionne (test API)
2. ✅ Logs de redimensionnement visibles
3. ✅ Image finale < 4.5 MB
4. ✅ Upload GitHub réussi
5. ✅ Image visible dans la liste

## 🚀 **Déploiement :**

1. **Commit et push** des modifications
2. **Redéploiement** sur Vercel
3. **Test** avec l'API `/api/test-sharp`
4. **Test** d'upload d'image volumineuse
5. **Vérification** des logs

## 📞 **Support :**

Si le problème persiste après ces étapes :
1. Vérifier les logs Vercel complets
2. Tester avec différentes tailles d'images
3. Vérifier la configuration des variables d'environnement
4. Contacter le support si nécessaire

---

**🎯 Objectif** : Identifier et résoudre le problème de redimensionnement automatique pour que toutes les images soient uploadées avec succès.
