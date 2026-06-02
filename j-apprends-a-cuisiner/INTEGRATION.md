# 🔌 Guide d'Intégration - Système Vidéo

## Étapes d'Intégration Rapide

### 1. Importer les Styles CSS

Dans votre fichier principal (`main.ts` ou `app.ts`):

```typescript
// Styles existants
import './style.css';
import './modern.css';
import './app.css';

// ✅ AJOUTER ces nouveaux styles
import './styles/video-player.css';
import './styles/recipe-modal.css';
```

### 2. Importer les Composants

```typescript
// ✅ AJOUTER ces imports
import { VideoPlayer } from './components/VideoPlayer';
import { RecipeDetailModal } from './components/RecipeDetailModal';
```

### 3. Utiliser la Modal avec Vidéo

Remplacez votre code d'affichage de recette actuel par:

```typescript
// Exemple: Lors du clic sur une carte de recette
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const recipeCard = target.closest('.recipe-card-modern');
  
  if (recipeCard) {
    const recipeId = recipeCard.getAttribute('data-recipe-id');
    const recipe = dataService.getRecipeById(Number(recipeId));
    
    if (recipe) {
      // ✅ Utiliser la nouvelle modal
      const modal = new RecipeDetailModal();
      modal.show(recipe);
    }
  }
});
```

### 4. Mettre à Jour les Recettes avec Vidéos

Dans `DataService.ts`, ajoutez les URLs de vidéos aux recettes:

```typescript
// Exemple pour le Ndolé
new Recipe(
  13,
  'Ndolé Royal',
  'Feuilles amères, arachides, crevettes et poisson fumé',
  'Feuilles de ndolé, arachides, crevettes, poisson fumé, huile de palme, oignons, ail, gingembre',
  'Faire bouillir les feuilles de ndolé. Préparer la pâte d\'arachides...',
  'Littoral',
  '/images/littoral/ndolé.jpeg',
  45,
  'Moyen',
  'Chef Marie',
  new Date(),
  '/videos/littoral/ndole-royal.mp4',    // ← Ajouter
  '/subtitles/ndole-royal.vtt'           // ← Ajouter (optionnel)
)
```

---

## Code Complet d'Exemple

### main.ts (Exemple Complet)

```typescript
import './style.css';
import './modern.css';
import './app.css';
import './styles/video-player.css';
import './styles/recipe-modal.css';

import { DataService } from './services/DataService';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { HomePage } from './pages/HomePage';
import { RegionsPage } from './pages/RegionsPage';
import { FavoritesPage } from './pages/FavoritesPage';

// Initialiser les services
const dataService = DataService.getInstance();

// Initialiser les pages
const homePage = new HomePage();
const regionsPage = new RegionsPage();
const favoritesPage = new FavoritesPage();

// Router simple
function navigateTo(page: string) {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  switch (page) {
    case 'home':
      appContainer.innerHTML = homePage.render();
      break;
    case 'regions':
      appContainer.innerHTML = regionsPage.render();
      break;
    case 'favorites':
      appContainer.innerHTML = favoritesPage.render();
      break;
  }

  // Attacher les événements après le rendu
  attachRecipeCardEvents();
}

// Attacher les événements aux cartes de recettes
function attachRecipeCardEvents() {
  const recipeCards = document.querySelectorAll('.recipe-card-modern');
  
  recipeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const recipeId = card.getAttribute('data-recipe-id');
      const recipe = dataService.getRecipeById(Number(recipeId));
      
      if (recipe) {
        const modal = new RecipeDetailModal();
        modal.show(recipe);
      }
    });
  });
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Navigation par défaut
  navigateTo('home');

  // Événements de navigation
  document.querySelectorAll('[data-nav]').forEach(navItem => {
    navItem.addEventListener('click', (e) => {
      e.preventDefault();
      const page = (e.currentTarget as HTMLElement).getAttribute('data-nav');
      if (page) navigateTo(page);
    });
  });
});
```

---

## Vérification de l'Intégration

### Checklist

- [ ] Les styles CSS sont importés
- [ ] Les composants sont importés
- [ ] La modal s'affiche au clic sur une recette
- [ ] Les vidéos se chargent (si disponibles)
- [ ] Les sous-titres fonctionnent (si disponibles)
- [ ] Les contrôles vidéo répondent
- [ ] Le mode plein écran fonctionne
- [ ] La modal se ferme correctement
- [ ] Pas d'erreurs dans la console

### Tests Rapides

#### 1. Tester sans Vidéo
```typescript
// Recette sans vidéo - doit afficher uniquement l'image
const recipe = dataService.getRecipeById(1);
const modal = new RecipeDetailModal();
modal.show(recipe);
```

#### 2. Tester avec Vidéo
```typescript
// Recette avec vidéo - doit afficher le lecteur
const recipe = dataService.getRecipeById(13); // Ndolé avec vidéo
const modal = new RecipeDetailModal();
modal.show(recipe);
```

