# 🚀 Guide de Déploiement en Production - MongoDB

## 📋 **Vue d'Ensemble**

Ce guide détaille comment déployer votre application restaurant avec l'intégration MongoDB en production. Nous couvrons la configuration, l'optimisation, la sécurité et le monitoring.

## 🔧 **Prérequis**

### **Environnement de Production**
- ✅ Serveur VPS/Dedicated avec Node.js 18+
- ✅ MongoDB 6.0+ installé et configuré
- ✅ Nginx ou Apache pour le reverse proxy
- ✅ Certificat SSL (Let's Encrypt recommandé)
- ✅ PM2 ou Docker pour la gestion des processus

### **Variables d'Environnement**
```bash
# .env.production
NODE_ENV=production
MONGODB_URI=mongodb://username:password@localhost:27017/restaurant_prod
MONGODB_USER=restaurant_user
MONGODB_PASS=secure_password_here
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=https://yourdomain.com
```

## 🚀 **Étape 1 : Préparation de l'Application**

### **Build de Production**
```bash
# Installer les dépendances de production
npm ci --only=production

# Build de l'application
npm run build

# Vérifier le build
npm run start
```

### **Optimisation du Cache**
```typescript
// src/lib/dataService.ts - Configuration production
const CACHE_DURATION = process.env.NODE_ENV === 'production' 
  ? 15 * 60 * 1000  // 15 minutes en production
  : 5 * 60 * 1000;  // 5 minutes en développement

// Cache Redis pour la production (optionnel)
const useRedis = process.env.NODE_ENV === 'production' && process.env.REDIS_URL;
```

## 🗄️ **Étape 2 : Configuration MongoDB Production**

### **Sécurité de la Base de Données**
```javascript
// Créer un utilisateur dédié
use restaurant_prod
db.createUser({
  user: "restaurant_user",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "restaurant_prod" },
    { role: "dbAdmin", db: "restaurant_prod" }
  ]
})

// Activer l'authentification
security:
  authorization: enabled
```

### **Index et Optimisation**
```javascript
// Index pour les performances
db.categories.createIndex({ "name": 1 })
db.products.createIndex({ "category": 1, "isAvailable": 1 })
db.products.createIndex({ "name": "text", "description": "text" })

// Index pour les recherches fréquentes
db.supplements.createIndex({ "isActive": 1 })
db.extras.createIndex({ "isActive": 1 })
db.sauces.createIndex({ "isActive": 1 })
```

### **Backup et Maintenance**
```bash
# Script de backup automatique
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db restaurant_prod --out /backups/mongodb_$DATE
tar -czf /backups/mongodb_$DATE.tar.gz /backups/mongodb_$DATE
rm -rf /backups/mongodb_$DATE

# Ajouter au crontab
0 2 * * * /path/to/backup_script.sh
```

## 🌐 **Étape 3 : Configuration du Serveur Web**

### **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/restaurant
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Optimisations SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache statique
    location /_next/static/ {
        alias /var/www/restaurant/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias /var/www/restaurant/public/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Proxy vers l'application Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **PM2 Configuration**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'restaurant-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/restaurant',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Monitoring et restart automatique
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/restaurant-error.log',
    out_file: '/var/log/pm2/restaurant-out.log',
    log_file: '/var/log/pm2/restaurant-combined.log',
    time: true
  }]
};
```

## 🔒 **Étape 4 : Sécurité et Monitoring**

### **Firewall Configuration**
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 27017/tcp   # MongoDB (si externe)
sudo ufw enable

# iptables (CentOS/RHEL)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
```

### **Monitoring avec PM2**
```bash
# Dashboard PM2
pm2 monit

# Logs en temps réel
pm2 logs restaurant-app

# Statistiques
pm2 show restaurant-app

# Restart automatique en cas de crash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### **Logs et Surveillance**
```bash
# Rotation des logs
sudo logrotate -f /etc/logrotate.d/restaurant

# Monitoring des ressources
htop
iotop
nethogs

# Surveillance MongoDB
mongosh --eval "db.serverStatus()"
mongosh --eval "db.stats()"
```

## 📊 **Étape 5 : Tests de Production**

### **Tests de Charge**
```bash
# Installation d'Artillery
npm install -g artillery

# Test de charge basique
artillery quick --count 100 --num 10 http://yourdomain.com

# Test de charge avancé
artillery run load-test.yml
```

### **Test de Performance**
```bash
# Test avec Lighthouse
npm install -g lighthouse
lighthouse https://yourdomain.com --output html --output-path ./lighthouse-report.html

