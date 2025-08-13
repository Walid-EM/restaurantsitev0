# 🍔 API Bicky - Documentation

## 📋 Vue d'ensemble

L'API Bicky permet de gérer les burgers Bicky de votre restaurant. Elle inclut des fonctionnalités complètes pour la création, la lecture, la mise à jour et la suppression des Bicky, avec gestion des caractéristiques spéciales (épicé, végétarien) et des ingrédients.

## 🏗️ Structure des données

### Modèle Bicky
```typescript
interface IBicky {
  _id: string;
  name: string;           // Nom du Bicky
  description: string;    // Description détaillée
  price: number;          // Prix en euros
  image: string;          // URL de l'image
  isAvailable: boolean;   // Disponibilité
  ingredients: string[];  // Liste des ingrédients
  isSpicy: boolean;       // Est-ce épicé ?
  isVegetarian: boolean;  // Est-ce végétarien ?
  createdAt: Date;        // Date de création
  updatedAt: Date;        // Date de modification
}
```

## 🛠️ Endpoints disponibles

### 1. **API Publique** (sans authentification)

#### `GET /api/bicky`
Récupère tous les Bicky disponibles.

**Réponse :**
```json
{
  "success": true,
  "bickies": [...],
  "count": 5
}
```

### 2. **API Admin** (avec authentification)

#### `GET /api/admin/bicky`
Récupère tous les Bicky (admin uniquement).

#### `POST /api/admin/bicky`
Crée un nouveau Bicky.

**Corps de la requête :**
```json
{
  "name": "Bicky Classic",
  "description": "Le Bicky original avec viande de bœuf",
  "price": 6.50,
  "image": "/bicky-classic.png",
  "isAvailable": true,
  "ingredients": ["Viande de bœuf", "Salade", "Oignons"],
  "isSpicy": false,
  "isVegetarian": false
}
```

#### `GET /api/admin/bicky/[id]`
Récupère un Bicky spécifique par ID.

#### `PUT /api/admin/bicky/[id]`
Met à jour un Bicky existant.

#### `DELETE /api/admin/bicky/[id]`
Supprime un Bicky.

### 3. **API d'initialisation**

#### `POST /api/admin/setup/init-bicky`
Initialise la base de données avec les Bicky définis dans data.ts.

**Bicky créés depuis data.ts :**
- **Bicky Hamburger** (8.50€) - Bicky Hamburger
- **Double Bicky Burger** (12.90€) - Double Bicky Burger  
- **Bicky Poulet** (9.50€) - Bicky Poulet
- **Bicky Kebab** (10.50€) - Bicky Kebab
- **Bicky Kefta** (11.90€) - Bicky Kefta (🔥 Épicé)
- **Bicky Boulette** (14.90€) - Bicky Boulette

#### `GET /api/admin/setup/init-bicky`
Vérifie l'état des Bicky dans la base de données.

## 🎨 Affichage sur la page principale

Les Bicky sont automatiquement affichés dans la page "La Carte" avec :

- **Style rouge** pour les distinguer des autres produits
- **Badges visuels** pour épicé (🔥) et végétarien (🥬)
- **Liste des ingrédients** (limités à 3 + compteur)
- **Prix en rouge** pour la cohérence visuelle
- **Statut de disponibilité**

## 🚀 Utilisation

### 1. **Initialisation des données**
```bash
# Via l'interface admin
POST /api/admin/setup/init-bicky

# Ou initialisation complète
POST /api/admin/setup/init-all
```

### 2. **Création d'un Bicky personnalisé**
```bash
POST /api/admin/bicky
{
  "name": "Mon Bicky",
  "description": "Description personnalisée",
  "price": 8.00,
  "image": "/mon-bicky.png",
  "isAvailable": true,
  "ingredients": ["Ingrédient 1", "Ingrédient 2"],
  "isSpicy": true,
  "isVegetarian": false
}
```

### 3. **Récupération des Bicky**
```bash
# Tous les Bicky (public)
GET /api/bicky

# Tous les Bicky (admin)
GET /api/admin/bicky
```

## 🔒 Sécurité

- **API publique** : Lecture seule des Bicky disponibles
- **API admin** : Authentification requise avec rôle admin
- **Validation** : Tous les champs obligatoires sont validés
- **Sanitisation** : Les données sont nettoyées avant stockage

## 📊 Intégration avec les statistiques

Les Bicky sont inclus dans :
- **Statistiques du menu** sur la page principale
- **Compteurs de disponibilité** (produits + Bicky disponibles)
- **API de test** (`/api/test-data`) pour le debugging

## 🎯 Fonctionnalités spéciales

### Badges automatiques
- **🔥 Épicé** : Affiché automatiquement si `isSpicy: true`
- **🥬 Végétarien** : Affiché automatiquement si `isVegetarian: true`

### Gestion des ingrédients
- Affichage des 3 premiers ingrédients
- Compteur "+X" pour les ingrédients supplémentaires
- Formatage automatique en tags visuels

### Responsive design
- Grille adaptative (1-2-3 colonnes selon l'écran)
- Animations au survol
- Transitions fluides

## 🐛 Dépannage

### Problèmes courants

1. **Bicky non affichés**
   - Vérifiez que la base est initialisée
   - Utilisez le bouton "🍔 Initialiser Bicky"
   - Vérifiez les logs de la console

2. **Erreurs d'authentification**
   - Connectez-vous en tant qu'admin
   - Vérifiez que la session est active
   - Utilisez `credentials: 'include'` dans les requêtes

3. **Données manquantes**
   - Utilisez "🎉 Initialisation complète"
   - Vérifiez l'état avec "Vérifier contenu actuel"
   - Consultez les logs du serveur

## 📝 Exemples d'utilisation

### Créer un Bicky via l'interface admin
1. Allez sur `/admin`
2. Connectez-vous en tant qu'admin
3. Utilisez l'API ou créez directement en base

### Tester l'API
```bash
# Test de l'API publique
curl http://localhost:3000/api/bicky

# Test de l'API admin (avec session)
curl -X POST http://localhost:3000/api/admin/setup/init-bicky \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json"
```

## 🔄 Mise à jour

L'API Bicky est entièrement intégrée avec :
- **NextAuth.js** pour l'authentification
- **MongoDB/Mongoose** pour le stockage
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le style
- **React Hooks** pour la gestion d'état

---

**🎉 Votre API Bicky est maintenant prête à l'emploi !**
