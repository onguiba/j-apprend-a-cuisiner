# Guide de Déploiement sur Render

## 📋 Prérequis

- ✅ Compte GitHub avec votre code
- ✅ Compte Render (gratuit sur https://render.com)
- ✅ Domaine personnalisé (optionnel)

---

## 🚀 Étape 1 : Préparer votre Code

### 1.1 Initialiser Git (si pas déjà fait)

```bash
cd votre-dossier-projet
git init
git add .
git commit -m "Initial commit - NLAMB-SARRE"
```

### 1.2 Créer un repository GitHub

1. Allez sur https://github.com/new
2. Créez un repository nommé `nlamb-sarre`
3. Copiez les commandes et exécutez :

```bash
git remote add origin https://github.com/votre-username/nlamb-sarre.git
git branch -M main
git push -u origin main
```

---

## 🌐 Étape 2 : Créer la Base de Données sur Render

### 2.1 Aller sur Render

1. Allez sur https://render.com
2. Cliquez sur "Sign up" (avec GitHub c'est plus facile)
3. Connectez-vous avec GitHub

### 2.2 Créer une Base de Données PostgreSQL

1. Sur le tableau de bord, cliquez "New +"
2. Sélectionnez "PostgreSQL"
3. Remplissez :
   - **Name** : `nlamb-sarre-db`
   - **Database** : `nlamb_sarre_db`
   - **User** : `nlamb_user`
   - **Region** : Choisissez votre région (ex: Frankfurt)
   - **PostgreSQL Version** : 15
   - **Instance Type** : Free
4. Cliquez "Create Database"

### 2.3 Attendre et Récupérer l'URL

1. Attendez 2-3 minutes que la BD se crée
2. Allez dans l'onglet "Connections"
3. **Copiez l'URL** sous "External Database URL"
4. Exemple :
   ```
   postgresql://nlamb_user:XXXXXXX@dpg-XXXXX.render.com/nlamb_sarre_db
   ```

---

## 🔧 Étape 3 : Déployer le Backend

### 3.1 Créer un Web Service

1. Sur Render, cliquez "New +"
2. Sélectionnez "Web Service"
3. Connectez votre repository GitHub
4. Si demandé, autorisez Render à accéder à GitHub

### 3.2 Configurer le Web Service

Remplissez les champs :

- **Name** : `nlamb-sarre-api`
- **Environment** : Node
- **Region** : Même que la BD
- **Branch** : main
- **Build Command** : 
  ```bash
  cd j-apprends-a-cuisiner-backend && npm install
  ```
- **Start Command** : 
  ```bash
  cd j-apprends-a-cuisiner-backend && npm start
  ```
- **Instance Type** : Free

### 3.3 Ajouter les Variables d'Environnement

Dans l'onglet "Environment", cliquez sur "Add Environment Variable" et ajoutez :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DB_HOST` | (de votre URL PostgreSQL) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `nlamb_sarre_db` |
| `DB_USER` | `nlamb_user` |
| `DB_PASSWORD` | (de votre URL PostgreSQL) |
| `JWT_SECRET` | (générez une valeur sécurisée) |
| `SESSION_SECRET` | (générez une valeur sécurisée) |
| `FRONTEND_URL` | `https://nlamb-sarre.vercel.app` |
| `FACEBOOK_APP_ID` | (votre ID Facebook) |
| `FACEBOOK_APP_SECRET` | (votre secret Facebook) |
| `FACEBOOK_CALLBACK_URL` | `https://nlamb-sarre-api.onrender.com/api/auth/facebook/callback` |

### 3.4 Déployer

Cliquez sur "Create Web Service"

**Render déploiera automatiquement !** ✅

Attendez 5-10 minutes pour le déploiement initial.

---

## 🌍 Étape 4 : Obtenir l'URL de l'API

Une fois déployé :

1. Allez sur votre Web Service
2. Vous verrez une URL comme :
   ```
   https://nlamb-sarre-api.onrender.com
   ```

3. Testez l'API :
   ```
   https://nlamb-sarre-api.onrender.com/api/
   ```

---

## 💾 Étape 5 : Initialiser la Base de Données

### Option A : Depuis Render Shell

1. Allez sur votre Web Service Render
2. Cliquez sur l'onglet "Shell"
3. Exécutez :
   ```bash
   npm run init-db
   npm run seed
   ```

### Option B : Depuis votre Machine (SSH)

```bash
# Exporter votre BD locale
pg_dump -U postgres j_apprends_cuisiner > backup.sql

# Importer dans Render
psql postgresql://nlamb_user:PASSWORD@dpg-XXXXX.render.com:5432/nlamb_sarre_db < backup.sql
```

---

## 🖥️ Étape 6 : Déployer le Frontend

### Avec Vercel (Recommandé - Gratuit)

1. Allez sur https://vercel.com
2. Cliquez "Sign Up" avec GitHub
3. Importez le repository `nlamb-sarre`
4. Configurez :
   - **Framework** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Ajouter les variables d'environnement :
   ```
   VITE_API_URL=https://nlamb-sarre-api.onrender.com/api
   ```
6. Cliquez "Deploy"

Vous obtiendrez :
```
https://nlamb-sarre.vercel.app
```

---

## 🔐 Étape 7 : Configurer les Domaines (Optionnel)

### Ajouter un Domaine Personnalisé

1. **Render (Backend)**
   - Web Service > Settings > Custom Domain
   - Entrez : `api.nlamb-sarre.com`

2. **Vercel (Frontend)**
   - Project Settings > Domains
   - Entrez : `nlamb-sarre.com`

3. **Configurer DNS** (chez votre registraire)
   ```
   api.nlamb-sarre.com  → Points to Render
   nlamb-sarre.com      → Points to Vercel
   ```

---

## 📊 Votre Architecture en Ligne

```
┌─────────────────────────────────────────┐
│         Utilisateur / Navigateur        │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼───────┐
        │   Vercel     │  (Frontend)
        │ nlamb-sarre  │
        │   .com       │
        └──────┬───────┘
               │
        ┌──────▼────────────┐
        │      Render       │  (Backend API)
        │ nlamb-sarre-api   │
        │  .onrender.com    │
        └──────┬────────────┘
               │
        ┌──────▼────────────┐
        │    Render DB      │  (PostgreSQL)
        │  nlamb-sarre-db   │
        └───────────────────┘
```

---

## ✅ Checklist Final

- [ ] Code pushé sur GitHub
- [ ] BD créée sur Render
- [ ] Backend déployé sur Render
- [ ] Variables d'environnement configurées
- [ ] DB initialisée et seedée
- [ ] Frontend déployé sur Vercel
- [ ] API répond (testée)
- [ ] Frontend accède à l'API correctement
- [ ] Domaines configurés (optionnel)
- [ ] HTTPS activé ✅ (Automatique)

---

## 🆘 Dépannage

### L'API ne démarre pas
```
Erreur : "Cannot find module 'pg'"
Solution : Render ne reconnaît pas le build
Vérification : Build Command correct ? node_modules présents ?
```

### Erreur de connexion BD
```
Erreur : "ECONNREFUSED"
Solution : 
1. Vérifier les credentials
2. Vérifier que la BD est en ligne
3. Vérifier que les variables d'env sont correctes
```

### CORS Error
```
Erreur : "Access to XMLHttpRequest blocked by CORS"
Solution : Ajouter FRONTEND_URL dans la variable d'env
```

---

## 📞 Support

- **Render Documentation** : https://render.com/docs
- **Vercel Documentation** : https://vercel.com/docs
- **PostgreSQL Documentation** : https://www.postgresql.org/docs

---

**Application** : NLAMB-SARRE
**Version** : 1.1.0
**Date** : 30 mai 2026
**Status** : Prêt pour la production ✅
