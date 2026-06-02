# 🍲 J'apprends à Cuisiner - Plateforme Culinaire Camerounaise

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)

**Découvrez la richesse de la cuisine camerounaise à travers ses 10 régions**

[Demo](https://japprends-cuisiner.com) · [Documentation](./GUIDE-COMPLET-PROFESSIONNEL.md) · [Report Bug](https://github.com/votre-repo/issues)

</div>

---

## 🌟 Présentation

**J'apprends à Cuisiner** est une plateforme web professionnelle dédiée à la découverte et à l'apprentissage de la cuisine camerounaise. Conçue pour un public international, elle offre une expérience immersive à travers les 10 régions du Cameroun.

### ✨ Caractéristiques Principales

- 🗺️ **10 Régions Culinaires** - Explorez la diversité gastronomique du Cameroun
- 📹 **Vidéos HD** - Tutoriels vidéo avec sous-titres multilingues
- 🔍 **Recherche Avancée** - Trouvez rapidement vos recettes préférées
- ❤️ **Système de Favoris** - Sauvegardez vos recettes favorites
- 👨‍🍳 **Panel Admin** - Gestion complète du contenu
- 📱 **100% Responsive** - Parfait sur mobile, tablette et desktop
- 🌐 **SEO Optimisé** - Visible sur les moteurs de recherche
- 🎨 **Design Premium** - Interface moderne avec effet Glass Morphism

## 🚀 Démarrage Rapide

### Prérequis

- Node.js >= 16.0.0
- PostgreSQL >= 14.0
- npm ou yarn

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/j-apprends-a-cuisiner.git
cd j-apprends-a-cuisiner

# 2. Installer les dépendances Backend
cd j-apprends-a-cuisiner-backend
npm install

# 3. Configurer la base de données
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# 4. Initialiser la base de données
node src/config/initDatabase.js
node src/config/seedDatabase.js

# 5. Démarrer le backend
npm start

# 6. Dans un nouveau terminal, installer le frontend
cd ../j-apprends-a-cuisiner
npm install

# 7. Démarrer le frontend
npm run dev
```

### Accès

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin**: admin@japprends.cm / Admin@2024!

## 📚 Documentation

- [Guide Complet](./GUIDE-COMPLET-PROFESSIONNEL.md) - Documentation détaillée
- [Guide Administration](./GUIDE-ADMINISTRATION.md) - Utilisation du panel admin
- [Guide Démarrage](./GUIDE-DEMARRAGE-COMPLET.md) - Installation pas à pas
- [API Documentation](./BACKEND-FRONTEND-CONNEXION.md) - Endpoints API

## 🏗️ Architecture

### Stack Technique

**Frontend**
- TypeScript
- Vite
- CSS3 (Glass Morphism)
- HTML5 Video Player

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

### Structure du Projet

```
j-apprends-a-cuisiner/
├── j-apprends-a-cuisiner/          # Frontend
│   ├── src/
│   │   ├── components/             # Composants réutilisables
│   │   ├── pages/                  # Pages de l'application
│   │   ├── services/               # Services API
│   │   ├── models/                 # Modèles de données
│   │   └── styles/                 # Styles CSS
│   └── public/
│       ├── images/                 # Images par région
│       ├── videos/                 # Vidéos de recettes
│       └── subtitles/              # Sous-titres
│
└── j-apprends-a-cuisiner-backend/  # Backend
    ├── src/
    │   ├── controllers/            # Contrôleurs
    │   ├── routes/                 # Routes API
    │   ├── middleware/             # Middlewares
    │   └── config/                 # Configuration
    └── .env                        # Variables d'environnement
```

## 🎨 Captures d'Écran

### Page d'Accueil
![Home](./screenshots/home.png)

### Détail Recette
![Recipe](./screenshots/recipe.png)

### Panel Admin
![Admin](./screenshots/admin.png)

## 🌍 Régions Couvertes

1. **Adamaoua** - Viandes grillées et lait caillé
2. **Centre** - Poulet DG, Koki, Ngomba
3. **Est** - Poissons fumés et chenilles
4. **Extrême-Nord** - Couscous et sauces sahéliennes
5. **Littoral** - Ndolé, Mbongo Tchobi
6. **Nord** - Viandes séchées et bouillie de mil
7. **Nord-Ouest** - Fufu corn et Achu soup
8. **Ouest** - Achu, Taro, Njapché
9. **Sud** - Poissons d'eau douce
10. **Sud-Ouest** - Eru, Kati-kati, Mets de pistaches

## 📊 Statistiques

- **17+ Recettes** authentiques
- **10 Régions** du Cameroun
- **3 Vidéos** tutoriels HD
- **5 Chefs** contributeurs

## 🔐 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ Authentification JWT
- ✅ Protection CORS
- ✅ Validation des entrées
- ✅ Protection SQL injection
- ✅ Rate limiting

## 🤝 Contribution

Les contributions sont les bienvenues! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus d'informations.

## 👥 Équipe

- **Chef Marie Nguema** - Spécialiste cuisine du Centre
- **Chef Paul Kamga** - Expert cuisine de l'Ouest
- **Chef Aïcha Bello** - Spécialiste cuisine du Nord
- **Chef Ebenezer Sone** - Expert cuisine du Littoral

## 📞 Contact

- **Email**: contact@japprends.cm
- **Website**: https://japprends-cuisiner.com
- **Twitter**: [@japprends_cm](https://twitter.com/japprends_cm)
- **Facebook**: [J'apprends à Cuisiner](https://facebook.com/japprends)

## 🙏 Remerciements

- Tous les chefs qui ont partagé leurs recettes
- La communauté camerounaise pour son soutien
- Les contributeurs open source

---

<div align="center">

**Fait avec ❤️ au Cameroun 🇨🇲**

[⬆ Retour en haut](#-japprends-à-cuisiner---plateforme-culinaire-camerounaise)

</div>
