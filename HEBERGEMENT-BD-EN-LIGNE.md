# Guide d'Hébergement de la Base de Données en Ligne

## 🌐 Options d'Hébergement Recommandées

### Option 1 : **Render** (Recommandé - Gratuit)
**URL** : https://render.com

#### Étapes :

1. **Créer un compte Render**
   - Allez sur https://render.com
   - Cliquez sur "Sign up"
   - Inscrivez-vous avec GitHub ou Google

2. **Créer une base de données PostgreSQL**
   - Cliquez sur "New +"
   - Sélectionnez "PostgreSQL"
   - Remplissez le formulaire :
     - **Name** : `nlamb-sarre-db`
     - **Region** : Choisissez le plus proche
     - **PostgreSQL Version** : Laissez par défaut
     - **Instance Type** : Gratuit (free)
   - Cliquez sur "Create Database"

3. **Récupérer la chaîne de connexion**
   - Attendez que la BD soit créée (2-3 minutes)
   - Allez dans l'onglet "Connections"
   - Copiez l'URL sous "External Database URL"
   - Elle ressemble à :
     ```
     postgresql://user:password@host:port/database
     ```

4. **Mettre à jour votre `.env`**
   ```env
   DB_HOST=your-render-host.render.com
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

---

### Option 2 : **Railway** (Gratuit - $5/mois crédits)
**URL** : https://railway.app

#### Étapes :

1. **Créer un compte Railway**
   - Allez sur https://railway.app
   - Inscrivez-vous avec GitHub

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Sélectionnez "Provision PostgreSQL"

3. **Configurer la base de données**
   - Attendez le déploiement
   - Allez dans l'onglet "Variables"
   - Copiez les variables d'environnement

4. **Mettre à jour votre `.env`**
   - Railway fournira les variables directement

---

### Option 3 : **ElephantSQL** (Gratuit)
**URL** : https://www.elephantsql.com

#### Étapes :

1. **S'inscrire**
   - Allez sur https://www.elephantsql.com
   - Cliquez sur "Sign Up"

2. **Créer une instance**
   - Cliquez sur "Create New Instance"
   - Plan : Sélectionnez "Tiny Turtle" (gratuit)
   - Region : Choisissez le plus proche
   - Cliquez sur "Create instance"

3. **Récupérer les credentials**
   - Accédez à votre instance
   - Onglet "Browser" affiche l'URL de connexion
   - Format : `postgresql://user:password@host:port/database`

---

## 🚀 Déploiement du Backend

### Avec Render (Recommandé)

1. **Pousser votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/nlamb-sarre.git
   git push -u origin main
   ```

2. **Connecter Render à GitHub**
   - Sur Render, cliquez "New +"
   - Sélectionnez "Web Service"
   - Connectez votre repository GitHub
   - Remplissez :
     - **Name** : `nlamb-sarre-api`
     - **Environment** : Node
     - **Build Command** : `npm install`
     - **Start Command** : `npm start`

3. **Ajouter les variables d'environnement**
   - Allez dans l'onglet "Environment"
   - Ajoutez toutes les variables de votre `.env`

4. **Déployer**
   - Cliquez sur "Create Web Service"
   - Render déploiera automatiquement

---

## 💾 Exporter et Importer les Données

### Exporter votre BD locale

```bash
# Créer un dump SQL
pg_dump -U postgres -h localhost j_apprends_cuisiner > backup.sql

# Ou avec le mot de passe
PGPASSWORD=votre_mot_de_passe pg_dump -U postgres -h localhost j_apprends_cuisiner > backup.sql
```

### Importer dans la BD en ligne

```bash
# Avec Render/ElephantSQL/Railway
PGPASSWORD=remote_password psql -U remote_user -h remote_host -d remote_database < backup.sql
```

---

## 🔐 Sécurité

### À FAIRE :

1. **Changer le mot de passe par défaut**
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_strong_password';
   ```

2. **Utiliser des variables d'environnement**
   - Ne mettez JAMAIS les credentials en dur dans le code
   - Utilisez toujours `.env`

3. **Configurer CORS côté backend**
   ```javascript
   app.use(cors({
     origin: 'https://nlamb-sarre.com',
     credentials: true
   }));
   ```

4. **Mettre à jour les URLs de votre frontend**
   ```env
   # .env frontend
   VITE_API_URL=https://nlamb-sarre-api.render.com/api
   ```

---

## 📊 Voici la Configuration Finale pour Render

### `.env` Backend mis à jour :
```env
PORT=3000
NODE_ENV=production

# Base de données Render
DB_HOST=dpg-XXXXX.render.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=votre-secret-jwt-tres-securise-changez-moi
JWT_EXPIRE=7d

# Session
SESSION_SECRET=votre-secret-session-tres-securise-changez-moi

# Frontend URL
FRONTEND_URL=https://nlamb-sarre.com

# Facebook OAuth
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_APP_SECRET=votre_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://nlamb-sarre-api.render.com/api/auth/facebook/callback

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-application
EMAIL_FROM=noreply@nlamb-sarre.com
```

---

## ✅ Checklist

- [ ] Base de données créée en ligne
- [ ] Variables d'environnement configurées
- [ ] Données exportées et importées
- [ ] Backend déployé sur Render
- [ ] Frontend mis à jour avec nouvelle URL API
- [ ] Tests : API répond correctement
- [ ] Domaine configuré (DNS)
- [ ] HTTPS activé
- [ ] Sauvegardes automatiques activées

---

## 🆘 Dépannage

### Erreur "CORS"
```javascript
// Ajouter dans server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Erreur "Connection Refused"
- Vérifier les credentials DB
- Vérifier que la BD est accessible de l'extérieur
- Vérifier les pare-feu

### Erreur "Database Not Found"
- Vérifier le nom de la base de données
- Vérifier les permissions de l'utilisateur

---

## 📞 Support

**Render Support** : https://render.com/docs
**Railway Support** : https://railway.app/docs
**ElephantSQL Support** : https://www.elephantsql.com/docs

---

**Date** : 30 mai 2026
**Application** : NLAMB-SARRE
**Version** : 1.1.0
