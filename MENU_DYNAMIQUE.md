# 🍽️ Menu Dynamique - Page Principale

## 📋 **Vue d'ensemble**

La page principale affiche maintenant dynamiquement le contenu de votre base de données MongoDB, incluant :
- **Catégories** (Assiettes, Sandwiches, Tacos, etc.)
- **Produits** (tous les plats disponibles)
- **Suppléments & Extras** (cornichons, cheddar, sauces, etc.)

## 🚀 **Comment ça fonctionne**

### **1. Récupération des données**
- Les données sont chargées automatiquement au montage de la page
- Utilise des routes API publiques (pas besoin d'authentification)
- Filtre automatiquement les éléments actifs/disponibles

### **2. Routes API créées**
- `/api/categories` - Récupère toutes les catégories actives
- `/api/products` - Récupère tous les produits disponibles
- `/api/extras` - Récupère tous les suppléments actifs

### **3. Affichage dynamique**
- **Catégories** : Affichées avec description et nombre de produits
- **Produits** : Groupés par catégorie, limités à 6 par section
- **Suppléments** : Affichés en grille compacte
- **Statistiques** : Compteurs en temps réel

## 🎯 **Fonctionnalités**

### **Boutons d'action**
- **🔄 Rafraîchir le menu** : Recharge toutes les données
- **📊 Voir les données** : Affiche un résumé dans la console et une alerte

### **Affichage intelligent**
- Seules les catégories avec des produits sont affichées
- Limitation à 6 produits par catégorie (avec indicateur "+X autres")
- Limitation à 8 suppléments (avec indicateur "+X autres")
- Statut de disponibilité pour chaque produit

## 🛠️ **Configuration requise**

### **1. Base de données initialisée**
Utilisez le composant `ApiTest` dans l'admin pour initialiser :
```bash
# Cliquez sur "🎉 Initialisation complète" pour tout initialiser
# Ou utilisez "Ajouter produits uniquement" pour les produits seuls
```

### **2. Modèles Mongoose créés**
- ✅ `Category` - Catégories de produits
- ✅ `Product` - Produits avec prix et catégories
- ✅ `Extra` - Suppléments et extras
- ✅ `Sauce` - Sauces disponibles
- ✅ `Supplement` - Suppléments gratuits
- ✅ `Accompagnement` - Accompagnements
- ✅ `Boisson` - Boissons

## 📱 **Interface utilisateur**

### **Section Catégories**
- Icône 🏷️ pour chaque catégorie
- Nom et description
- Compteur de produits par catégorie

### **Section Produits**
- Groupés par catégorie
- Image placeholder 🍽️
- Nom, description, prix et disponibilité
- Limitation à 6 produits par section

### **Section Suppléments**
- Grille compacte 4 colonnes
- Icône 🆕 pour chaque extra
- Nom et prix

### **Statistiques**
- Compteurs en temps réel
- Couleurs distinctes pour chaque type
- Mise à jour automatique

## 🔧 **Dépannage**

### **Problème : Aucune donnée affichée**
1. Vérifiez que la base est initialisée (utilisez `ApiTest`)
2. Vérifiez les logs du serveur
3. Utilisez le bouton "Voir les données" pour déboguer

### **Problème : Erreur de chargement**
1. Vérifiez que MongoDB est connecté
2. Vérifiez que les modèles sont correctement définis
3. Regardez la console du navigateur pour les erreurs

### **Problème : Données incomplètes**
1. Utilisez "🎉 Initialisation complète" dans `ApiTest`
2. Vérifiez que `data.ts` contient toutes les données
3. Vérifiez les logs d'initialisation

## 📊 **Données attendues après initialisation**

- **7 catégories** (Assiette, Sandwich, Tacos, Bicky, Snacks, Dessert, Boissons)
- **42 produits** (6 par catégorie)
- **4 extras** (suppléments payants)
- **4 sauces**
- **5 suppléments** (gratuits)
- **4 accompagnements**
- **6 boissons**

## 🎨 **Personnalisation**

### **Modifier l'apparence**
- Les styles sont dans `src/app/page.tsx`
- Utilise Tailwind CSS pour les modifications
- Les couleurs et animations peuvent être ajustées

### **Ajouter de nouveaux types**
- Créez le modèle Mongoose
- Ajoutez la route API publique
- Modifiez l'interface et l'affichage

### **Modifier les limites**
- Changez `slice(0, 6)` pour les produits
- Changez `slice(0, 8)` pour les suppléments
- Ajustez les grilles CSS selon vos besoins

## 🚀 **Prochaines étapes**

1. **Images réelles** : Remplacez les placeholders par de vraies images
2. **Filtres** : Ajoutez des filtres par prix, disponibilité, etc.
3. **Recherche** : Implémentez une barre de recherche
4. **Pagination** : Ajoutez une pagination pour les grandes listes
5. **Panier** : Intégrez un système de panier d'achat

---

**🎉 Votre page principale affiche maintenant dynamiquement tout le contenu de votre base de données !**
