# 🔧 Guide de Dépannage - Synchronisation d'Images

## 🚨 **Erreurs Courantes et Solutions**

### **1. Erreur "cloudinary.api.resource is not a function"**

**Problème** : L'API Cloudinary n'est pas correctement configurée ou le package n'est pas installé.

**Solutions** :
```bash
# Installer le package Cloudinary
npm install cloudinary

# Vérifier l'import dans le code
import { v2 as cloudinary } from 'cloudinary';
```

### **2. Erreur "Variables d'environnement manquantes"**

**Problème** : Les variables Cloudinary ne sont pas configurées.

**Solution** : Ajouter dans votre `.env.local` :
```env
CLOUDINARY_CLOUD_NAME=dpdk1zur0
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### **3. Erreur "Permission denied" lors de l'écriture**

**Problème** : Le dossier `/public/images/uploads/` n'est pas accessible en écriture.

**Solutions** :
```bash
# Vérifier les permissions du dossier
ls -la public/images/uploads/

# Créer le dossier avec les bonnes permissions
mkdir -p public/images/uploads
chmod 755 public/images/uploads
```

### **4. Erreur "fetch is not defined"**

**Problème** : L'API `fetch` n'est pas disponible dans l'environnement Node.js.

**Solution** : Utiliser la version simplifiée de l'API qui fonctionne mieux :
```
/api/admin/sync-single-image-simple
```

## 🔄 **API Routes Disponibles**

### **API Principale (avec Cloudinary SDK)**
- **Route** : `/api/admin/sync-single-image`
- **Utilise** : SDK Cloudinary officiel
- **Avantages** : Validation Cloudinary, métadonnées
- **Inconvénients** : Plus complexe, dépend des variables d'environnement

### **API Simplifiée (recommandée)**
- **Route** : `/api/admin/sync-single-image-simple`
- **Utilise** : Fetch direct depuis l'URL Cloudinary
- **Avantages** : Plus simple, plus fiable, moins de dépendances
- **Inconvénients** : Pas de validation Cloudinary

## 🧪 **Test de Fonctionnement**

### **Test 1 : Vérification des Variables d'Environnement**
```bash
# Dans votre terminal
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET
```

### **Test 2 : Test de l'API Simplifiée**
```bash
curl -X POST http://localhost:3000/api/admin/sync-single-image-simple \
  -H "Content-Type: application/json" \
  -d '{
    "cloudinaryUrl": "https://res.cloudinary.com/dpdk1zur0/image/upload/v1755968157/sodaicone_va6wub.png",
    "imageName": "test_soda.png"
  }'
```

### **Test 3 : Vérification du Dossier de Destination**
```bash
# Vérifier que le dossier existe
ls -la public/images/uploads/

# Vérifier les permissions
stat public/images/uploads/
```

## 📁 **Structure des Fichiers Attendue**

```
public/images/uploads/
├── .gitkeep
├── sodaicone_va6wub.png  ← Après synchronisation réussie
└── autres_images...
```

## 🔍 **Logs de Débogage**

### **Dans la Console du Navigateur**
- Ouvrez les DevTools (F12)
- Allez dans l'onglet Console
- Cliquez sur "Synchroniser Localement"
- Regardez les messages d'erreur

### **Dans le Terminal du Serveur**
- Regardez les logs Next.js
- Recherchez les messages d'erreur
- Vérifiez les appels API

## 🚀 **Solutions Rapides**

### **Solution 1 : Utiliser l'API Simplifiée**
Le composant `SingleImageSync` utilise maintenant par défaut l'API simplifiée qui est plus fiable.

### **Solution 2 : Vérifier le Dossier de Destination**
```bash
# Créer le dossier s'il n'existe pas
mkdir -p public/images/uploads
```

### **Solution 3 : Redémarrer le Serveur**
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 📚 **Ressources Utiles**

- **Documentation Cloudinary** : [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Guide Next.js API Routes** : [https://nextjs.org/docs/api-routes/introduction](https://nextjs.org/docs/api-routes/introduction)
- **Variables d'environnement** : [https://nextjs.org/docs/basic-features/environment-variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎯 **Prochaines Étapes**

1. **Testez** l'API simplifiée avec votre icône soda
2. **Vérifiez** que l'image apparaît dans `/public/images/uploads/`
3. **Utilisez** le composant `LocalImageDisplay` pour voir les images synchronisées
4. **Testez** l'affichage local avec `MongoImage`

---

**💡 Conseil : Commencez toujours par tester l'API simplifiée qui est plus fiable !**
