# 🚀 NLAMB-SARRE : Prochaines Étapes Deployment

## ✅ Statut Actuel

Tous les développements et modifications sont **TERMINÉS** et **PUSHÉS sur GitHub** ! 🎉

### Code Local
- ✅ Backend en cours d'exécution : `http://localhost:3000`
- ✅ Frontend en cours d'exécution : `http://localhost:5173`
- ✅ Toutes les modifications appliquées
- ✅ Pushé sur GitHub : https://github.com/onguiba/nlamb-sarre

### Modifications Complètes
- ✅ Nom de l'application : **NLAMB-SARRE** (partout)
- ✅ Couleur de fond : **Gradient Vert Naturel** (forêt)
- ✅ Préparation standardisée : **45 minutes** (toutes les recettes)
- ✅ Système d'abonnement : **Implémenté** (Free, Premium, Pro)
- ✅ 11ème région ajoutée : **Autre** (Tchiep, Foutou Sauce Graine)
- ✅ Base de données locale : **PostgreSQL locale**

---

## 🎯 MAINTENANT : DEPLOYER SUR RENDER

### 📋 Déploiement en 3 Étapes Principales

Vous devez compléter ces étapes pour déployer en ligne :

#### **ÉTAPE 1️⃣ : Créer Base de Données PostgreSQL**

Suivez le guide détaillé : **`CREER-BD-RENDER.md`**

Résumé rapide :
1. Allez sur https://render.com
2. Connectez-vous avec GitHub (onguiba)
3. Cliquez "New +" → "PostgreSQL"
4. Remplissez :
   - Name: `nlamb-sarre-db`
   - Database: `nlamb_sarre_db`
   - User: `nlamb_user`
   - Instance Type: **Free**
5. Cliquez "Create Database"
6. ⏳ Attendez 3-5 minutes
7. Copiez l'URL PostgreSQL depuis "Connections" :
   ```
   postgresql://nlamb_user:PASSWORD@dpg-XXXXX.render.com:5432/nlamb_sarre_db
   ```

💾 **GARDEZ CETTE URL !** Vous en aurez besoin.

---

#### **ÉTAPE 2️⃣ : Déployer le Backend**

Suivez le guide détaillé : **`RENDER-GUIDE-RAPIDE.md`** (Étape 2)

Résumé rapide :
1. Sur Render, cliquez "New +" → "Web Service"
2. Sélectionnez votre repository : `onguiba/nlamb-sarre`
3. Cliquez "Connect"
4. Remplissez :
   - Name: `nlamb-sarre-api`
   - Environment: `Node`
   - Build Command: `cd j-apprends-a-cuisiner-backend && npm install`
   - Start Command: `cd j-apprends-a-cuisiner-backend && npm start`
   - Instance Type: **Free**
5. Cliquez "Create Web Service"
6. ⏳ Attendez 5-10 minutes pour le déploiement
7. Ajoutez les Variables d'Environnement (onglet "Environment") :

```
NODE_ENV = production
PORT = 3000
DB_HOST = dpg-XXXXX.render.com (de l'URL PostgreSQL)
DB_PORT = 5432
DB_NAME = nlamb_sarre_db
DB_USER = nlamb_user
DB_PASSWORD = PASSWORD (de l'URL PostgreSQL)
JWT_SECRET = super-secret-key-change-me
SESSION_SECRET = another-secret-key
FRONTEND_URL = https://votre-frontend-url.onrender.com (ou localhost:5173 pour dev)
```

Votre URL API sera comme : `https://nlamb-sarre-api.onrender.com`

---

#### **ÉTAPE 3️⃣ : Initialiser la Base de Données**

Une fois le backend déployé :

1. Dans votre Web Service Render, allez à l'onglet **"Shell"**
2. Exécutez :
   ```bash
   npm run init-db
   npm run seed
   ```
3. Attendez que tout finisse. Vous devriez voir :
   ```
   ✅ Tables créées
   ✅ Utilisateurs insérés
   ✅ Régions insérées
   ✅ Recettes insérées
   🎉 Données initiales OK !
   ```

---

## 🌐 Déployer le Frontend (Optionnel - pour production)

Pour déployer le frontend aussi sur Render :

1. Créez un second Web Service
2. Sélectionnez le même repository
3. Settings :
   - Name: `nlamb-sarre-web`
   - Environment: `Node`
   - Root Directory: `j-apprends-a-cuisiner`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
4. Cliquez "Create Web Service"

URL Frontend : `https://nlamb-sarre-web.onrender.com`

---

## 📝 Comptes de Test (Inclus dans Seed)

Une fois la BD initialisée, vous pouvez vous connecter avec :

```
Admin :
  Email: admin@japprends.cm
  Password: Admin@2024!

Chef :
  Email: marie@japprends.cm
  Password: Chef@2024!
```

---

## 🔗 Ressources Utiles

- **Guide Détaillé BD** : `CREER-BD-RENDER.md`
- **Guide Complet Render** : `RENDER-GUIDE-RAPIDE.md`
- **Documentation Complète** : `DEPLOIEMENT-RENDER.md`
- **GitHub Repository** : https://github.com/onguiba/nlamb-sarre
- **Render Platform** : https://render.com

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. **Problème de build** → Vérifiez les logs dans Render
2. **Problème de connexion BD** → Vérifiez les variables d'environnement
3. **Problème de déploiement** → Poussez une correction sur GitHub, Render redéploiera

---

## ✨ Résumé

Vous avez maintenant une application **NLAMB-SARRE** complète avec :
- ✅ Frontend Vue.js + TypeScript
- ✅ Backend Node.js/Express
- ✅ Système d'abonnement
- ✅ 10 régions + 1 région supplémentaire (Autre)
- ✅ 40+ recettes standardisées à 45 minutes
- ✅ Code en ligne sur GitHub

**À faire : Suivre les 3 étapes de déploiement ci-dessus !** 🚀

---

**Commencez par ÉTAPE 1 : Créer la BD PostgreSQL sur Render !**

