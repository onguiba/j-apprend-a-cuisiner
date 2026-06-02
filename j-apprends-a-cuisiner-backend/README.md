# 🍽️ J'apprends à Cuisiner - Backend API

Backend Node.js + Express + PostgreSQL pour l'application de recettes camerounaises.

## 🚀 Installation

### Prérequis

- Node.js 16+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Installer les Dépendances

```bash
cd j-apprends-a-cuisiner-backend
npm install
```

### 2. Configuration

Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

Modifier les variables dans `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=j_apprends_cuisiner
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
FRONTEND_URL=http://localhost:5173
```

### 3. Créer la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE j_apprends_cuisiner;

# Quitter
\q
```

### 4. Initialiser les Tables

```bash
npm run init-db
```

### 5. Insérer les Données Initiales

```bash
npm run seed
```

### 6. Démarrer le Serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📡 API Endpoints

### Recettes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/recipes` | Récupérer toutes les recettes |
| GET | `/api/recipes/:id` | Récupérer une recette par ID |
| GET | `/api/recipes/region/:regionId` | Recettes par région |
| POST | `/api/recipes` | Créer une recette |
| PUT | `/api/recipes/:id` | Mettre à jour une recette |
| DELETE | `/api/recipes/:id` | Supprimer une recette |

### Régions

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/regions` | Récupérer toutes les régions |
| GET | `/api/regions/:id` | Récupérer une région par ID |
| POST | `/api/regions` | Créer une région |
| PUT | `/api/regions/:id` | Mettre à jour une région |
| DELETE | `/api/regions/:id` | Supprimer une région |

### Paramètres de Requête

**GET /api/recipes**

```
?region=Littoral          # Filtrer par région
?search=ndole             # Rechercher dans titre/description
?difficulty=Moyen         # Filtrer par difficulté
```

## 📊 Structure de la Base de Données

### Tables

- `regions` - Les 10 régions du Cameroun
- `recipes` - Les recettes de cuisine
- `users` - Les utilisateurs
- `favorites` - Les favoris des utilisateurs
- `comments` - Les commentaires sur les recettes

### Relations

```
regions (1) ←→ (N) recipes
users (1) ←→ (N) recipes
users (1) ←→ (N) favorites ←→ (N) recipes
users (1) ←→ (N) comments ←→ (N) recipes
```

## 🧪 Tester l'API

### Avec curl

```bash
# Récupérer toutes les recettes
curl http://localhost:3000/api/recipes

# Récupérer une recette
curl http://localhost:3000/api/recipes/1

# Récupérer toutes les régions
curl http://localhost:3000/api/regions

# Rechercher des recettes
curl "http://localhost:3000/api/recipes?search=ndole"
```

### Avec un Client REST

- Postman
- Insomnia
- Thunder Client (VS Code)

## 📦 Scripts Disponibles

```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement avec nodemon
npm run init-db    # Créer les tables
npm run seed       # Insérer les données initiales
```

## 🔒 Sécurité

- Helmet.js pour les headers HTTP
- CORS configuré
- Validation des entrées
- Protection contre les injections SQL (requêtes paramétrées)

## 🐛 Dépannage

### Erreur de connexion PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
# Windows
net start postgresql-x64-14

# Vérifier la connexion
psql -U postgres -d j_apprends_cuisiner
```

### Port déjà utilisé

Changer le PORT dans `.env` ou arrêter le processus:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📝 Logs

Les logs sont affichés dans la console en mode développement.

## 🚀 Déploiement

### Heroku

```bash
heroku create j-apprends-cuisiner-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Render / Railway

Suivre la documentation de la plateforme.

## 📚 Documentation Complète

Voir `/docs` pour la documentation détaillée de l'API.

---

**Version:** 1.0.0  
**Auteur:** Votre Nom  
**Licence:** MIT
