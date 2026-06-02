# 🚀 GUIDE RAPIDE - LANCER LA PLATEFORME

## 📋 Résumé

Vous avez besoin de lancer **3 services** :
1. **PostgreSQL** (Base de données)
2. **Backend** (Serveur API - Port 3000)
3. **Frontend** (Interface web - Port 5173)

---

## ✅ ÉTAPE 1: Vérifier les Prérequis

### Vérifier Node.js
```bash
node --version
npm --version
```
Vous devez avoir Node.js 16+ et npm

### Vérifier PostgreSQL
```bash
psql --version
```
Vous devez avoir PostgreSQL 12+

---

## 🔧 ÉTAPE 2: Configuration Initiale (Une seule fois)

### 2.1 Créer la Base de Données PostgreSQL

Ouvrir **PowerShell en tant qu'administrateur** :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE j_apprends_cuisiner;

# Vérifier
\l

# Quitter
\q
```

### 2.2 Configurer le Backend

Ouvrir **PowerShell** dans le dossier du projet :

```bash
# Aller dans le backend
cd j-apprends-a-cuisiner-backend

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env

# Éditer le fichier .env
notepad .env
```

**Contenu du fichier `.env` à modifier :**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=j_apprends_cuisiner
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRES
JWT_SECRET=mon_secret_jwt_super_securise_123
FRONTEND_URL=http://localhost:5173
```

### 2.3 Initialiser la Base de Données

```bash
# Toujours dans j-apprends-a-cuisiner-backend

# Créer les tables
npm run init-db

# Insérer les données (y compris la recette Bouna)
npm run seed
```

Vous devriez voir :
```
✅ Table regions créée
✅ Table users créée
✅ Table recipes créée
✅ Recettes insérées
🎉 Données initiales insérées avec succès!
```

### 2.4 Configurer le Frontend

Ouvrir un **nouveau PowerShell** :

```bash
# Aller dans le frontend
cd j-apprends-a-cuisiner

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env

# Éditer le fichier .env
notepad .env
```

**Contenu du fichier `.env` :**
```env
VITE_API_URL=http://localhost:3000/api
VITE_DATA_MODE=api
```

---

## 🎯 ÉTAPE 3: Lancer les Serveurs (À chaque fois)

### Option A: Lancer dans des Terminaux Séparés (Recommandé)

#### Terminal 1: Backend
```bash
cd j-apprends-a-cuisiner-backend
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur le port 3000
📍 URL: http://localhost:3000
✅ Connecté à PostgreSQL
```

#### Terminal 2: Frontend
```bash
cd j-apprends-a-cuisiner
npm run dev
```

Vous devriez voir :
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Option B: Lancer dans un Seul Terminal

```bash
# Terminal 1: Backend
cd j-apprends-a-cuisiner-backend
npm run dev

# Attendre que le backend soit prêt, puis...

# Terminal 2: Frontend (Ctrl+Maj+T pour nouveau terminal)
cd j-apprends-a-cuisiner
npm run dev
```

---

## 🌐 ÉTAPE 4: Accéder à la Plateforme

1. Ouvrir votre navigateur
2. Aller à : **http://localhost:5173**
3. Vous devriez voir la plateforme avec toutes les recettes

### Vérifier que tout fonctionne

- ✅ Les recettes s'affichent
- ✅ Vous pouvez cliquer sur une recette
- ✅ La recette "Bouna pour Diabétiques" apparaît dans la région Centre
- ✅ Pas d'erreurs dans la console (F12)

---

## 🧪 ÉTAPE 5: Tester l'API Backend

Ouvrir un **nouveau PowerShell** :

```bash
# Test 1: Vérifier que le serveur répond
curl http://localhost:3000

# Test 2: Récupérer toutes les recettes
curl http://localhost:3000/api/recipes

# Test 3: Récupérer les régions
curl http://localhost:3000/api/regions

# Test 4: Rechercher "Bouna"
curl "http://localhost:3000/api/recipes?search=Bouna"
```

---

## 📊 Comptes de Test

### Admin
```
Email: admin@japprends.cm
Mot de passe: Admin@2024!
```

### Chef
```
Email: marie@japprends.cm
Mot de passe: Chef@2024!
```

---

## 🛑 Arrêter les Serveurs

### Pour arrêter le Backend
```bash
# Dans le terminal du backend
Ctrl + C
```

### Pour arrêter le Frontend
```bash
# Dans le terminal du frontend
Ctrl + C
```

### Pour arrêter PostgreSQL (Windows)
```bash
# PowerShell en tant qu'administrateur
net stop postgresql-x64-14
```

---

## 🔄 Redémarrer Rapidement

Si vous avez déjà configuré tout :

```bash
# Terminal 1
cd j-apprends-a-cuisiner-backend
npm run dev

# Terminal 2
cd j-apprends-a-cuisiner
npm run dev

# Ouvrir http://localhost:5173
```

---

## ⚠️ Dépannage Rapide

### Erreur: "Port 3000 already in use"
```bash
# Tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port dans .env
PORT=3001
```

### Erreur: "Cannot connect to PostgreSQL"
```bash
# Vérifier que PostgreSQL est démarré
net start postgresql-x64-14

# Vérifier les credentials dans .env
```

### Erreur: "CORS error"
- Vérifier que le backend est démarré
- Vérifier que `VITE_API_URL` est correct dans frontend/.env

### Pas de données
```bash
cd j-apprends-a-cuisiner-backend
npm run seed
```

---

## 📝 Commandes Utiles

```bash
# Backend
npm run dev        # Démarrer en mode développement
npm run start      # Démarrer en mode production
npm run init-db    # Créer les tables
npm run seed       # Insérer les données

# Frontend
npm run dev        # Démarrer
npm run build      # Compiler
npm run preview    # Prévisualiser

# PostgreSQL
psql -U postgres -d j_apprends_cuisiner    # Se connecter
SELECT * FROM recipes;                      # Voir les recettes
\q                                          # Quitter
```

---

## ✨ Résumé Rapide

| Étape | Commande | Terminal |
|-------|----------|----------|
| 1 | `cd j-apprends-a-cuisiner-backend` | 1 |
| 2 | `npm run dev` | 1 |
| 3 | `cd j-apprends-a-cuisiner` | 2 |
| 4 | `npm run dev` | 2 |
| 5 | Ouvrir http://localhost:5173 | Navigateur |

---

## 🎉 Vous êtes Prêt!

La plateforme est maintenant en ligne avec :
- ✅ Toutes les recettes
- ✅ La recette "Bouna pour Diabétiques"
- ✅ L'authentification
- ✅ Les favoris
- ✅ La recherche

Bon appétit! 👨‍🍳

