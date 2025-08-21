# 🧪 Guide de Test - Intégration MongoDB

## 📋 **Vue d'Ensemble**

Ce guide détaille comment tester l'intégration MongoDB de votre application restaurant. Tous les composants ont été migrés de `data.ts` vers MongoDB avec un service de cache intelligent.

## 🚀 **Démarrage Rapide**

### 1. **Démarrer l'Application**
```bash
npm run dev
```

### 2. **Accéder à la Page de Test**
```
http://localhost:3000/test-mongodb
```

### 3. **Vérifier la Console**
Ouvrez les outils de développement (F12) pour voir les logs de test.

## 🧪 **Tests Disponibles**

### 📊 **Test MongoDB (DataTest)**
- **Objectif** : Vérifier la connexion et le chargement des données
- **Fonctionnalités** :
  - Chargement des catégories
  - Chargement des suppléments, extras, sauces
  - Chargement des accompagnements et boissons
  - Test du bouton "Rafraîchir" (vide le cache)
- **Indicateurs de succès** :
  - ✅ Données chargées sans erreur
  - ✅ Bouton "Rafraîchir" fonctionne
  - ✅ Console affiche les données

### 🔘 **Test Button (ButtonTest)**
- **Objectif** : Vérifier que le composant Button fonctionne après la refactorisation
- **Fonctionnalités** :
  - Affichage de tous les variants (default, destructive, outline, etc.)
  - Affichage de toutes les tailles (sm, default, lg, icon)
  - Test des états (disabled, custom classes)
- **Indicateurs de succès** :
  - ✅ Tous les variants s'affichent correctement
  - ✅ Toutes les tailles sont visibles
  - ✅ Styles Tailwind appliqués correctement

### 🦶 **Test Footer (Footer)**
- **Objectif** : Vérifier que Footer charge les données depuis MongoDB
- **Fonctionnalités** :
  - Chargement des catégories depuis `dataService`
  - Détection des commandes avec étapes
  - Gestion du panier
- **Indicateurs de succès** :
  - ✅ Footer s'affiche sans erreur
  - ✅ Catégories chargées depuis MongoDB
  - ✅ Logique des étapes fonctionne

### 📱 **Test MainPageCommand (MainPageCommand1)**
- **Objectif** : Vérifier que MainPageCommand utilise MongoDB
- **Fonctionnalités** :
  - Affichage des commandes de test
  - Intégration avec le service MongoDB
  - Gestion des données dynamiques
- **Indicateurs de succès** :
  - ✅ Composant s'affiche avec les données de test
  - ✅ Aucune erreur dans la console
  - ✅ Interface responsive

### 📋 **Test des Étapes (StepsTest)**
- **Objectif** : Vérifier le chargement des étapes selon les catégories
- **Fonctionnalités** :
  - Sélection de catégories
  - Chargement dynamique des étapes
  - Affichage des options disponibles
  - Test du cache
- **Indicateurs de succès** :
  - ✅ Catégories se chargent
  - ✅ Étapes se chargent pour chaque catégorie
  - ✅ Cache fonctionne (deuxième appel plus rapide)
  - ✅ Bouton "Rafraîchir" vide le cache

### 🚀 **Test de Performance (PerformanceTest)**
- **Objectif** : Optimiser le cache selon vos besoins
- **Fonctionnalités** :
  - Test de performance avec/sans cache
  - Test de charge (appels simultanés)
  - Mesure des temps de réponse
  - Recommandations d'optimisation
- **Indicateurs de succès** :
  - ✅ Premier appel plus lent que les suivants
  - ✅ Cache améliore les performances
  - ✅ Test de charge géré correctement
  - ✅ Recommandations affichées

## 🔍 **Détection des Problèmes**

### ❌ **Erreurs Communes**

#### 1. **Erreur de Connexion MongoDB**
```
❌ Erreur lors du chargement des données: Error: connect ECONNREFUSED
```
**Solution** : Vérifier que MongoDB est démarré et accessible

#### 2. **Données Non Chargées**
```
❌ Aucune donnée chargée
```
**Solution** : Vérifier que la base de données contient des données

#### 3. **Erreur de Cache**
```
❌ Cache ne fonctionne pas
```
**Solution** : Vérifier que `dataService.ts` est correctement configuré

