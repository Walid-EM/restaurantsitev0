# 🔄 Intégration MongoDB dans les Composants UI

## 📋 Vue d'ensemble

Ce document décrit l'intégration de MongoDB dans les composants `Footer.tsx` et `MainPageCommand1.tsx`, remplaçant l'utilisation du fichier statique `data.ts`.

## 🏗️ Architecture

### 1. Service de Données (`src/lib/dataService.ts`)

Le service centralise toutes les opérations de lecture depuis MongoDB :

- **Cache intelligent** : 5 minutes de cache pour optimiser les performances
- **Gestion d'erreurs** : Fallback sur le cache en cas d'erreur
- **API unifiée** : Interface cohérente pour tous les types de données

```typescript
// Exemple d'utilisation
import { getCategoriesWithSteps, getSupplements } from '@/lib/dataService';

const categories = await getCategoriesWithSteps();
const supplements = await getSupplements();
```

### 2. Composants Adaptés

#### Footer.tsx
- ✅ Récupère les catégories depuis MongoDB
- ✅ Gère les étapes dynamiquement selon `allowedOptions`
- ✅ Indicateur de chargement pendant la récupération des données
- ✅ Cache des données pour éviter les appels répétés

#### MainPageCommand1.tsx
- ✅ Charge toutes les données au montage du composant
- ✅ Gestion des étapes personnalisées par catégorie
- ✅ Interface utilisateur adaptative selon les données disponibles

## 🔧 Fonctionnalités

### Cache et Performance
- **Durée** : 5 minutes
- **Gestion automatique** : Invalidation et rechargement
- **Fallback** : Utilisation du cache en cas d'erreur réseau

### Gestion des Étapes
- **Configuration dynamique** : Basée sur `allowedOptions` des catégories
- **Types supportés** : supplements, extras, sauces, accompagnements, boissons
- **Titres personnalisés** : Gérés automatiquement selon le type

### Gestion d'Erreurs
- **Logs détaillés** : Console pour le debugging
- **Fallback gracieux** : Affichage d'états d'erreur utilisateur
- **Retry automatique** : Possibilité de recharger les données

## 📱 Interface Utilisateur

### États de Chargement
```typescript
if (loading) {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2">
      Chargement des données...
    </div>
  );
}
```

### Gestion des Images
```typescript
<img 
  src={item.image} 
  alt={item.name}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.png';
  }}
/>
```

## 🚀 Utilisation

### 1. Import du Service
```typescript
import { 
  getCategoriesWithSteps, 
  getSupplements,
  refreshCache 
} from '@/lib/dataService';
```

### 2. Chargement des Données
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const categories = await getCategoriesWithSteps();
      setCategories(categories);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  loadData();
}, []);
```

### 3. Rafraîchissement du Cache
```typescript
const handleRefresh = () => {
  refreshCache(); // Vide le cache
  loadData();     // Recharge les données
};
```

## 🔍 Débogage

### Composant de Test
Un composant `DataTest.tsx` est disponible pour tester l'intégration :

- Affichage de toutes les données récupérées
- Bouton de rafraîchissement du cache
- Gestion des erreurs et états de chargement

### Logs Console
```typescript
console.log('🔄 Récupération des données depuis MongoDB...');
console.log('✅ Données récupérées avec succès:', data);
console.log('⚠️ Utilisation du cache existant en raison d\'une erreur');
```

## ⚠️ Points d'Attention

### 1. Structure des Données
- Les catégories doivent avoir un champ `allowedOptions` pour les étapes
- Les images doivent être des URLs valides ou avoir un fallback
- Les IDs peuvent être `_id` (MongoDB) ou `id` (compatibilité)

### 2. Performance
- Le cache réduit les appels API mais peut masquer les mises à jour
- Utiliser `refreshCache()` pour forcer le rechargement
- Surveiller la taille du cache en développement

### 3. Gestion d'Erreurs
- Toujours gérer les cas d'erreur réseau
- Fournir des fallbacks pour une meilleure UX
- Logger les erreurs pour le debugging

## 🔮 Évolutions Futures

### 1. Optimisations
- Cache persistant (localStorage)
- Synchronisation en temps réel
- Pagination des données

### 2. Fonctionnalités
- Recherche et filtrage côté client
- Tri dynamique des données
- Export des données

### 3. Monitoring
- Métriques de performance
- Alertes d'erreur
- Analytics d'utilisation

## 📚 Ressources

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Note** : Cette intégration maintient la compatibilité avec l'ancien système tout en ajoutant la flexibilité de MongoDB. Les composants existants continuent de fonctionner avec des améliorations de performance et de fiabilité.

