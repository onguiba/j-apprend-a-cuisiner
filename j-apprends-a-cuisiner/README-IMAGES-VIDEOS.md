# 🎬 Images et Vidéos - Guide Rapide

## 🚀 Démarrage Rapide

```bash
cd j-apprends-a-cuisiner
npm install
npm run dev
```

Puis ouvrir: `http://localhost:5173`

## ✅ Ce Qui a Été Fait

### Images
- ✅ 18 images organisées dans `/public/images/` par région
- ✅ Chemins corrigés dans `DataService.ts`
- ✅ Structure complète pour les 11 régions (10 + Autre)

### Vidéos
- ✅ Lecteur vidéo personnalisé créé (`VideoPlayer.ts`)
- ✅ Support des sous-titres WebVTT
- ✅ Modal de détail avec vidéo intégrée
- ✅ 2 exemples de sous-titres fournis
- ✅ Structure des dossiers créée

### Design
- ✅ Styles CSS pour le lecteur vidéo
- ✅ Styles CSS pour la modal
- ✅ Design responsive
- ✅ Contrôles personnalisés

## 📁 Structure

```
public/
├── images/              # 18 images disponibles
│   ├── centre/          (2)
│   ├── extreme-nord/    (7)
│   ├── littoral/        (2)
│   ├── nord-ouest/      (1)
│   ├── ouest/           (3)
│   └── sud-ouest/       (3)
│
├── videos/              # Prêt pour vos vidéos
│   └── [11 régions]/
│
└── subtitles/           # 2 exemples fournis
    ├── exemple-ndole.vtt
    └── exemple-achu.vtt
```

## 🧪 Tester

### Test des Images
```
http://localhost:5173/test-images.html
```
Affiche toutes les images disponibles par région.

### Test de l'Application
```
http://localhost:5173
```
Naviguez dans l'application pour voir les recettes avec images.

## 📝 Ajouter une Vidéo

### 1. Placer la Vidéo
```
/public/videos/[region]/nom-du-plat.mp4
```

### 2. Créer les Sous-titres
```
/public/subtitles/nom-du-plat.vtt
```

Format WebVTT:
```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Premier sous-titre

00:00:05.000 --> 00:00:10.000
Deuxième sous-titre
```

### 3. Mettre à Jour la Recette

Dans `src/services/DataService.ts`:
```typescript
new Recipe(
  id,
  'Titre',
  'Description',
  'Ingrédients',
  'Instructions',
  'Région',
  '/images/region/image.jpeg',
  temps,
  'Difficulté',
  'Chef',
  new Date(),
  '/videos/region/video.mp4',    // ← Ajouter
  '/subtitles/video.vtt'         // ← Ajouter
)
```

## 📚 Documentation Complète

- **CORRECTIONS-APPLIQUEES.md** - Ce qui a été corrigé
- **TESTS-RAPIDES.md** - Guide de test détaillé
- **GUIDE-VIDEOS.md** - Guide complet vidéos (7.7 KB)
- **STRUCTURE-REGIONS.md** - Organisation des régions
- **INTEGRATION.md** - Guide d'intégration (10.1 KB)

## 🎯 Images Disponibles

| Région | Images | Fichiers |
|--------|--------|----------|
| Centre | 2 | Ngomba, Njama-Njama |
| Extrême-Nord | 7 | Gombo, Oseille, Tasba, Moringa, Lalo... |
| Littoral | 2 | Ndolé, Mbongo tchobi |
| Nord-Ouest | 1 | Njama-Njama |
| Ouest | 3 | Achu, Taro, Njapché |
| Sud-Ouest | 3 | Eru, Kati-kati, Pistaches |

**Total:** 18 images

## 🎥 Fonctionnalités Vidéo

- ▶️ Lecture/Pause
- ⏩ Barre de progression cliquable
- 🔊 Contrôle du volume
- CC Sous-titres activables
- ⚡ Vitesse de lecture (0.5x à 2x)
- ⛶ Mode plein écran
- 📱 Responsive

## ❓ Problèmes Courants

### Les images ne s'affichent pas
1. Vérifier que le serveur est lancé (`npm run dev`)
2. Ouvrir `test-images.html` pour diagnostiquer
3. Vérifier la console (F12) pour les erreurs 404

### Les vidéos ne se chargent pas
1. Vérifier que le fichier existe dans `/public/videos/`
2. Vérifier le format (MP4 recommandé)
3. Vérifier les chemins dans DataService

### Les sous-titres ne s'affichent pas
1. Vérifier le format WebVTT (doit commencer par "WEBVTT")
2. Cliquer sur le bouton CC dans le lecteur
3. Vérifier le chemin du fichier .vtt

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur
npm run dev

# Compiler pour production
npm run build

# Vérifier les images (PowerShell)
Get-ChildItem -Path "public/images" -Recurse -File

# Compter les images
(Get-ChildItem -Path "public/images" -Recurse -File).Count
```

## 📞 Besoin d'Aide?

1. Consulter **TESTS-RAPIDES.md** pour le dépannage
2. Consulter **GUIDE-VIDEOS.md** pour les vidéos
3. Consulter **INTEGRATION.md** pour l'intégration

---

**Tout est prêt!** Les images s'affichent maintenant correctement et le système vidéo est opérationnel. Il ne reste plus qu'à ajouter vos propres vidéos de recettes! 🎉