#### 3. Tester les Sous-titres
```typescript
// Vérifier que les sous-titres s'affichent
const recipe = dataService.getRecipeById(13);
const modal = new RecipeDetailModal();
modal.show(recipe);
// Cliquer sur le bouton CC dans le lecteur
```

---

## Dépannage Courant

### Problème: Les styles ne s'appliquent pas

**Solution:**
```typescript
// Vérifier l'ordre d'import
import './styles/video-player.css';  // Avant
import './styles/recipe-modal.css';  // Après
```

### Problème: La vidéo ne se charge pas

**Vérifications:**
1. Le chemin de la vidéo est correct
2. Le fichier vidéo existe
3. Le format est supporté (MP4 recommandé)
4. La console ne montre pas d'erreur 404

**Solution:**
```typescript
// Vérifier dans la console
console.log(recipe.getVideoURL());
console.log(recipe.hasVideo());
```

### Problème: Les sous-titres ne s'affichent pas

**Vérifications:**
1. Le fichier .vtt existe
2. Le format WebVTT est correct
3. Le fichier commence par "WEBVTT"
4. Le timing est valide

**Solution:**
```typescript
// Vérifier le fichier VTT
fetch('/subtitles/exemple-ndole.vtt')
  .then(r => r.text())
  .then(console.log);
```

### Problème: La modal ne se ferme pas

**Solution:**
```typescript
// Vérifier que l'événement est bien attaché
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    console.log('Escape pressed');
  }
});
```

---

## Personnalisation Rapide

### Changer la Couleur Principale

Dans `video-player.css`:

```css
:root {
  --primary-color: #ff6b35; /* Votre couleur */
}
```

### Modifier la Taille des Sous-titres

Dans `video-player.css`:

```css
.recipe-video::cue {
  font-size: 20px; /* Augmenter ou diminuer */
}
```

### Changer la Position des Contrôles

Dans `video-player.css`:

```css
.video-custom-controls {
  bottom: 0; /* Changer la position */
}
```

---

## Exemples d'Utilisation Avancée

### 1. Lecteur Vidéo Standalone

```typescript
import { VideoPlayer } from './components/VideoPlayer';

// Créer un lecteur dans n'importe quel conteneur
const player = new VideoPlayer('my-container');
player.loadVideo(
  '/videos/littoral/ndole-royal.mp4',
  '/subtitles/ndole-royal.vtt'
);

// Nettoyer quand terminé
player.destroy();
```

### 2. Modal Personnalisée

```typescript
import { RecipeDetailModal } from './components/RecipeDetailModal';

const modal = new RecipeDetailModal();

// Afficher
modal.show(recipe);

// Fermer programmatiquement
modal.close();
```

### 3. Événements Personnalisés

```typescript
// Écouter les événements vidéo
const videoElement = document.querySelector('.recipe-video');

videoElement?.addEventListener('play', () => {
  console.log('Vidéo démarrée');
});

videoElement?.addEventListener('ended', () => {
  console.log('Vidéo terminée');
});
```

---

## Performance

### Optimisations Recommandées

#### 1. Lazy Loading des Vidéos

```typescript
// Charger la vidéo uniquement quand visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target as HTMLVideoElement;
      video.load();
    }
  });
});

const videos = document.querySelectorAll('.recipe-video');
videos.forEach(video => observer.observe(video));
```

#### 2. Préchargement Intelligent

```typescript
// Précharger uniquement les métadonnées
<video preload="metadata">
  <source src="video.mp4" type="video/mp4">
</video>
```

#### 3. Compression des Vidéos

```bash
# Utiliser FFmpeg pour compresser
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium output.mp4
```

---

## Support Navigateurs

### Compatibilité

| Navigateur | Version Min | Support Vidéo | Support WebVTT |
|------------|-------------|---------------|----------------|
| Chrome | 60+ | ✅ | ✅ |
| Firefox | 55+ | ✅ | ✅ |
| Safari | 12+ | ✅ | ✅ |
| Edge | 79+ | ✅ | ✅ |
| Mobile Safari | 12+ | ✅ | ✅ |
| Chrome Mobile | 60+ | ✅ | ✅ |

### Polyfills

Pour les navigateurs plus anciens:

```html
<!-- Ajouter dans index.html -->
<script src="https://cdn.jsdelivr.net/npm/video.js@7/dist/video.min.js"></script>
```

---

## Ressources Utiles

### Documentation
- [MDN: Video Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [WebVTT Specification](https://www.w3.org/TR/webvtt1/)
- [Can I Use: Video](https://caniuse.com/video)

### Outils
- [FFmpeg](https://ffmpeg.org/) - Conversion vidéo
- [Subtitle Edit](https://www.nikse.dk/subtitleedit) - Édition sous-titres
- [HandBrake](https://handbrake.fr/) - Compression vidéo

---

## Support

Pour toute question:
1. Consulter GUIDE-VIDEOS.md
2. Vérifier MISE-A-JOUR-VIDEOS.md
3. Tester avec les exemples fournis

---

**Prêt à démarrer!** 🚀

Suivez ces étapes et votre système de vidéos sera opérationnel en quelques minutes.
