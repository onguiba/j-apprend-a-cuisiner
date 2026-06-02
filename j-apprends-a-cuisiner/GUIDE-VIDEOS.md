# Guide d'Utilisation des Vidéos et Sous-titres

## 📹 Vue d'Ensemble

L'application "J'apprends à Cuisiner" intègre maintenant un système complet de vidéos de recettes avec sous-titres synchronisés. Ce guide explique comment utiliser et ajouter des vidéos.

---

## 🎬 Fonctionnalités du Lecteur Vidéo

### Contrôles Disponibles

| Contrôle | Icône | Description |
|----------|-------|-------------|
| Lecture/Pause | ▶️ ⏸ | Démarre ou met en pause la vidéo |
| Barre de progression | ━━━━ | Affiche et permet de naviguer dans la vidéo |
| Temps | 0:00 / 5:30 | Affiche le temps écoulé et la durée totale |
| Sous-titres | CC | Active/désactive les sous-titres |
| Vitesse | 1x | Change la vitesse de lecture |
| Plein écran | ⛶ | Active le mode plein écran |

### Vitesses de Lecture Disponibles
- 0.5x - Très lent (pour débutants)
- 0.75x - Lent
- 1x - Normal
- 1.25x - Rapide
- 1.5x - Très rapide
- 2x - Ultra rapide

---

## 📝 Système de Sous-titres

### Format WebVTT

Les sous-titres utilisent le format WebVTT (Web Video Text Tracks), un standard web pour les sous-titres.

#### Structure d'un Fichier WebVTT

```vtt
WEBVTT

NOTE
Description ou commentaires

00:00:00.000 --> 00:00:05.000
Premier sous-titre affiché de 0 à 5 secondes

00:00:05.000 --> 00:00:10.000
Deuxième sous-titre affiché de 5 à 10 secondes
```

#### Règles de Timing
- Format: `HH:MM:SS.mmm` (heures:minutes:secondes.millisecondes)
- Durée recommandée: 3-7 secondes par sous-titre
- Nombre de caractères: 40-60 caractères par ligne
- Maximum 2 lignes par sous-titre

### Créer des Sous-titres

#### Méthode 1: Manuellement

1. Créer un fichier `.vtt`
2. Commencer par `WEBVTT`
3. Ajouter les sous-titres avec timing

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Bienvenue dans cette recette du Ndolé

00:00:05.000 --> 00:00:10.000
Commençons par préparer les ingrédients
```

#### Méthode 2: Outils en Ligne

Outils recommandés:
- **Subtitle Edit** (gratuit, Windows/Linux)
- **Aegisub** (gratuit, multiplateforme)
- **YouTube Studio** (générer puis exporter)
- **Happy Scribe** (automatique avec IA)

#### Méthode 3: Conversion depuis SRT

Si vous avez des sous-titres SRT:

```bash
# Convertir SRT en VTT
ffmpeg -i subtitles.srt subtitles.vtt
```

---

## 🎯 Ajouter une Vidéo à une Recette

### Étape 1: Préparer la Vidéo

1. **Filmer la recette**
   - Qualité minimale: 720p
   - Durée recommandée: 3-8 minutes
   - Bon éclairage et son clair

2. **Monter la vidéo**
   - Couper les temps morts
   - Ajouter des transitions
   - Vérifier l'audio

3. **Compresser la vidéo**

```bash
# Compression optimale avec FFmpeg
ffmpeg -i input.mov \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

### Étape 2: Créer les Sous-titres

1. **Transcrire le contenu**
   - Noter tout ce qui est dit
   - Inclure les étapes importantes

2. **Créer le fichier VTT**
   - Utiliser un éditeur de sous-titres
   - Synchroniser avec la vidéo
   - Tester la lisibilité

3. **Exemple de structure**

```vtt
WEBVTT

NOTE Recette: Ndolé Royal - Région: Littoral

00:00:00.000 --> 00:00:05.000
Bienvenue ! Aujourd'hui, nous préparons
le Ndolé Royal du Littoral

00:00:05.000 --> 00:00:10.000
Ingrédients: feuilles de ndolé,
arachides, crevettes, poisson fumé

00:00:10.000 --> 00:00:15.000
Commençons par faire bouillir
les feuilles de ndolé
```

### Étape 3: Organiser les Fichiers

1. **Placer la vidéo**
```
/public/videos/[region]/nom-du-plat.mp4
```

