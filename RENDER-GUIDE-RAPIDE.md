# Guide Rapide : Déployer sur Render

## ⚡ 3 Étapes Simples

---

## ÉTAPE 1️⃣ : Créer la Base de Données PostgreSQL

### 1. Aller sur Render
- URL : https://render.com
- Cliquez "Get Started" (gratuit)

### 2. Se connecter avec GitHub
- Cliquez "Sign up with GitHub"
- Autorisez Render à accéder à GitHub

### 3. Créer une Base PostgreSQL
1. Sur le tableau de bord, cliquez **"New +"** (coin haut droit)
2. Sélectionnez **"PostgreSQL"**
3. Remplissez :
   - **Name** : `nlamb-sarre-db`
   - **Database** : `nlamb_sarre_db`
   - **User** : `nlamb_user`
   - **Region** : Choisissez votre région (Frankfurt ou autre)
   - **PostgreSQL Version** : Laissez 15 (défaut)
   - **Instance Type** : **Free** (gratuit)

4. Cliquez **"Create Database"**

### 4. ⏳ Attendez 3-5 minutes
La base de données se crée. Vous verrez un message "Creating".

### 5. 📋 Récupérer l'URL PostgreSQL
Une fois créée (vert), cliquez sur le nom de la BD.

Dans l'onglet **"Connections"**, copiez l'URL sous :
```
postgresql://nlamb_user:PASSWORD@dpg-XXXXX.render.com:5432/nlamb_sarre_db
```

**💾 Gardez-la précieusement !**

---

## ÉTAPE 2️⃣ : Déployer le Backend

### 1. Créer un Web Service
1. Cliquez **"New +"**
2. Sélectionnez **"Web Service"**
3. Choisissez votre repository : **`onguiba/nlamb-sarre`**
4. Cliquez **"Connect"**

### 2. Configurer le Service
Remplissez les champs :

- **Name** : `nlamb-sarre-api`
- **Environment** : `Node`
- **Region** : Même région que la BD
- **Branch** : `main`
- **Build Command** :
  ```
  cd j-apprends-a-cuisiner-backend && npm install
  ```
- **Start Command** :
  ```
  cd j-apprends-a-cuisiner-backend && npm start
  ```
- **Instance Type** : `Free`

Cliquez **"Create Web Service"**

### 3. ⏳ Attendre le déploiement initial
Render va construire et déployer. Ça prend **5-10 minutes**.

Vous verrez :
```
✓ Deploying
✓ Build successful
✓ Service is live
```

### 4. 📝 Ajouter les Variables d'Environnement

Une fois le service créé, allez dans l'onglet **"Environment"**.

Cliquez **"Add Environment Variable"** pour chaque variable :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DB_HOST` | `dpg-XXXXX.render.com` (de votre URL PostgreSQL) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `nlamb_sarre_db` |
| `DB_USER` | `nlamb_user` |
| `DB_PASSWORD` | `PASSWORD` (de votre URL PostgreSQL) |
| `JWT_SECRET` | `super-secret-key-change-me` |
| `SESSION_SECRET` | `another-secret-key` |
| `FRONTEND_URL` | `http://localhost:5173` |

**💾 Après chaque ajout, Render redéploie automatiquement !**

### 5. 🎉 Votre URL API
Une fois déployé, vous aurez une URL comme :
```
https://nlamb-sarre-api.onrender.com
```

Testez : Allez sur `https://nlamb-sarre-api.onrender.com/api/`

Vous devriez voir :
```json
{
  "message": "API NLAMB-SARRE",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## ÉTAPE 3️⃣ : Initialiser la Base de Données

### Option A : Via le Shell Render (Recommandé)

1. Sur votre Web Service, cliquez l'onglet **"Shell"**
2. Exécutez :
   ```bash
   npm run init-db
   npm run seed
   ```

Attendez que tout finisse. Vous verrez :
```
✅ Régions insérées
✅ Utilisateurs créés
✅ Recettes insérées
🎉 Données initiales insérées avec succès!
```

---

## 🎯 Résumé Final

Vous avez maintenant :

✅ **Base de données PostgreSQL** en ligne sur Render
✅ **Backend API** déployé et accessible
✅ **Données** initialisées (régions, recettes, utilisateurs)

### URLs :
- **API** : `https://nlamb-sarre-api.onrender.com/api`
- **Database** : PostgreSQL sur Render (privée)

### Comptes de Test :
```
Admin Email: admin@japprends.cm
Admin Password: Admin@2024!

Chef Email: marie@japprends.cm
Chef Password: Chef@2024!
```

---

## 🆘 Problèmes Courants

### ❌ "Build failed"
**Cause** : Dépendances manquantes
**Solution** :
1. Vérifiez que `package.json` existe dans `j-apprends-a-cuisiner-backend`
2. Allez dans **"Build Logs"** pour voir l'erreur exacte
3. Poussez une correction sur GitHub
4. Render redéploiera automatiquement

### ❌ "Connection refused"
**Cause** : Variables d'environnement incorrectes
**Solution** :
1. Vérifiez `DB_HOST`, `DB_USER`, `DB_PASSWORD`
2. Assurez-vous que le format est correct

### ❌ "Database not found"
**Cause** : La BD PostgreSQL n'est pas encore créée
**Solution** :
1. Vérifiez que vous avez créé la BD PostgreSQL
2. Vérifiez que le nom de la BD est `nlamb_sarre_db`

---

## 📞 Support

- **Render Docs** : https://render.com/docs
- **PostgreSQL Docs** : https://www.postgresql.org/docs

---

**Prêt ? Commencez par ÉTAPE 1 ! 🚀**
