# Organisation des Vidéos de Recettes

Ce dossier contient les vidéos de préparation des plats traditionnels camerounais, organisées par région.

## Structure des Dossiers

```
videos/
├── adamaoua/
├── centre/
├── est/
├── extreme-nord/
├── littoral/
├── nord/
├── nord-ouest/
├── ouest/
├── sud/
└── sud-ouest/
```

## Format des Vidéos

### Formats Supportés
- **MP4** (recommandé) - Meilleure compatibilité
- **WebM** - Format web optimisé
- **OGG** - Alternative open source

### Spécifications Recommandées
- **Résolution:** 1280x720 (720p) ou 1920x1080 (1080p)
- **Codec vidéo:** H.264 (MP4) ou VP9 (WebM)
- **Codec audio:** AAC (MP4) ou Opus (WebM)
- **Bitrate vidéo:** 2-5 Mbps
- **Bitrate audio:** 128-192 kbps
- **Durée:** 2-10 minutes par recette

### Convention de Nommage
Format: `nom-du-plat.mp4`

Exemples:
- `ndole-royal.mp4`
- `achu-traditionnel.mp4`
- `poulet-dg.mp4`

## Sous-titres (WebVTT)

Les sous-titres sont stockés dans `/public/subtitles/` et suivent le format WebVTT.

### Format WebVTT
```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Texte du sous-titre ici

00:00:05.000 --> 00:00:10.000
Texte suivant
```

### Convention de Nommage des Sous-titres
Format: `nom-du-plat.vtt`

Exemples:
- `ndole-royal.vtt`
- `achu-traditionnel.vtt`

### Langues Supportées
- Français (fr) - Langue principale
- Anglais (en) - Pour les régions anglophones
- Autres langues locales (à venir)

## Intégration dans le Code

### Ajouter une Vidéo à une Recette

Dans `DataService.ts`:

```typescript
new Recipe(
  1,
  'Ndolé Royal',
  'Description...',
  'Ingrédients...',
  'Instructions...',
  'Littoral',
  '/images/littoral/ndole.jpeg',
  45,
  'Moyen',
  'Chef Marie',
  new Date(),
  '/videos/littoral/ndole-royal.mp4',      // URL vidéo
  '/subtitles/ndole-royal.vtt'             // URL sous-titres
)
```

## Fonctionnalités du Lecteur Vidéo

### Contrôles Disponibles
- ▶️ Lecture/Pause
- ⏩ Barre de progression cliquable
- 🔊 Contrôle du volume
- CC Activation/désactivation des sous-titres
- ⚡ Vitesse de lecture (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- ⛶ Mode plein écran

### Raccourcis Clavier
- **Espace:** Lecture/Pause
- **Flèche gauche/droite:** Reculer/Avancer de 5 secondes
- **Flèche haut/bas:** Augmenter/Diminuer le volume
- **F:** Plein écran
- **C:** Activer/Désactiver les sous-titres
- **Échap:** Quitter le plein écran ou fermer la modal

## Optimisation des Vidéos

### Compression Recommandée

Utiliser FFmpeg pour optimiser:

```bash
# Convertir en MP4 optimisé
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k output.mp4

# Créer une version WebM
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k output.webm

# Réduire la taille
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 output-720p.mp4
```

### Miniatures (Thumbnails)

Générer une miniature:

```bash
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```

## Checklist pour Ajouter une Vidéo

- [ ] Vidéo filmée et montée
- [ ] Vidéo compressée au bon format (MP4)
- [ ] Vidéo placée dans le bon dossier régional
- [ ] Fichier de sous-titres créé (format WebVTT)
- [ ] Sous-titres synchronisés avec la vidéo
- [ ] Recette mise à jour dans DataService.ts
- [ ] Test de lecture sur différents navigateurs
- [ ] Test des sous-titres
- [ ] Vérification de la qualité audio/vidéo

## Exemples Disponibles

### Vidéos Exemple
- `/videos/littoral/exemple-ndole.mp4` (à ajouter)
- `/videos/ouest/exemple-achu.mp4` (à ajouter)

### Sous-titres Exemple
- ✅ `/subtitles/exemple-ndole.vtt`
- ✅ `/subtitles/exemple-achu.vtt`

## Statistiques

- **Dossiers créés:** 10 régions
- **Vidéos disponibles:** 0
- **Sous-titres disponibles:** 2 exemples

## Prochaines Étapes

1. Filmer les recettes prioritaires (Ndolé, Achu, Poulet DG)
2. Créer les sous-titres pour chaque vidéo
3. Optimiser les vidéos pour le web
4. Tester sur différents appareils
5. Ajouter des traductions en anglais

---

**Dernière mise à jour:** 17 avril 2026
