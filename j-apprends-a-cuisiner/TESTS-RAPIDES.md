# 🧪 Tests Rapides - Images et Vidéos

## Problème Résolu

Les images et vidéos ne s'affichaient pas car:
1. ✅ Les chemins dans DataService ont été corrigés
2. ✅ Les styles CSS ont été importés dans main.ts
3. ✅ Les recettes utilisent maintenant les vraies images du dossier `/public/images/`

## Tests à Effectuer

### 1. Tester les Images

#### Option A: Page de Test Dédiée
```bash
npm run dev
```
Puis ouvrir: `http://localhost:5173/test-images.html`

Cette page affiche toutes les images disponibles par région avec:
- ✅ Icône verte si l'image se charge
- ❌ Message rouge si l'image est manquante

#### Option B: Console du Navigateur
Ouvrir la console (F12) et vérifier:
- Nombre d'images chargées
- Nombre d'images manquantes
- Erreurs 404

### 2. Vérifier les Chemins d'Images

Les images doivent être accessibles via:
```
http://localhost:5173/images/[region]/[nom-fichier]
```

Exemples:
- `http://localhost:5173/images/centre/Ngomba de poisson d'eau douce.jpeg`
- `http://localhost:5173/images/littoral/ndolé.jpeg`
- `http://localhost:5173/images/ouest/Atchu.jpeg`

### 3. Tester les Recettes dans l'Application

1. Lancer l'application: `npm run dev`
2. Naviguer vers la page des recettes
3. Vérifier que les images s'affichent sur les cartes
4. Cliquer sur une recette pour voir les détails

### 4. Tester les Vidéos (si disponibles)

Pour les recettes avec vidéos (Ndolé, Achu):
1. Cliquer sur la recette
2. La modal devrait afficher:
   - L'image de la recette
   - Le lecteur vidéo (si vidéo disponible)
   - Les contrôles de lecture
   - Le bouton CC pour les sous-titres

## Images Disponibles par Région

### ✅ Centre (2 images)
- Ngomba de poisson d'eau douce
- Njama-Njama

### ✅ Extrême-Nord (7 images)
- Sauce gombo
- Oseille ou foloré
- Sauce tasba
- Moringa préparé
- Feuille de moringa
- Sauce oseille préparé
- Sauce feuilles baobab (lalo)

### ✅ Littoral (2 images)
- Ndolé
- Mbongo tchobi

### ✅ Nord-Ouest (1 image)
- Njama-Njama

### ✅ Ouest (3 images)
- Achu
- Taro sauce jaune
- Njapché

### ✅ Sud-Ouest (3 images)
- Eru and water fufu
- Kati-kati
- Mets de pistaches

## Commandes Utiles

### Démarrer le Serveur de Développement
```bash
cd j-apprends-a-cuisiner
npm install  # Si pas encore fait
npm run dev
```

### Vérifier les Fichiers Images
```bash
# Windows PowerShell
Get-ChildItem -Path "public/images" -Recurse -File

# Compter les images
(Get-ChildItem -Path "public/images" -Recurse -File).Count
```

### Vérifier les Vidéos
```bash
# Windows PowerShell
Get-ChildItem -Path "public/videos" -Recurse -File
Get-ChildItem -Path "public/subtitles" -File
```

## Dépannage

### Les Images Ne S'Affichent Pas

**Vérification 1: Le serveur est lancé**
```bash
npm run dev
```

**Vérification 2: Les fichiers existent**
```bash
# Vérifier qu'un fichier existe
Test-Path "public/images/littoral/ndolé.jpeg"
```

**Vérification 3: Les chemins sont corrects**
- Les chemins dans DataService commencent par `/images/`
- Les noms de fichiers correspondent exactement (majuscules, espaces, accents)

**Vérification 4: Console du navigateur**
- Ouvrir F12
- Onglet "Network"
- Filtrer par "Img"
- Vérifier les erreurs 404

### Les Vidéos Ne Se Chargent Pas

**Vérification 1: Les fichiers vidéo existent**
```bash
Test-Path "public/videos/littoral/ndole-royal.mp4"
```

**Vérification 2: Les chemins dans DataService**
Les recettes avec vidéos doivent avoir:
```typescript
new Recipe(
  // ... autres paramètres
  new Date(),
  '/videos/region/nom-video.mp4',    // URL vidéo
  '/subtitles/nom-video.vtt'         // URL sous-titres
)
```

**Vérification 3: Format vidéo supporté**
- MP4 (H.264) - Recommandé
- WebM (VP9)
- OGG

### Les Sous-titres Ne S'Affichent Pas

**Vérification 1: Format WebVTT**
Le fichier doit commencer par:
```
WEBVTT

00:00:00.000 --> 00:00:05.000
Texte du sous-titre
```

**Vérification 2: Bouton CC**
Cliquer sur le bouton "CC" dans le lecteur vidéo

**Vérification 3: Console**
Vérifier les erreurs dans la console (F12)

## Checklist Complète

### Images
- [ ] Serveur de développement lancé
- [ ] Page test-images.html accessible
- [ ] Images du Centre s'affichent
- [ ] Images de l'Extrême-Nord s'affichent
- [ ] Images du Littoral s'affichent
- [ ] Images du Nord-Ouest s'affichent
- [ ] Images de l'Ouest s'affichent
- [ ] Images du Sud-Ouest s'affichent
- [ ] Aucune erreur 404 dans la console

### Vidéos (si disponibles)
- [ ] Fichiers vidéo dans /public/videos/
- [ ] Fichiers sous-titres dans /public/subtitles/
- [ ] Lecteur vidéo s'affiche dans la modal
- [ ] Contrôles de lecture fonctionnent
- [ ] Bouton CC pour sous-titres visible
- [ ] Sous-titres se synchronisent avec la vidéo
- [ ] Mode plein écran fonctionne

### Application
- [ ] Les cartes de recettes affichent les images
- [ ] Le clic sur une recette ouvre la modal
- [ ] La modal affiche l'image de la recette
- [ ] Les informations de la recette sont complètes
- [ ] Le design est responsive (mobile/tablette)

## Résultats Attendus

### Page test-images.html
- 18 images devraient se charger correctement
- Aucun message d'erreur rouge
- Console affiche: "✅ Images chargées: 18"

### Application Principale
- Toutes les recettes avec images réelles les affichent
- Les recettes sans images utilisent des placeholders Unsplash
- Les recettes avec vidéos affichent le badge 🎥
- La modal s'ouvre sans erreur

## Support

Si les problèmes persistent:

1. **Vérifier la structure des dossiers**
   ```
   public/
   ├── images/
   │   ├── centre/
   │   ├── extreme-nord/
   │   ├── littoral/
   │   ├── nord-ouest/
   │   ├── ouest/
   │   └── sud-ouest/
   ├── videos/
   └── subtitles/
   ```

2. **Vérifier les imports dans main.ts**
   ```typescript
   import './modern.css';
   import './styles/video-player.css';
   import './styles/recipe-modal.css';
   ```

3. **Rebuild le projet**
   ```bash
   npm run build
   npm run dev
   ```

4. **Vider le cache du navigateur**
   - Chrome: Ctrl + Shift + Delete
   - Firefox: Ctrl + Shift + Delete
   - Edge: Ctrl + Shift + Delete

---

**Dernière mise à jour:** 17 avril 2026  
**Statut:** ✅ Prêt pour les tests