# Test avec WebPageTest
# Visiter https://www.webpagetest.org/
```

### **Monitoring des Performances**
```typescript
// Ajouter des métriques de performance
export async function getCategoriesWithSteps(): Promise<Category[]> {
  const start = performance.now();
  
  try {
    const result = await fetchFromAPI<Category>('/api/categories');
    const duration = performance.now() - start;
    
    // Log des métriques en production
    if (process.env.NODE_ENV === 'production') {
      console.log(`📊 API Performance: ${duration.toFixed(2)}ms`);
      
      // Envoyer à un service de monitoring (ex: DataDog, New Relic)
      if (duration > 1000) {
        console.warn(`⚠️ API lente: ${duration.toFixed(2)}ms`);
      }
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ API Error après ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}
```

## 🔄 **Étape 6 : Déploiement Continu**

### **Script de Déploiement**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement en cours..."

# Sauvegarder la version actuelle
pm2 stop restaurant-app
cp -r /var/www/restaurant /var/www/restaurant_backup_$(date +%Y%m%d_%H%M%S)

# Mettre à jour le code
cd /var/www/restaurant
git pull origin main

# Installer les dépendances
npm ci --only=production

# Build de l'application
npm run build

# Redémarrer l'application
pm2 start ecosystem.config.js --env production
pm2 save

# Vérifier le statut
pm2 status

echo "✅ Déploiement terminé !"
```

### **GitHub Actions (Optionnel)**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/restaurant
          git pull origin main
          npm ci --only=production
          npm run build
          pm2 restart restaurant-app
```

## 🚨 **Étape 7 : Gestion des Incidents**

### **Procédure de Rollback**
```bash
# Rollback rapide
pm2 stop restaurant-app
rm -rf /var/www/restaurant
cp -r /var/www/restaurant_backup_$(date +%Y%m%d_%H%M%S) /var/www/restaurant
cd /var/www/restaurant
pm2 start ecosystem.config.js --env production

echo "🔄 Rollback effectué !"
```

### **Monitoring des Erreurs**
```typescript
// Gestion globale des erreurs
process.on('uncaughtException', (error) => {
  console.error('🚨 Erreur non gérée:', error);
  
  // Envoyer à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
  
  // Graceful shutdown
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Promise rejetée:', reason);
  
  // Envoyer à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
});
```

## 📈 **Étape 8 : Optimisation Continue**

### **Métriques à Surveiller**
- **Performance** : Temps de réponse API, temps de chargement des pages
- **Disponibilité** : Uptime, temps de réponse des services
- **Ressources** : CPU, mémoire, disque, réseau
- **Base de données** : Temps de requête, taille des collections
- **Cache** : Hit rate, temps de réponse avec/sans cache

### **Optimisations Recommandées**
```typescript
// 1. Cache Redis pour la production
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCategoriesWithSteps(): Promise<Category[]> {
  const cacheKey = 'categories_with_steps';
  
  // Vérifier le cache Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Récupérer depuis MongoDB
  const data = await fetchFromAPI<Category>('/api/categories');
  
  // Mettre en cache (15 minutes)
  await redis.setex(cacheKey, 900, JSON.stringify(data));
  
  return data;
}

// 2. Compression des réponses
// Dans next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false
};

// 3. Optimisation des images
// Dans next.config.js
const nextConfig = {
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
  }
};
```

## 🎯 **Checklist de Déploiement**

### **Avant le Déploiement**
- [ ] Tests complets passent en local
- [ ] Variables d'environnement configurées
- [ ] Base de données optimisée et sécurisée
- [ ] Certificats SSL installés
- [ ] Firewall configuré
- [ ] Scripts de backup en place

### **Pendant le Déploiement**
- [ ] Arrêt de l'application
- [ ] Sauvegarde de la version actuelle
- [ ] Mise à jour du code
- [ ] Installation des dépendances
- [ ] Build de l'application
- [ ] Redémarrage avec PM2

### **Après le Déploiement**
- [ ] Vérification du statut PM2
- [ ] Tests de fonctionnalité
- [ ] Vérification des logs
- [ ] Test de performance
- [ ] Monitoring des métriques
- [ ] Documentation des changements

## 🆘 **Support et Maintenance**

### **Contacts d'Urgence**
- **Développeur** : [Votre Email]
- **DevOps** : [Email DevOps]
- **Support MongoDB** : [Contact MongoDB]

### **Documentation**
- **API Documentation** : `/api/docs`
- **Logs** : `/var/log/pm2/`
- **Backups** : `/backups/mongodb/`
- **Configuration** : `/etc/nginx/sites-available/`

---

**🎉 Félicitations !** Votre application est maintenant prête pour la production avec MongoDB.


