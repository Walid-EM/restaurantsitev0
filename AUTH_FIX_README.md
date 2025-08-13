# 🔐 Correction du problème d'authentification NextAuth

## Problème identifié

L'API route Next.js utilisait `getServerSession()` sans arguments, ce qui ne fonctionne pas dans Next.js 13+ avec app router. De plus, le frontend n'envoyait pas les cookies de session avec les requêtes API.

## Solutions implémentées

### 1. Configuration NextAuth centralisée
- ✅ Créé `src/lib/auth.ts` avec les `authOptions` exportés
- ✅ Mis à jour `src/app/api/auth/[...nextauth]/route.ts` pour utiliser ces options

### 2. Correction de l'API route des catégories
- ✅ Modifié `checkAdminPermissions()` pour accepter le paramètre `request`
- ✅ Ajouté `getServerSession(authOptions)` au lieu de `getServerSession()`
- ✅ Mis à jour les signatures des fonctions GET et POST

### 3. Correction du frontend
- ✅ Ajouté `credentials: 'include'` à tous les appels `fetch`
- ✅ Créé des fonctions utilitaires dans `src/lib/adminApi.ts`
- ✅ Remplacé tous les appels `fetch` par les fonctions utilitaires

### 4. Composant de test
- ✅ Créé `src/app/components/ApiTest.tsx` pour tester les API
- ✅ Ajouté une route de test `/api/admin/categories/test` sans vérification admin
- ✅ Intégré le composant de test dans la page admin

## Fichiers modifiés

```
src/
├── lib/
│   ├── auth.ts (NOUVEAU)
│   └── adminApi.ts (NOUVEAU)
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── admin/categories/
│   │       ├── route.ts
│   │       └── test/route.ts (NOUVEAU)
│   ├── admin/page.tsx
│   └── components/
│       └── ApiTest.tsx (NOUVEAU)
```

## Comment tester

1. **Connectez-vous en tant qu'admin** sur `/admin/login`
2. **Allez sur la page admin** `/admin`
3. **Utilisez le composant de test** pour vérifier :
   - La session active
   - L'API avec authentification
   - L'API sans authentification

## Points clés

- **Session** : `getServerSession(authOptions)` au lieu de `getServerSession()`
- **Cookies** : `credentials: 'include'` dans tous les appels API
- **Configuration** : `authOptions` centralisés et typés
- **Test** : Route de test pour isoler les problèmes

## Vérification

Après ces corrections, vous devriez voir :
- ✅ Les données MongoDB s'afficher correctement
- ✅ Plus d'erreurs "Accès refusé"
- ✅ La session admin correctement reconnue
- ✅ Les cookies envoyés avec chaque requête API

## Prochaines étapes

1. Tester toutes les API admin
2. Appliquer le même pattern aux autres routes API
3. Supprimer la route de test une fois confirmé que tout fonctionne
4. Vérifier que le déploiement sur Vercel fonctionne correctement
