# Intégration VPS - Lightspeed OAuth

## 📡 Données envoyées au VPS

### **URL de callback OAuth :**
```
https://mon-vps.com/oauth/callback?[paramètres]
```

### **Paramètres envoyés :**

#### **1. Identifiants de session**
- `session_id` : Token CSRF unique pour identifier la session
- `return_url` : URL de retour vers le site web
- `timestamp` : Horodatage ISO de l'initiation de la connexion

#### **2. Informations du restaurant**
- `restaurant_id` : "RESTAURANT_001" (à configurer)
- `restaurant_name` : "Delice Wand" (à configurer)
- `timezone` : "Europe/Paris" (à configurer)
- `currency` : "EUR" (à configurer)

#### **3. Informations de l'utilisateur**
- `admin_user_id` : ID de l'admin qui initie la connexion
- `user_agent` : Navigateur et système d'exploitation

#### **4. Préférences de synchronisation**
- `sync_products` : "true" (synchroniser le catalogue)
- `sync_inventory` : "true" (synchroniser les stocks)
- `sync_orders` : "true" (synchroniser les commandes)
- `sync_customers` : "false" (ne pas synchroniser les clients)
- `sync_interval` : "realtime" (fréquence de synchronisation)

## 🔄 Flux OAuth complet

### **Étape 1 : Initiation côté client**
1. Admin clique sur "Se connecter à Lightspeed"
2. Collecte des métadonnées (restaurant, sync, timestamp)
3. Validation des données
4. Génération des tokens de sécurité
5. Construction de l'URL de callback avec tous les paramètres

### **Étape 2 : Redirection vers Lightspeed**
```
https://cloud.lightspeedapp.com/oauth/authorize.php?
  client_id=VOTRE_CLIENT_ID&
  response_type=code&
  redirect_uri=https://mon-vps.com/oauth/callback?[tous_les_paramètres]&
  scope=Sale:read,Sale:write,Employee:read,Register:read&
  state=[token_csrf]
```

### **Étape 3 : Callback VPS**
1. Lightspeed redirige vers le VPS avec le code d'autorisation
2. VPS reçoit TOUTES les métadonnées dans l'URL
3. VPS peut configurer automatiquement la synchronisation
4. VPS échange le code contre un access token
5. VPS redirige vers le site web avec confirmation

## 🛠️ Implémentation côté VPS

### **Endpoint de callback requis :**
```javascript
// POST /oauth/callback
app.post('/oauth/callback', (req, res) => {
  const {
    session_id,
    return_url,
    restaurant_id,
    restaurant_name,
    timezone,
    currency,
    admin_user_id,
    timestamp,
    user_agent,
    sync_products,
    sync_inventory,
    sync_orders,
    sync_customers,
    sync_interval
  } = req.query;

  // 1. Valider la session
  // 2. Configurer la synchronisation selon les préférences
  // 3. Échanger le code OAuth contre un token
  // 4. Rediriger vers return_url avec confirmation
});
```

### **Configuration automatique :**
Le VPS peut maintenant :
- **Identifier** le restaurant et l'admin
- **Configurer** la synchronisation selon les préférences
- **Traçer** qui et quand a initié la connexion
- **Sécuriser** avec les tokens CSRF
- **Personnaliser** selon le fuseau horaire et la devise

## 🔒 Sécurité

- **session_id** : Token CSRF unique pour chaque tentative
- **state** : Token CSRF supplémentaire pour Lightspeed
- **timestamp** : Détection des tentatives expirées
- **user_agent** : Détection des connexions suspectes

## 📝 Configuration requise

### **Côté client (à modifier) :**
```javascript
restaurantInfo: {
  restaurantId: "VOTRE_VRAI_ID",      // ❌ À configurer
  restaurantName: "Votre Nom",        // ❌ À configurer
  timezone: "Votre/Fuseau",           // ❌ À configurer
  currency: "Votre_Devise"            // ❌ À configurer
}
```

### **Côté VPS (à implémenter) :**
- Endpoint `/oauth/callback`
- Endpoint `/oauth/status` (optionnel)
- Logique de synchronisation selon les préférences
- Stockage sécurisé des tokens OAuth

## 🚀 Avantages de cette implémentation

1. **Configuration automatique** : Le VPS se configure tout seul
2. **Traçabilité complète** : Qui, quand, quoi synchroniser
3. **Flexibilité** : Chaque restaurant peut avoir ses préférences
4. **Sécurité** : Tokens CSRF et validation des données
5. **Maintenance** : Pas besoin de reconfigurer le VPS pour chaque restaurant


