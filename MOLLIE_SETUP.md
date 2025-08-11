# Configuration Mollie pour votre restaurant

## 🚀 Installation et configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet avec :

```bash
# Mollie API Configuration
MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base URL de votre application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Obtenir votre clé API Mollie

1. Créez un compte sur [Mollie.com](https://www.mollie.com)
2. Allez dans votre dashboard
3. Récupérez votre clé API de test (commence par `test_`)
4. Pour la production, utilisez votre clé live (commence par `live_`)

### 3. Configuration des webhooks

Dans votre dashboard Mollie, configurez l'URL webhook :
```
https://votre-domaine.com/api/mollie/webhook
```

## 🔧 Fonctionnalités implémentées

### ✅ Système de paiement complet
- Modal de paiement moderne et responsive
- Collecte des informations client
- Support de multiples méthodes de paiement
- Gestion des erreurs et validation
- Page de succès après paiement

### ✅ API Routes
- `/api/mollie/create-payment` - Création des paiements
- `/api/mollie/webhook` - Gestion des notifications

### ✅ Méthodes de paiement supportées
- Cartes bancaires
- PayPal
- iDEAL (Pays-Bas)
- Bancontact (Belgique)
- SOFORT (Allemagne)

## 🎨 Interface utilisateur

Le modal de paiement inclut :
- Formulaire client complet
- Affichage des méthodes de paiement
- Résumé de la commande
- Indicateurs de sécurité
- Design moderne et responsive

## 🔒 Sécurité

- Validation côté client et serveur
- Chiffrement SSL
- Gestion sécurisée des webhooks
- Validation des données d'entrée

## 🚀 Utilisation

1. L'utilisateur clique sur "COMMANDER"
2. Le modal de paiement s'ouvre
3. Il remplit ses informations
4. Il est redirigé vers Mollie pour le paiement
5. Après paiement, il revient sur votre site
6. Le webhook met à jour le statut de la commande

## 📱 Responsive

Le système est entièrement responsive et fonctionne sur :
- Desktop
- Tablette
- Mobile

## 🎯 Personnalisation

Vous pouvez facilement personnaliser :
- Les méthodes de paiement
- Les champs client
- Le design du modal
- Les messages d'erreur
- La logique métier dans les webhooks

## 🔍 Débogage

Pour tester en développement :
1. Utilisez votre clé API de test
2. Vérifiez les logs de la console
3. Testez avec des montants faibles
4. Vérifiez les webhooks dans le dashboard Mollie

## 📞 Support

En cas de problème :
1. Vérifiez vos variables d'environnement
2. Consultez les logs de la console
3. Vérifiez le statut de votre compte Mollie
4. Contactez le support Mollie si nécessaire

## 🎉 Prêt pour la production

Avant de passer en production :
1. Remplacez `test_` par `live_` dans votre clé API
2. Mettez à jour `NEXT_PUBLIC_BASE_URL`
3. Testez avec de vrais paiements
4. Configurez vos webhooks de production
5. Vérifiez la conformité RGPD
