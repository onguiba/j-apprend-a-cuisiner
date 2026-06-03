# 🗄️ Comment Créer une Base de Données PostgreSQL sur Render

## ÉTAPE 1️⃣ : Aller sur Render

1. Ouvrez votre navigateur
2. Allez sur : **https://render.com**
3. Vous verrez l'accueil de Render

---

## ÉTAPE 2️⃣ : Se Connecter

Si vous n'avez pas de compte :
1. Cliquez **"Get Started"** (bleu)
2. Cliquez **"Sign up with GitHub"**
3. Acceptez les permissions
4. Vous serez connecté ✅

Si vous avez déjà un compte :
1. Cliquez **"Sign in"**
2. Connectez-vous avec GitHub

---

## ÉTAPE 3️⃣ : Créer une Base PostgreSQL

### Étape A : Accéder au Dashboard

1. Une fois connecté, vous verrez un tableau de bord
2. Cliquez le bouton **"New +"** (coin haut droit, bouton bleu)

```
┌─────────────────────────────────────┐
│  Render Dashboard                   │
├─────────────────────────────────────┤
│  [New +] ◄──── CLIQUEZ ICI          │
└─────────────────────────────────────┘
```

### Étape B : Sélectionner PostgreSQL

Un menu déroulant apparaît. Cliquez sur **"PostgreSQL"**

```
Menu options:
- Web Service
- Static Site
- PostgreSQL    ◄──── SÉLECTIONNEZ
- Redis
- Background Worker
```

### Étape C : Remplir les Informations

Un formulaire s'affiche :

| Champ | À Rentrer | Exemple |
|-------|-----------|---------|
| **Name** | Nom de votre BD | `nlamb-sarre-db` |
| **Database** | Nom de la base | `nlamb_sarre_db` |
| **User** | Utilisateur | `nlamb_user` |
| **Password** | Mot de passe | (Render génère) |
| **Region** | Région serveur | Frankfurt (ou votre région) |
| **PostgreSQL Version** | Version | 15 (défaut, OK) |
| **Instance Type** | Type d'instance | **Free** (gratuit) ✅ |

**📝 Exemple complété :**

```
Name: nlamb-sarre-db
Database: nlamb_sarre_db
User: nlamb_user
Password: (généré automatiquement par Render)
Region: Frankfurt (EU)
PostgreSQL Version: 15
Instance Type: Free
```

---

## ÉTAPE 4️⃣ : Créer la BD

1. **Vérifiez** que tous les champs sont remplis
2. Cliquez le bouton **"Create Database"** (bleu, en bas)

```
┌──────────────────────────────┐
│ [Cancel]  [Create Database]  │ ◄──── CLIQUEZ
└──────────────────────────────┘
```

---

## ÉTAPE 5️⃣ : ⏳ Attendre

Un écran de progression s'affiche :

```
Creating database...
- Creating instance... ✓
- Initializing PostgreSQL... ⏳
- Setting up user... ⏳
```

**Ça prend 3-5 minutes. Soyez patient !** ☕

Une fois créée, vous verrez un ✅ vert et le statut "Available"

---

## ÉTAPE 6️⃣ : 📋 Récupérer l'URL de Connexion

Une fois la BD créée :

1. **Cliquez sur le nom de votre BD** (bleu) : `nlamb-sarre-db`
2. Vous verrez les détails de la BD
3. Allez dans l'onglet **"Connections"** (en haut)

Vous verrez une section "**External Database URL**" :

```
postgresql://nlamb_user:PASSWORD@dpg-XXXXX.render.com:5432/nlamb_sarre_db
```

### 💾 COPIE-COLLEZ CETTE URL QUELQUE PART ⚠️

(Vous en aurez besoin pour configurer le backend)

---

## 📊 Vérification Finale

Votre BD PostgreSQL est maintenant créée ! ✅

Dans le Dashboard Render, vous devriez voir :

```
┌─────────────────────────────────────┐
│  nlamb-sarre-db (PostgreSQL)        │
│  🟢 Available                       │
│  Région: Frankfurt (EU)             │
│  Plan: Free                         │
└─────────────────────────────────────┘
```

---

## 🆘 Problèmes Courants

### ❌ Je vois "Instance limit exceeded"
**Solution** : Vous avez déjà atteint le nombre limite de BDs gratuites
- Supprimez une ancienne BD, ou
- Utilisez ElephantSQL à la place

### ❌ La BD reste en "Creating" depuis longtemps
**Solution** :
1. Attendez 10 minutes (c'est normal)
2. Si toujours pas créée, rafraîchissez la page (F5)
3. Si ça persiste, supprimez et créez une nouvelle

### ❌ Impossible de créer, erreur affichée
**Solution** : Lisez l'erreur, souvent c'est :
- Un champ mal rempli → Corrigez
- Region indisponible → Choisissez une autre

---

## ✅ Prochaines Étapes

Une fois la BD créée :

1. **Notez l'URL PostgreSQL** (voir Étape 6)
2. Allez à **ÉTAPE 2** du guide principal : Créer le Web Service Backend
3. Utilisez cette URL dans les variables d'environnement

---

## 📞 Besoin d'aide ?

- **Render Support** : https://render.com/docs
- **PostgreSQL Docs** : https://www.postgresql.org/docs

---

**Prêt ? Allez sur https://render.com maintenant ! 🚀**
