# ⚡ NLAMB-SARRE : Quick Start Guide

## 🎯 Vous Êtes Où ?

✅ **Développement** : COMPLET  
✅ **Code** : Sur GitHub  
✅ **Serveurs locaux** : Actifs (ports 5173 & 3000)  
⏳ **Déploiement** : À faire  

---

## 🚀 3 MINUTES : LES ÉTAPES

### ÉTAPE 1 : Créer la BD sur Render
1. Allez sur **https://render.com**
2. Connectez-vous avec GitHub (username: onguiba)
3. Cliquez **"New +"** → **"PostgreSQL"**
4. Nom : `nlamb-sarre-db`
5. Cliquez **"Create Database"** ⏳ Attendre 3-5 minutes
6. Une fois créée, copiez l'URL sous **"Connections"**

💾 **GARDEZ CETTE URL !**

---

### ÉTAPE 2 : Déployer le Backend
1. Sur Render, cliquez **"New +"** → **"Web Service"**
2. Connectez repository : `onguiba/nlamb-sarre`
3. Cliquez **"Connect"**
4. Remplissez :
   - Name: `nlamb-sarre-api`
   - Environment: `Node`
   - Build Command: `cd j-apprends-a-cuisiner-backend && npm install`
   - Start Command: `cd j-apprends-a-cuisiner-backend && npm start`
5. Cliquez **"Create Web Service"** ⏳ Attendre 5-10 minutes
6. Ajoutez les variables d'environnement (voir plus bas)

---

### ÉTAPE 3 : Initialiser la BD
1. Dans votre Web Service, onglet **"Shell"**
2. Tapez : `npm run init-db`
3. Tapez : `npm run seed`
4. ✅ Prêt !

---

## 🔐 Variables d'Environnement (Étape 2.6)

Ajoutez ces variables dans Render (onglet "Environment") :

```
NODE_ENV = production
PORT = 3000
DB_HOST = dpg-XXXXX.render.com    (de votre URL PostgreSQL)
DB_PORT = 5432
DB_NAME = nlamb_sarre_db
DB_USER = nlamb_user
DB_PASSWORD = PASSWORD    (de votre URL PostgreSQL)
JWT_SECRET = super-secret-key-change-me
SESSION_SECRET = another-secret-key
FRONTEND_URL = http://localhost:5173
```

---

## 🧪 Tester Après Déploiement

Une fois tout déployé, essayez :

```
https://nlamb-sarre-api.onrender.com/api/
```

Vous devriez voir du JSON avec l'API info.

---

## 👤 Comptes de Test

Après l'initialisation, connectez-vous avec :

```
Admin
  Email: admin@japprends.cm
  Password: Admin@2024!

Chef
  Email: marie@japprends.cm
  Password: Chef@2024!
```

---

## 📚 Guides Complets

| Guide | Pour |
|-------|------|
| `CREER-BD-RENDER.md` | Détails étape 1 (BD) |
| `RENDER-GUIDE-RAPIDE.md` | Détails étapes 2-3 |
| `DEPLOIEMENT-RENDER.md` | Guide complet |
| `STATUS-FINAL.md` | État complet du projet |
| `TABLEAU-DE-BORD.md` | Vue d'ensemble |

---

## 🔗 URLs Utiles

- **Render** : https://render.com
- **GitHub** : https://github.com/onguiba/nlamb-sarre
- **Frontend Local** : http://localhost:5173
- **Backend Local** : http://localhost:3000

---

## 🆘 SOS Rapide

**"Ça ne marche pas"**
→ Vérifiez les logs dans Render (onglet "Logs")

**"Erreur de connexion BD"**
→ Vérifiez les variables d'environnement (exactement comme ci-dessus)

**"Page blanche"**
→ Ouvrez la console du navigateur (F12) et vérifiez les erreurs

**"Build failed"**
→ Allez dans "Build Logs" dans Render pour voir l'erreur exacte

---

## ✨ C'est Tout !

Vous avez tout ce qu'il faut. Commencez par l'**ÉTAPE 1** et allez doucement.

**Durée totale : ~30 minutes** ⏱️

Bonne chance ! 🚀