Exemple:
```
/public/videos/littoral/ndole-royal.mp4
```

2. **Placer les sous-titres**
```
/public/subtitles/nom-du-plat.vtt
```

Exemple:
```
/public/subtitles/ndole-royal.vtt
```

### Étape 4: Mettre à Jour le Code

Dans `src/services/DataService.ts`:

```typescript
new Recipe(
  13,
  'Ndolé Royal',
  'Feuilles amères, arachides, crevettes et poisson fumé',
  'Feuilles de ndolé, arachides, crevettes, poisson fumé, huile de palme, oignons, ail, gingembre',
  'Faire bouillir les feuilles de ndolé. Préparer la pâte d\'arachides. Faire revenir les oignons, ajouter la pâte d\'arachides, puis les feuilles et les protéines.',
  'Littoral',
  '/images/littoral/ndolé.jpeg',
  45,
  'Moyen',
  'Chef Marie',
  new Date(),
  '/videos/littoral/ndole-royal.mp4',    // ← Ajouter l'URL vidéo
  '/subtitles/ndole-royal.vtt'           // ← Ajouter l'URL sous-titres
)
```

---

## 🎨 Personnalisation

### Style des Sous-titres

Dans `src/styles/video-player.css`:

```css
.recipe-video::cue {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 18px;
  font-family: Arial, sans-serif;
  padding: 5px 10px;
  border-radius: 4px;
  line-height: 1.4;
}
```

### Modifier les Couleurs

```css
/* Couleur de la barre de progression */
.video-progress-filled {
  background: #ff6b35; /* Votre couleur */
}

/* Couleur des boutons actifs */
.video-btn.active {
  background: #ff6b35; /* Votre couleur */
}
```

---

## 🧪 Tests

### Checklist de Test

- [ ] La vidéo se charge correctement
- [ ] Les contrôles fonctionnent (play, pause, seek)
- [ ] Les sous-titres s'affichent au bon moment
- [ ] Les sous-titres sont lisibles
- [ ] Le mode plein écran fonctionne
- [ ] La vidéo est responsive (mobile/tablette)
- [ ] L'audio est clair
- [ ] La qualité vidéo est acceptable
- [ ] Le temps de chargement est raisonnable

### Tester sur Différents Navigateurs

- Chrome/Edge (Chromium)
- Firefox
- Safari (Mac/iOS)
- Mobile (Android/iOS)

---

## 📊 Bonnes Pratiques

### Vidéo

✅ **À Faire:**
- Utiliser un trépied pour stabilité
- Bon éclairage naturel ou artificiel
- Micro externe pour meilleur son
- Montrer clairement chaque étape
- Durée optimale: 3-8 minutes

❌ **À Éviter:**
- Vidéos trop longues (>15 min)
- Mauvais éclairage
- Son de mauvaise qualité
- Fichiers trop lourds (>50 MB)
- Résolution trop basse (<720p)

### Sous-titres

✅ **À Faire:**
- Phrases courtes et claires
- Synchronisation précise
- Vocabulaire simple
- Inclure les étapes importantes
- Relire et corriger

❌ **À Éviter:**
- Texte trop long
- Timing incorrect
- Fautes d'orthographe
- Jargon complexe
- Sous-titres qui défilent trop vite

---

## 🔧 Dépannage

### La Vidéo Ne Se Charge Pas

1. Vérifier le chemin du fichier
2. Vérifier le format (MP4 recommandé)
3. Vérifier la taille (<50 MB)
4. Vérifier les permissions du fichier

### Les Sous-titres Ne S'Affichent Pas

1. Vérifier le format WebVTT
2. Vérifier que le fichier commence par `WEBVTT`
3. Vérifier le chemin du fichier
4. Vérifier la syntaxe du timing

### Problèmes de Performance

1. Compresser davantage la vidéo
2. Réduire la résolution (720p au lieu de 1080p)
3. Utiliser un CDN pour l'hébergement
4. Activer le lazy loading

---

## 📚 Ressources

### Outils Recommandés

- **FFmpeg** - Conversion et compression vidéo
- **Subtitle Edit** - Édition de sous-titres
- **HandBrake** - Compression vidéo (interface graphique)
- **VLC Media Player** - Test de vidéos et sous-titres

### Documentation

- [WebVTT Specification](https://www.w3.org/TR/webvtt1/)
- [MDN: Video Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [MDN: Track Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)

---

**Dernière mise à jour:** 17 avril 2026