#### 4. **Composants Non Affichés**
```
❌ Composant ne s'affiche pas
```
**Solution** : Vérifier les imports et les dépendances

### ✅ **Vérifications de Base**

1. **Console du Navigateur** : Aucune erreur JavaScript
2. **Réseau** : Appels API MongoDB réussis
3. **État** : Composants affichent "Chargement..." puis les données
4. **Cache** : Deuxième appel plus rapide que le premier

## 🚀 **Optimisation du Cache**

### ⚡ **Configuration Actuelle**
- **Durée** : 5 minutes
- **Type** : Mémoire (in-memory)
- **Stratégie** : Cache-aside avec TTL

### 🔧 **Personnalisation**

#### **Cache Court (1-2 min)**
```typescript
// Dans dataService.ts
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute
```
**Utilisation** : Données qui changent fréquemment

#### **Cache Moyen (5-10 min)**
```typescript
// Dans dataService.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (recommandé)
```
**Utilisation** : Données semi-statiques

#### **Cache Long (15-30 min)**
```typescript
// Dans dataService.ts
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
```
**Utilisation** : Données très statiques

### 📊 **Métriques de Performance**

- **Premier appel** : 100-500ms (selon la taille des données)
- **Appels avec cache** : 1-10ms
- **Amélioration attendue** : 80-95%

## 🧭 **Navigation et Tests**

### **Ordre de Test Recommandé**

1. **Test MongoDB** → Vérifier la connexion
2. **Test Button** → Vérifier les composants UI
3. **Test Footer** → Vérifier l'intégration MongoDB
4. **Test MainPageCommand** → Vérifier l'affichage
5. **Test des Étapes** → Vérifier la logique métier
6. **Test de Performance** → Optimiser le cache

### **Tests de Navigation**

- **Entre composants** : Utiliser les boutons de navigation
- **Vers le panier** : Tester l'ajout/suppression d'articles
- **Modification des étapes** : Tester la logique des étapes

## 📝 **Logs et Debug**

### **Console du Navigateur**
```javascript
// Logs de test
🧪 Test 1: Premier appel (sans cache)
⏱️ Durée: 245.67ms, Données: 3
🧪 Test 2: Deuxième appel (avec cache)
⏱️ Durée: 2.34ms, Données: 3
🚀 Amélioration avec le cache: 99.0%
```

### **Informations de Debug**
- **Catégories chargées** : Nombre de catégories MongoDB
- **Catégorie sélectionnée** : Catégorie actuellement testée
- **Étapes chargées** : Nombre d'étapes pour la catégorie
- **Cache actif** : Statut du cache

## 🔄 **Maintenance et Mise à Jour**

### **Vider le Cache**
- **Manuel** : Bouton "Rafraîchir" dans les tests
- **Programmatique** : `refreshCache()` dans le code
- **Automatique** : Après expiration du TTL

### **Mise à Jour des Données**
1. Modifier les données dans MongoDB
2. Vider le cache manuellement
3. Tester le rechargement

### **Surveillance des Performances**
- Utiliser le **Test de Performance** régulièrement
- Surveiller les temps de réponse
- Ajuster la durée du cache selon les besoins

## 🎯 **Objectifs de Test**

### **Phase 1 : Fonctionnalité** ✅
- [x] Migration de `data.ts` vers MongoDB
- [x] Composants utilisent `dataService`
- [x] Cache intelligent implémenté
- [x] Gestion d'erreurs avec fallback

### **Phase 2 : Performance** 🚀
- [x] Tests de performance créés
- [x] Métriques de cache mesurées
- [x] Recommandations d'optimisation
- [x] Tests de charge implémentés

### **Phase 3 : Production** 🚀
- [ ] Remplacer données de test par vraies données
- [ ] Optimiser le cache selon l'usage réel
- [ ] Tests en conditions réelles
- [ ] Déploiement en production

## 📞 **Support et Aide**

### **En Cas de Problème**
1. Vérifier la console du navigateur
2. Vérifier la connexion MongoDB
3. Tester chaque composant individuellement
4. Utiliser les composants de test pour diagnostiquer

### **Logs Utiles**
- **Console** : Erreurs JavaScript et logs de test
- **Réseau** : Appels API et temps de réponse
- **Performance** : Métriques de cache et de charge

---

**🎉 Félicitations !** Votre application utilise maintenant MongoDB avec un cache intelligent et des composants de test complets.


