import "./modern.css";
import "./app.css";
import "./styles/admin-professional.css";
import "./styles/catefood-home.css";
import "./styles/profile-search.css";
import "./styles/profile-elegant.css";
import "./styles/sidebar-desktop.css";
import { HomePage } from './pages/HomePage';

// ─── Helper: encode public path for use in URL / CSS ───────────────────────
function p(path: string): string {
  return path
    .split("/")
    .map((seg, i) =>
      i === 0 ? seg : encodeURIComponent(seg).replace(/%2B/g, "+")
    )
    .join("/");
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface Recipe {
  id: number;
  title: string;
  region: string;
  time: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  image: string;
  video?: string;
  extraImages?: string[];
  isFavorite: boolean;
  description: string;
  ingredients: string[];
  steps: string[];
}

interface Region {
  name: string;
  image: string;
  description: string;
  specialties: string[];
  color: string;
  emoji: string;
}

// ─── Données — Recettes par région ──────────────────────────────────────────
const ALL_RECIPES: Recipe[] = [

  // ── CENTRE ────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Ngomba de Poisson",
    region: "Centre",
    time: "60 min",
    difficulty: "Moyen",
    image: "/images/centre/Ngomba de poisson d'eau douce.jpeg",
    isFavorite: false,
    description: "Le Ngomba est une préparation typique du Centre Cameroun à base de poisson d'eau douce cuit dans une feuille de bananier avec des épices locales (djansang, njangsang). Ce mets reflète l'ingéniosité culinaire des peuples béti.",
    ingredients: [
      "1 poisson d'eau douce de 800 g",
      "Feuilles de bananier (pour l'emballage)",
      "2 oignons hachés",
      "3 gousses d'ail",
      "2 tomates concassées",
      "Piment selon goût",
      "Sel et poivre",
      "Huile de palme : 3 c. à soupe",
      "Djansang / njangsang : 1 c. à café",
    ],
    steps: [
      "Nettoyer le poisson, inciser la chair des deux côtés et saler légèrement.",
      "Préparer la marinade avec l'ail écrasé, le piment, les oignons et les épices. Laisser mariner 30 min.",
      "Faire fondre les tomates à feu doux avec l'huile de palme et les oignons restants.",
      "Poser le poisson sur une feuille de bananier préalablement flambée. Verser la sauce dessus.",
      "Replier la feuille de bananier et ficeler soigneusement.",
      "Cuire au grill ou à la braise environ 30 min en retournant à mi-cuisson.",
      "Servir chaud avec du bâton de manioc ou du riz blanc.",
    ],
  },
  {
    id: 2,
    title: "Njama-Njama Sauté",
    region: "Centre",
    time: "35 min",
    difficulty: "Facile",
    image: "/images/centre/Njama- Njama.jpeg",
    isFavorite: false,
    description: "Les Njama-Njama sont des feuilles d'huckleberry (vernonia) sautées. Riches en fer et en vitamines, elles constituent l'un des accompagnements les plus savoureux et les plus nutritifs de la cuisine camerounaise.",
    ingredients: [
      "500 g de feuilles de njama-njama (huckleberry)",
      "1 oignon moyen haché",
      "2 tomates",
      "Huile de palme : 2 c. à soupe",
      "Crevettes séchées : 50 g",
      "Sel et piment au goût",
      "Eau : 1/2 verre",
    ],
    steps: [
      "Laver soigneusement les feuilles, les égoutter et les hacher grossièrement.",
      "Dans une casserole, faire chauffer l'huile de palme puis faire revenir les oignons jusqu'à translucidité.",
      "Ajouter les tomates en dés, les crevettes séchées. Cuire 5 min.",
      "Ajouter les feuilles hachées, saler et pimenter. Bien mélanger.",
      "Couvrir et laisser cuire à feu doux 15-20 min en remuant régulièrement.",
      "Servir avec du fufu de maïs, du plantain ou du riz.",
    ],
  },

  // ── LITTORAL ──────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Mbongo Tchobi",
    region: "Littoral",
    time: "90 min",
    difficulty: "Difficile",
    image: "/images/littoral/Mbongo tchobi.jpeg",
    video: "/images/littoral/Mbongo tchobi.mp4",
    isFavorite: false,
    description: "Le Mbongo Tchobi est l'un des plats emblématiques du Cameroun, originaire des Bassa du Littoral. Sa sauce noire caractéristique est obtenue grâce aux épices mbongo carbonisées. Un festin d'arômes fumés, épicés et profonds.",
    ingredients: [
      "1 kg de poisson (tilapia, silure) ou de poulet",
      "Épices mbongo : 100 g (brûlées puis moulues)",
      "Feuilles de bongo : quelques feuilles",
      "2 oignons hachés",
      "4 tomates concassées",
      "Piment rouge : 2-3 pièces",
      "Gingembre frais : 1 morceau",
      "Ail : 4 gousses",
      "Sel au goût",
      "Huile de palme : 3 c. à soupe",
    ],
    steps: [
      "Brûler les épices mbongo dans une casserole sèche jusqu'à carbonisation. Laisser refroidir puis moudre en poudre fine.",
      "Assaisonner le poisson avec l'ail écrasé, le gingembre râpé, le sel. Mariner 1 heure.",
      "Faire revenir les oignons dans l'huile de palme. Ajouter les tomates et le piment. Laisser compoter 10 min.",
      "Incorporer la poudre mbongo et les feuilles de bongo. Mélanger soigneusement.",
      "Ajouter le poisson et couvrir d'eau. Laisser mijoter 30 min à feu doux.",
      "Ajuster l'assaisonnement. La sauce doit être noire, épaisse et onctueuse.",
      "Servir chaud avec des plantains mûrs bouillis ou du riz blanc.",
    ],
  },
  {
    id: 4,
    title: "Ndolé",
    region: "Littoral",
    time: "45 min",
    difficulty: "Moyen",
    image: "/images/littoral/ndolé.jpeg",
    isFavorite: true,
    description: "Le Ndolé est le plat national non officiel du Cameroun ! Cette sauce amère à base de feuilles de ndolé, d'arachides pilées et de viande ou de crevettes est la fierté absolue de la gastronomie camerounaise. Incontournable.",
    ingredients: [
      "500 g de feuilles de ndolé",
      "250 g d'arachides grillées",
      "300 g de viande (boeuf ou poisson fumé)",
      "Crevettes séchées : 100 g",
      "2 oignons",
      "3 gousses d'ail",
      "Poivre, sel, piment",
      "Huile de palme : 3 c. à soupe",
      "Eau : 500 ml",
    ],
    steps: [
      "Laver les feuilles de ndolé plusieurs fois à l'eau froide pour réduire l'amertume.",
      "Porter à ébullition avec du sel et une pincée de bicarbonate. Égoutter et presser soigneusement.",
      "Mixer les arachides grillées avec un peu d'eau froide jusqu'à obtenir une pâte lisse.",
      "Faire revenir oignons et ail dans l'huile de palme. Ajouter la viande et les crevettes. Dorer.",
      "Incorporer la pâte d'arachide, laisser cuire 10 min en remuant constamment.",
      "Ajouter les feuilles de ndolé et l'eau. Laisser mijoter 20 min à feu doux.",
      "Servir avec des plantains bouillis ou du bâton de manioc (bobolo).",
    ],
  },

  // ── OUEST ─────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Atchu Soup",
    region: "Ouest",
    time: "50 min",
    difficulty: "Moyen",
    image: "/images/ouest/Atchu.jpeg",
    isFavorite: false,
    description: "L'Atchu est une soupe royale bamiléké préparée à base de taro pilé et de bouillon de viande épicé. Plat de prestige servi lors des cérémonies en pays Bamiléké, il symbolise la générosité et la cohésion sociale.",
    ingredients: [
      "1 kg de taro (macabo)",
      "500 g de viande de boeuf ou de mouton",
      "Feuilles de nkui (optionnel pour épaissir)",
      "2 oignons",
      "Piment selon goût",
      "Cendres de bois (pour préparer la gomme)",
      "Sel au goût",
      "Eau : 2 litres",
    ],
    steps: [
      "Éplucher et couper le taro en morceaux. Faire cuire à l'eau salée jusqu'à tendreté complète.",
      "Dans un autre faitout, cuire la viande avec les oignons, le sel et le piment pendant 40 min.",
      "Piler le taro cuit jusqu'à obtenir une pâte lisse et sans grumeaux.",
      "Préparer la gomme : dissoudre des cendres tamisées dans de l'eau bouillante, filtrer soigneusement.",
      "Mélanger le bouillon de viande avec la gomme de cendres pour obtenir une soupe onctueuse.",
      "Former des boulettes de taro pilé et les servir avec la soupe chaude et la viande.",
    ],
  },
  {
    id: 6,
    title: "Njapché",
    region: "Ouest",
    time: "55 min",
    difficulty: "Moyen",
    image: "/images/ouest/Njapché.jpeg",
    video: "/images/ouest/Ndjapche.mp4",
    isFavorite: false,
    description: "Le Njapché est un plat traditionnel bamiléké à base de grains de maïs blanc et de haricots rouges. Nourrissant et savoureux, il est souvent accompagné de viande boucanée. Un pilier de la cuisine de l'Ouest Cameroun.",
    ingredients: [
      "500 g de maïs blanc décortiqué",
      "300 g de haricots rouges",
      "Viande boucanée : 250 g",
      "Crevettes séchées : 50 g",
      "2 oignons",
      "Piment au goût",
      "Huile de palme : 3 c. à soupe",
      "Sel au goût",
    ],
    steps: [
      "Faire tremper les haricots rouges pendant 2 heures minimum. Égoutter.",
      "Faire cuire le maïs et les haricots séparément à l'eau salée jusqu'à tendreté.",
      "Faire revenir les oignons dans l'huile de palme. Ajouter la viande boucanée et les crevettes.",
      "Incorporer les haricots et le maïs cuits. Bien mélanger à feu moyen.",
      "Assaisonner avec le sel et le piment. Laisser mijoter 15 min supplémentaires.",
      "Servir bien chaud en plat principal.",
    ],
  },
  {
    id: 7,
    title: "Taro Sauce Jaune",
    region: "Ouest",
    time: "60 min",
    difficulty: "Facile",
    image: "/images/ouest/Taro sauce jaune.jpeg",
    isFavorite: false,
    description: "Le Taro à la Sauce Jaune est l'un des plats emblématiques de l'Ouest. La sauce jaune est préparée à base de graines de courge moulues (nkui), ce qui lui confère un goût doux, crémeux et légèrement sucré.",
    ingredients: [
      "1 kg de taro (macabo)",
      "200 g de graines de courge (sauce jaune / nkui)",
      "300 g de viande ou de poisson fumé",
      "2 oignons",
      "Piment rouge",
      "Sel au goût",
      "Huile de palme : 2 c. à soupe",
      "Eau suffisante",
    ],
    steps: [
      "Éplucher et laver le taro. Couper en rondelles épaisses. Faire cuire à l'eau salée.",
      "Faire griller les graines de courge à sec dans une poêle. Les moudre en pâte fine.",
      "Faire revenir oignons et piment dans l'huile. Ajouter la viande et la dorer.",
      "Délayer la pâte de graines de courge dans de l'eau chaude. Verser sur la viande.",
      "Laisser mijoter à feu doux 20 min en remuant pour éviter les grumeaux. Saler.",
      "Dresser le taro cuit dans une assiette et napper généreusement de sauce jaune.",
    ],
  },

  // ── EXTRÊME-NORD ──────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Sauce Gombo",
    region: "Extrême-Nord",
    time: "40 min",
    difficulty: "Facile",
    image: "/images/extreme-nord/Sauce gombo.jpeg",
    isFavorite: false,
    description: "La Sauce Gombo est une spécialité de l'Extrême-Nord utilisant les gombos (okra) pour créer une sauce filante et savoureuse. Riche en fibres et en nutriments, elle accompagne classiquement le tô de mil ou de sorgho.",
    ingredients: [
      "500 g de gombos frais",
      "300 g de viande ou de poisson séché",
      "1 oignon haché",
      "2 tomates",
      "Piment selon goût",
      "Sel au goût",
      "Huile : 2 c. à soupe",
      "Eau : 300 ml",
      "Soumbala (graines de néré fermentées) : 1 c. à soupe",
    ],
    steps: [
      "Laver et couper les gombos en rondelles fines. Réserver.",
      "Faire revenir l'oignon dans l'huile chaude jusqu'à dorure. Ajouter la viande.",
      "Incorporer les tomates concassées et le piment. Laisser cuire 10 min.",
      "Ajouter les gombos coupés et l'eau. Mélanger délicatement.",
      "Incorporer le soumbala pour l'arôme profond. Saler.",
      "Cuire 20 min à feu moyen. La sauce deviendra naturellement filante et onctueuse.",
      "Servir avec du tô de mil, de la bouillie de sorgho ou du couscous.",
    ],
  },
  {
    id: 9,
    title: "Sauce Tasba",
    region: "Extrême-Nord",
    time: "45 min",
    difficulty: "Moyen",
    image: "/images/extreme-nord/Sauce tasba.jpeg",
    isFavorite: false,
    description: "La Sauce Tasba est une spécialité de l'Extrême-Nord à base de feuilles de baobab séchées et pilées. Dense, nutritive et parfumée, c'est un pilier de la cuisine sahélienne camerounaise.",
    ingredients: [
      "200 g de feuilles de baobab séchées (tasba)",
      "300 g de viande (boeuf ou mouton)",
      "Crevettes séchées : 50 g",
      "2 oignons",
      "3 tomates",
      "Piment selon goût",
      "Soumbala : 1 c. à soupe",
      "Sel et eau au besoin",
    ],
    steps: [
      "Moudre les feuilles de baobab séchées en poudre fine à l'aide d'un mortier ou d'un mixeur.",
      "Faire cuire la viande avec les oignons hachés, le sel et les épices jusqu'à tendreté.",
      "Ajouter les tomates concassées, les crevettes séchées et le soumbala. Cuire 10 min.",
      "Saupoudrer progressivement la poudre de tasba en remuant régulièrement.",
      "Ajouter de l'eau chaude par petites quantités pour obtenir une sauce épaisse et homogène.",
      "Laisser mijoter 20 min en remuant constamment pour éviter les grumeaux.",
      "Servir avec du mil en boule (tô) ou de la pâte de sorgho.",
    ],
  },
  {
    id: 10,
    title: "Sauce Moringa",
    region: "Extrême-Nord",
    time: "50 min",
    difficulty: "Facile",
    image: "/images/extreme-nord/feuille de moringa.jpg",
    extraImages: [
      "/images/extreme-nord/feuille de moringa.jpg",
      "/images/extreme-nord/moringa prparé.jpg",
    ],
    isFavorite: false,
    description: "La Sauce Moringa est une préparation nutritive à base de feuilles de l'arbre miracle de l'Extrême-Nord. Exceptionnellement riche en protéines, vitamines (C, A, K) et minéraux, le moringa est un superaliment africain.",
    ingredients: [
      "200 g de feuilles de moringa fraîches ou séchées",
      "300 g de viande (boeuf ou poulet)",
      "Pâte d'arachide : 3 c. à soupe",
      "1 oignon moyen",
      "2 tomates",
      "2 gousses d'ail",
      "Sel, poivre au goût",
      "Eau suffisante",
      "Huile : 2 c. à soupe",
    ],
    steps: [
      "Tremper les feuilles de moringa 3-4 min dans de l'eau frémissante pour réduire l'amertume.",
      "Dans une marmite, faire dorer la viande avec les oignons dans l'huile chaude.",
      "Ajouter les tomates concassées, l'ail et la pâte d'arachide. Laisser cuire 10 min.",
      "Incorporer les feuilles de moringa bien égouttées. Mélanger soigneusement.",
      "Ajouter de l'eau pour obtenir la consistance désirée. Saler au goût.",
      "Laisser mijoter 30 min à feu doux. La sauce doit être épaisse.",
      "Servir avec du couscous de mil, du maïs ou du riz.",
    ],
  },
  {
    id: 11,
    title: "Sauce Oseille (Foloré)",
    region: "Extrême-Nord",
    time: "25 min",
    difficulty: "Facile",
    image: "/images/extreme-nord/oseill ou foloré.jpeg",
    extraImages: [
      "/images/extreme-nord/oseill ou foloré.jpeg",
      "/images/extreme-nord/sauce_oseille peparé.jpg",
    ],
    isFavorite: false,
    description: "La Sauce Oseille (Foloré) est une sauce acidulée et raffinée de l'Extrême-Nord. Son goût légèrement acide contraste magnifiquement avec les poissons grillés et les viandes blanches. Un classique intemporel.",
    ingredients: [
      "200 g de feuilles d'oseille fraîches",
      "30 g de beurre",
      "2 échalotes hachées finement",
      "15 cl de crème fraîche",
      "Sel, poivre au goût",
      "Une pincée de sucre",
      "Vin blanc : 10 cl (optionnel)",
    ],
    steps: [
      "Laver et essorer les feuilles d'oseille. Les ciseler en fines lamelles.",
      "Faire fondre le beurre à feu doux jusqu'à ce qu'il mousse. Faire suer les échalotes.",
      "Incorporer les feuilles d'oseille et les faire fondre comme des épinards.",
      "Déglacer avec le vin blanc si utilisé. Laisser réduire 5 min à feu moyen.",
      "Incorporer la crème fraîche. Laisser mijoter 3 min doux.",
      "Assaisonner avec sel, poivre et une pincée de sucre si trop acide.",
      "Servir chaud sur du poisson grillé, du saumon ou des viandes blanches.",
    ],
  },
  {
    id: 12,
    title: "Sauce Feuilles de Baobab",
    region: "Extrême-Nord",
    time: "80 min",
    difficulty: "Moyen",
    image: "/images/extreme-nord/sauce+feuilles+baobab+ou+lalo   1.webp",
    isFavorite: false,
    description: "La Sauce Lalo (Feuilles de Baobab) est un grand classique de l'Extrême-Nord. Les feuilles du baobab séchées et réduites en poudre donnent une sauce visqueuse, nourrissante et pleine de saveurs profondes.",
    ingredients: [
      "100 g de feuilles de baobab séchées (lalo)",
      "300 g de viande (boeuf ou poulet)",
      "1 oignon moyen haché",
      "2 gousses d'ail",
      "2 tomates en dés",
      "Soumbala : 1 c. à soupe",
      "Crevettes séchées : 50 g",
      "Sel, poivre au goût",
      "Eau : 3 tasses",
    ],
    steps: [
      "Faire chauffer l'huile dans une cocotte. Faire dorer la viande coupée avec les oignons.",
      "Ajouter l'ail écrasé, les tomates et l'eau. Assaisonner. Laisser mijoter 1 heure.",
      "Incorporer les feuilles de baobab moulues, les crevettes séchées et le soumbala.",
      "Bien mélanger et laisser cuire encore 20 min pour que les saveurs se marient.",
      "Ajuster l'assaisonnement. La sauce sera liante, visqueuse et onctueuse.",
      "Servir avec du riz basmati, du couscous ou du tô de maïs.",
    ],
  },

  // ── NORD ──────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: "Sauce Boko",
    region: "Nord",
    time: "70 min",
    difficulty: "Moyen",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    video: "/videos/nord/sauce boko.mp4",
    isFavorite: false,
    description: "La Sauce Boko est une préparation authentique du Nord Cameroun. Regardez notre vidéo exclusive pour apprendre comment préparer ce plat traditionnel tel qu'il est transmis de génération en génération dans la région du Nord.",
    ingredients: [
      "Viande de boeuf ou de mouton : 500 g",
      "Légumes de saison (tomates, oignons)",
      "Épices du Nord (soumbala, gingembre, ail)",
      "Piment séché au goût",
      "Huile végétale : 3 c. à soupe",
      "Sel au goût",
      "Eau : 500 ml",
    ],
    steps: [
      "Préparer tous les ingrédients selon les instructions de la vidéo.",
      "Faire revenir la viande avec les oignons et les épices à feu vif.",
      "Incorporer les légumes et laisser mijoter à feu doux.",
      "Ajouter les épices typiques du Nord selon la recette traditionnelle.",
      "Laisser cuire jusqu'à ce que la sauce soit bien parfumée.",
      "Servir avec l'accompagnement traditionnel du Nord Cameroun.",
    ],
  },

  // ── NORD-OUEST ────────────────────────────────────────────────────────────
  {
    id: 14,
    title: "Njama-Njama du Nord-Ouest",
    region: "Nord-Ouest",
    time: "30 min",
    difficulty: "Facile",
    image: "/images/nord-ouest/Njama- Njama.jpeg",
    isFavorite: false,
    description: "Le Njama-Njama du Nord-Ouest est la version la plus authentique des feuilles d'huckleberry (vernonia). C'est l'accompagnement incontournable du fufu corn. Ce plat incarne l'identité culinaire du Nord-Ouest Cameroun.",
    ingredients: [
      "500 g de feuilles de njama-njama",
      "Huile de palme rouge : 2 c. à soupe",
      "1 oignon moyen haché",
      "Crevettes fraîches ou fumées : 100 g",
      "Sel et piment au goût",
      "Eau : 100 ml",
    ],
    steps: [
      "Trier soigneusement les feuilles de njama-njama. Laver à l'eau froide plusieurs fois.",
      "Hacher grossièrement les feuilles lavées.",
      "Chauffer l'huile de palme dans une casserole. Faire sauter les oignons jusqu'à dorure.",
      "Ajouter les crevettes et cuire 5 min.",
      "Incorporer les feuilles hachées. Saler. Pimenter selon goût.",
      "Ajouter un peu d'eau. Couvrir et cuire à feu doux 15 min.",
      "Servir impérativement avec du fufu corn (pâte de maïs blanc) chaud.",
    ],
  },

  // ── SUD-OUEST ─────────────────────────────────────────────────────────────
  {
    id: 15,
    title: "Eru & Water Fufu",
    region: "Sud-Ouest",
    time: "90 min",
    difficulty: "Difficile",
    image: "/images/sud-ouest/Eru and water fufu.jpeg",
    isFavorite: false,
    description: "L'Eru est le plat royal du Sud-Ouest Cameroun. Les feuilles de Gnetum africanum (eru) mijotées avec de la viande fumée et du coco crayfish créent un mets d'une richesse gustative incomparable. Servie avec le water fufu.",
    ingredients: [
      "500 g de feuilles d'eru (Gnetum africanum), finement émincées",
      "300 g de viande fumée (boeuf ou porc)",
      "200 g de waterleaf (optionnel)",
      "Coco crayfish (crevettes séchées broyées) : 100 g",
      "Huile de palme rouge : 100 ml",
      "Sel au goût",
      "Piment selon goût",
    ],
    steps: [
      "Bien laver les feuilles d'eru. Les émincer très finement avec un couteau bien aiguisé.",
      "Blanchir le waterleaf si utilisé. Presser pour enlever l'excès d'eau.",
      "Faire chauffer l'huile de palme dans une grande casserole à feu moyen.",
      "Ajouter la viande fumée préalablement hachée. Faire sauter 5 min.",
      "Incorporer les feuilles d'eru et le waterleaf. Bien mélanger à l'huile.",
      "Ajouter le coco crayfish, saler et pimenter. Couvrir et cuire 30 min à feu doux.",
      "Servir avec du water fufu (pâte de manioc blanc) encore chaud.",
    ],
  },
  {
    id: 16,
    title: "Kati-Kati",
    region: "Sud-Ouest",
    time: "45 min",
    difficulty: "Facile",
    image: "/images/sud-ouest/Kati- kati.jpeg",
    isFavorite: false,
    description: "Le Kati-Kati est un poulet grillé emblématique du Sud-Ouest Cameroun. Enrobé d'épices locales et cuit sur braise de bois ou de charbon, il développe un arôme fumé incomparable qui en fait l'une des grillades les plus appréciées du pays.",
    ingredients: [
      "1 poulet entier coupé en morceaux",
      "Ail : 4 gousses écrasées",
      "Gingembre frais : 2 c. à soupe râpé",
      "Piment vert et rouge au goût",
      "Sel au goût",
      "Jus de citron : 2 c. à soupe",
      "Huile végétale : 2 c. à soupe",
    ],
    steps: [
      "Faire des entailles profondes dans chaque morceau de poulet pour la pénétration des épices.",
      "Préparer la marinade : ail, gingembre, piment, sel, jus de citron et huile. Bien mélanger.",
      "Enduire généreusement les morceaux de poulet de marinade. Laisser reposer 2 heures au frais.",
      "Allumer le charbon de bois et laisser se former de belles braises rougeoyantes.",
      "Griller les morceaux à feu moyen-vif, 10-15 min de chaque côté.",
      "Badigeonner régulièrement avec la marinade restante pendant toute la cuisson.",
      "Servir chaud avec du plantain mûr grillé et du piment frais.",
    ],
  },
  {
    id: 17,
    title: "Mets de Pistaches",
    region: "Sud-Ouest",
    time: "50 min",
    difficulty: "Moyen",
    image: "/images/sud-ouest/Mets de pistaches.jpeg",
    isFavorite: false,
    description: "Le Mets de Pistaches est une préparation crémeuse du Sud-Ouest à base de noix de safou (prunier africain). Cette sauce riche et onctueuse est l'une des plus appréciées de la région.",
    ingredients: [
      "500 g de noix de safou (prunier africain)",
      "300 g de viande fumée ou de poisson braisé",
      "2 oignons hachés",
      "Piment selon goût",
      "Sel au goût",
      "Eau suffisante",
    ],
    steps: [
      "Faire tremper les safous dans de l'eau bouillante 10 min pour les ramollir.",
      "Enlever délicatement les peaux et les noyaux. Écraser ou mixer la chair crémeuse.",
      "Faire revenir les oignons dans un filet d'huile jusqu'à dorure.",
      "Ajouter la viande fumée coupée en morceaux. Faire sauter 5 min.",
      "Incorporer la purée de safou. Mélanger à feu doux.",
      "Ajouter de l'eau progressivement pour obtenir la consistance désirée. Saler et pimenter.",
      "Laisser mijoter 20 min. Servir avec du bâton de manioc ou des plantains.",
    ],
  },

  // ── ADAMAOUA ──────────────────────────────────────────────────────────────
  {
    id: 18,
    title: "Sangha (Ragoût Peul)",
    region: "Adamaoua",
    time: "120 min",
    difficulty: "Difficile",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    isFavorite: false,
    description: "Le Sangha est le ragoût de prestige des Peuls de l'Adamaoua. Cuit longuement avec des épices sahéliennes, il développe des saveurs profondes et une texture fondante. Plat incontournable des grandes célébrations du plateau de l'Adamaoua.",
    ingredients: [
      "1 kg de boeuf (côtes ou épaule)",
      "2 oignons",
      "Ail : 4 gousses",
      "Gingembre : 2 cm de racine",
      "Tomates : 4 pièces",
      "Piment séché au goût",
      "Sel au goût",
      "Huile végétale",
      "Eau : 1 litre",
    ],
    steps: [
      "Découper la viande en gros cubes de 4-5 cm. Saler légèrement et laisser reposer.",
      "Faire dorer les morceaux à feu vif dans une cocotte avec un peu d'huile.",
      "Ajouter les oignons émincés, l'ail écrasé et le gingembre râpé. Faire revenir.",
      "Incorporer les tomates mixées et les épices. Couvrir et laisser mijoter 1h30.",
      "Vérifier régulièrement la cuisson. Ajouter de l'eau si nécessaire.",
      "La sauce doit être réduite, brillante et parfumée. Ajuster l'assaisonnement.",
      "Servir avec du riz, de la boule de mil ou du couscous.",
    ],
  },

  // ── EST ───────────────────────────────────────────────────────────────────
  {
    id: 19,
    title: "Kpwem",
    region: "Est",
    time: "60 min",
    difficulty: "Moyen",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop",
    isFavorite: false,
    description: "Le Kpwem est une sauce ancestrale des peuples de la grande forêt équatoriale de l'Est. À base de feuilles sauvages et de viande de brousse, il représente le lien profond entre l'homme et la forêt équatoriale camerounaise.",
    ingredients: [
      "400 g de feuilles de kpwem (vernonia sauvage)",
      "500 g de viande de brousse ou de boeuf",
      "Huile de palme : 3 c. à soupe",
      "Sel et piment au goût",
      "Djansang : 1 c. à café",
      "Crevettes fumées : 50 g",
    ],
    steps: [
      "Laver soigneusement les feuilles et les blanchir 5 min. Égoutter et hacher.",
      "Faire cuire la viande avec sel et épices locales dans de l'eau pendant 30 min. Réserver le bouillon.",
      "Dans une casserole, chauffer l'huile de palme. Faire revenir les épices djansang.",
      "Ajouter les feuilles hachées, la viande effilochée et les crevettes.",
      "Arroser d'un peu de bouillon. Laisser mijoter 20 min.",
      "Ajuster l'assaisonnement. Servir avec du bâton de manioc.",
    ],
  },

  // ── SUD ───────────────────────────────────────────────────────────────────
  {
    id: 20,
    title: "Bâton de Manioc (Bobolo)",
    region: "Sud",
    time: "180 min",
    difficulty: "Difficile",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
    isFavorite: false,
    description: "Le Bâton de Manioc (Bobolo) est l'accompagnement emblématique des régions forestières du Sud. Sa texture élastique, légèrement fermentée, et son arôme caractéristique en font un produit unique de la gastronomie camerounaise.",
    ingredients: [
      "2 kg de manioc frais",
      "Sel : 1 c. à café",
      "Feuilles de bananier pour l'emballage",
      "Eau de cuisson",
    ],
    steps: [
      "Peler le manioc, le laver soigneusement et le râper finement.",
      "Laisser fermenter le manioc râpé 2-3 jours dans un récipient couvert au frais.",
      "Presser fortement à travers un tissu pour enlever tout l'excès d'eau. Saler.",
      "Former des bâtons de la grosseur d'un poing. Envelopper dans des feuilles de bananier flambées.",
      "Ficeler soigneusement à intervalles réguliers.",
      "Faire bouillir dans une grande quantité d'eau pendant 3-4 heures.",
      "Servir chaud en accompagnement du ndolé, du kpwem ou de la sauce arachide.",
    ],
  },
];

// ─── Données — 11 Régions du Cameroun ───────────────────────────────────────
const ALL_REGIONS: Region[] = [
  {
    name: "Adamaoua",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    description: "Plateaux verdoyants, berceau de la culture peule et de l'élevage.",
    specialties: ["Sangha", "Mbanga Soup", "Lait caillé"],
    color: "#8B5E3C",
    emoji: "🏔️",
  },
  {
    name: "Centre",
    image: "/images/centre/Ngomba de poisson d'eau douce.jpeg",
    description: "Coeur politique et culturel du Cameroun, riche en traditions béti.",
    specialties: ["Ndolé", "Ngomba", "Bâton de manioc"],
    color: "#2D6A4F",
    emoji: "🌿",
  },
  {
    name: "Est",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop",
    description: "Grande forêt équatoriale aux recettes ancestrales des peuples Baka.",
    specialties: ["Kpwem", "Ndomba", "Viande de brousse"],
    color: "#1B4332",
    emoji: "🌳",
  },
  {
    name: "Extrême-Nord",
    image: "/images/extreme-nord/Sauce gombo.jpeg",
    description: "Terres sahéliennes aux saveurs épicées, au mil et au baobab omniprésents.",
    specialties: ["Sauce Gombo", "Sauce Moringa", "Sauce Baobab"],
    color: "#B5451B",
    emoji: "☀️",
  },
  {
    name: "Littoral",
    image: "/images/littoral/ndolé.jpeg",
    description: "Métropole culinaire du Cameroun — Douala et ses mille saveurs marinières.",
    specialties: ["Ndolé", "Mbongo Tchobi", "Poisson braisé"],
    color: "#1565C0",
    emoji: "🌊",
  },
  {
    name: "Nord",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    description: "Savanes et épices sahéliennes, cuisine d'influence peule et hausa.",
    specialties: ["Sauce Boko", "Couscous de mil", "Bouillie"],
    color: "#E65100",
    emoji: "🌾",
  },
  {
    name: "Nord-Ouest",
    image: "/images/nord-ouest/Njama- Njama.jpeg",
    description: "Hauts plateaux aux traditions Grassfields et à l'hospitalité légendaire.",
    specialties: ["Achu Soup", "Fufu Corn", "Njama-Njama"],
    color: "#4A148C",
    emoji: "⛰️",
  },
  {
    name: "Ouest",
    image: "/images/ouest/Njapché.jpeg",
    description: "Pays Bamiléké et Bamoun — deux royaumes, mille recettes savoureuses.",
    specialties: ["Taro Sauce Jaune", "Njapché", "Koki"],
    color: "#E8A030",
    emoji: "👑",
  },
  {
    name: "Sud",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
    description: "Forêts denses aux recettes bulu et fang transmises oralement.",
    specialties: ["Bâton de manioc", "Nkui", "Okok"],
    color: "#1A6B3A",
    emoji: "🌴",
  },
  {
    name: "Sud-Ouest",
    image: "/images/sud-ouest/Eru and water fufu.jpeg",
    description: "Anglophone et créatif, la cuisine aux herbes sauvages et aux épices marines.",
    specialties: ["Eru", "Kati-Kati", "Mets de Pistaches"],
    color: "#006064",
    emoji: "🦞",
  },
  {
    name: "Autre",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    description: "Recettes diverses, fusion et spécialités ne rentrant pas dans les catégories régionales classiques.",
    specialties: ["Cuisine Fusion", "Desserts", "Boissons"],
    color: "#607D8B",
    emoji: "🍲",
  },
];

// ─── Classe principale ───────────────────────────────────────────────────────
class CuisineApp {
  private currentPage = "home";
  private currentRegion: string | null = null;
  private recipes: Recipe[] = ALL_RECIPES.map((r) => ({ ...r }));
  private currentUser: any = null;
  private isLoggedIn = false;
  private searchQuery = "";

  constructor() {
    this.loadSession();
    this.render();
    this.bindEvents();
  }

  // ── Render principal ────────────────────────────────────────────────────
  private render() {
    const app = document.getElementById("app")!;
    
    // Si l'utilisateur est connecté et sur la page home, rediriger vers regions
    if (this.isLoggedIn && this.currentPage === "home") {
      this.currentPage = "regions";
    }
    
    // Ajouter/retirer les classes body
    if (this.currentPage === "home") {
      document.body.classList.add("catefood-home-active");
    } else {
      document.body.classList.remove("catefood-home-active");
    }
    
    if (this.isLoggedIn) {
      document.body.classList.add("user-logged-in");
      app.innerHTML = `
        <div class="app-wrapper app-desktop">
          <aside class="app-sidebar" id="app-sidebar">
            ${this.renderSidebar()}
          </aside>
          <div class="sidebar-overlay" id="sidebar-overlay"></div>
          <div class="app-main-area">
            ${this.renderHeaderDesktop()}
            <main class="page-content" id="page-content">
              ${this.renderPage()}
            </main>
            ${this.renderBottomNav()}
          </div>
        </div>
      `;
    } else {
      document.body.classList.remove("user-logged-in");
      app.innerHTML = `
        <div class="app-wrapper">
          ${this.renderHeader()}
          <main class="page-content" id="page-content">
            ${this.renderPage()}
          </main>
          ${this.renderBottomNav()}
        </div>
      `;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  private renderPage() {
    // Si non connecté, toujours afficher la page d'accueil publicitaire
    if (!this.isLoggedIn) {
      return this.renderHome();
    }
    
    // Si connecté, afficher la page demandée
    switch (this.currentPage) {
      case "home":         return this.renderRegionsPage();
      case "regions":      return this.renderRegionsPage();
      case "region-detail":return this.renderRegionDetail();
      case "favorites":    return this.renderFavorites();
      case "profile":      return this.renderProfile();
      case "search":       return this.renderSearch();
      case "all-recipes":  return this.renderAllRecipes();
      case "articles":     return this.renderComingSoon("Articles", "article", "Nos articles culinaires arrivent bientôt !");
      case "categories":   return this.renderComingSoon("Catégories", "grid_view", "Explorez nos catégories de plats.");
      case "about":        return this.renderComingSoon("A propos", "person", "Découvrez l'histoire de NLAMB-SARRE.");
      case "contact":      return this.renderComingSoon("Contact", "mail", "Contactez notre équipe.");
      case "faq":          return this.renderComingSoon("FAQ", "help_outline", "Réponses à vos questions fréquentes.");
      case "ebooks":       return this.renderComingSoon("Mes eBooks", "menu_book", "Vos livres de cuisine numériques.");
      case "youtube":      return this.renderComingSoon("Notre Chaîne YouTube", "play_circle", "Retrouvez tous nos tutoriels vidéo sur YouTube !");
      default:             return this.renderRegionsPage();
    }
  }

  // ── Coming Soon placeholder ────────────────────────────────────────────────────
  private renderComingSoon(title: string, icon: string, subtitle: string) {
    return `
      <div class="fade-in coming-soon-page">
        <div class="page-hero" style="background:linear-gradient(135deg,#1a1208,#2D6A4F)">
          <span class="material-symbols-outlined page-hero-icon">${icon}</span>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <div class="coming-soon-content">
          <div class="cs-card">
            <span class="material-symbols-outlined cs-icon">construction</span>
            <h2>Bientôt disponible</h2>
            <p>Cette section est en cours de développement. Revenez bientôt !</p>
            <button class="cs-back-btn" data-page="regions">
              <span class="material-symbols-outlined">arrow_back</span>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── All Recipes Page ────────────────────────────────────────────────────────
  private renderAllRecipes() {
    return `
      <div class="fade-in">
        <div class="page-hero" style="background:linear-gradient(135deg,#1a1208,#8B5E3C)">
          <span class="material-symbols-outlined page-hero-icon">restaurant_menu</span>
          <h1>Toutes les Recettes</h1>
          <p>${this.recipes.length} recettes authentiques du Cameroun</p>
        </div>
        <div class="recipes-grid" style="padding:2rem">
          ${this.recipes.map(r => this.renderRecipeCard(r)).join("")}
        </div>
      </div>
    `;
  }

  // ── Écran de bienvenue ──────────────────────────────────────────────────
  private renderWelcome() {
    return `
      <div class="welcome-screen">
        <div class="hero-welcome">
          <div class="hero-particles">
            ${Array.from({ length: 12 }, () => "<div class=\"particle\"></div>").join("")}
          </div>
          <div class="floating-icons">
            <div class="fi">🍽️</div><div class="fi">🥘</div>
            <div class="fi">🌶️</div><div class="fi">🍲</div>
            <div class="fi">🥗</div><div class="fi">🍖</div>
          </div>
          <div class="hero-content">
            <div class="hero-logo">
              <div class="logo-ring"></div>
              <span class="logo-emoji">🍽️</span>
            </div>
            <h1 class="hero-title">
              <span>Saveur du</span>
              <span class="title-highlight">Continent</span>
            </h1>
            <p class="hero-tagline">Découvrez l'art culinaire camerounais,<br>région par région</p>
            <div class="hero-stats">
              <div class="hs"><span class="hs-n">20</span><span class="hs-l">Recettes</span></div>
              <div class="hs-div"></div>
              <div class="hs"><span class="hs-n">11</span><span class="hs-l">Régions</span></div>
              <div class="hs-div"></div>
              <div class="hs"><span class="hs-n">3</span><span class="hs-l">Vidéos</span></div>
            </div>
          </div>
        </div>

        <div class="welcome-cards">
          <div class="wc">
            <div class="wc-icon" style="background:linear-gradient(135deg,#E8A030,#f5c842)">
              <span class="material-symbols-outlined">restaurant_menu</span>
            </div>
            <h3>Recettes Authentiques</h3>
            <p>Des recettes traditionnelles transmises de génération en génération</p>
          </div>
          <div class="wc">
            <div class="wc-icon" style="background:linear-gradient(135deg,#2D6A4F,#40916c)">
              <span class="material-symbols-outlined">explore</span>
            </div>
            <h3>11 Régions</h3>
            <p>Explorez les 11 régions du Cameroun et leurs spécialités uniques</p>
          </div>
          <div class="wc">
            <div class="wc-icon" style="background:linear-gradient(135deg,#1565C0,#1e88e5)">
              <span class="material-symbols-outlined">play_circle</span>
            </div>
            <h3>Vidéos Tutoriels</h3>
            <p>Apprenez à cuisiner en regardant nos vidéos de démonstration</p>
          </div>
        </div>

        <div class="welcome-cta">
          <h2>Prêt à cuisiner ?</h2>
          <p>Rejoignez notre communauté de passionnés de cuisine camerounaise</p>
          <div class="cta-btns">
            <button class="btn-cta-primary" data-action="register">✨ Commencer gratuitement</button>
            <button class="btn-cta-secondary" data-action="login">
              <span class="material-symbols-outlined">login</span>
              J'ai déjà un compte
            </button>
          </div>
        </div>

        <div class="testimonials">
          <div class="testimonial active">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Une application incroyable ! J'ai redécouvert la cuisine de mon enfance."</p>
            <div class="t-author"><div class="t-av">👩🏾</div><div><b>Marie K.</b><br><small>Douala</small></div></div>
          </div>
          <div class="testimonial">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Les recettes sont authentiques et très bien expliquées. Parfait !"</p>
            <div class="t-author"><div class="t-av">👨🏿</div><div><b>Paul N.</b><br><small>Yaoundé</small></div></div>
          </div>
          <div class="testimonial">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Mes enfants adorent cuisiner avec moi grâce à cette app. Merci !"</p>
            <div class="t-author"><div class="t-av">👩🏽</div><div><b>Fatou B.</b><br><small>Bafoussam</small></div></div>
          </div>
        </div>

        <footer class="welcome-footer">
          <p>© 2025 NLAMB-SARRE — Fait avec ❤️ au Cameroun</p>
        </footer>
      </div>
    `;
  }

  // ── Header (non connecté uniquement) ─────────────────────────────────────
  private renderHeader() {
    return `
      <header class="app-header">
        <div class="header-inner">
          <div class="header-brand">
            <div class="header-logo">🍽️</div>
            <div class="header-titles">
              <div class="header-site-name">NLAMB-SARRE</div>
              <div class="header-tagline">Cuisine africaine authentique</div>
            </div>
          </div>
          <div class="header-actions">
            ${this.currentPage === "home" ? `
            <div class="header-search">
              <span class="material-symbols-outlined">search</span>
              <input type="text" id="header-search-input" placeholder="Rechercher..." value="${this.searchQuery}">
            </div>
            ` : ""}
            <button class="btn-auth-header" data-action="login">
              <span class="material-symbols-outlined">login</span>
              Connexion
            </button>
            <button class="btn-auth-header btn-auth-primary" data-action="register">
              <span class="material-symbols-outlined">person_add</span>
              S'inscrire
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // ── Header Desktop (connecté) ─────────────────────────────────────────────
  private renderHeaderDesktop() {
    const initials = this.currentUser?.prenom?.charAt(0).toUpperCase() ?? "U";
    const name = this.currentUser?.prenom ?? "Utilisateur";
    const favCount = this.recipes.filter(r => r.isFavorite).length;
    return `
      <header class="desktop-header">
        <div class="dh-search">
          <span class="material-symbols-outlined dh-search-icon">search</span>
          <input
            type="text"
            id="dh-search-input"
            class="dh-search-input"
            placeholder="Rechercher une région, une recette..."
            value="${this.searchQuery}"
          >
        </div>
        <div class="dh-actions">
          <div class="dh-user" data-page="profile">
            <div class="dh-avatar">${initials}</div>
            <div class="dh-user-info">
              <span class="dh-greeting">Bonjour,</span>
              <strong class="dh-name">${name} !</strong>
            </div>
          </div>
          <div class="dh-action-group">
            <button class="dh-action-btn" title="Télécharger">
              <span class="material-symbols-outlined">download</span>
              <span class="dh-action-label">Télécharger</span>
            </button>
            <button class="dh-action-btn" data-page="favorites" title="Panier">
              <span class="dh-action-wrap">
                <span class="material-symbols-outlined">shopping_cart</span>
                ${favCount > 0 ? `<span class="dh-cart-badge">${favCount}</span>` : ""}
              </span>
              <span class="dh-action-label">Panier</span>
            </button>
            <button class="dh-action-btn" id="dh-menu-btn" title="Menu">
              <span class="material-symbols-outlined">menu</span>
              <span class="dh-action-label">Menu</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // ── Sidebar (connecté) ────────────────────────────────────────────────────
  private renderSidebar() {
    const mainNav = [
      { page: "regions",  icon: "home",           label: "Accueil" },
      { page: "all-recipes", icon: "restaurant_menu", label: "Recettes" },
      { page: "articles", icon: "article",         label: "Articles" },
      { page: "categories",icon: "grid_view",      label: "Catégories", arrow: true },
      { page: "about",    icon: "person",           label: "A propos" },
      { page: "contact",  icon: "mail",             label: "Contact" },
      { page: "faq",      icon: "help_outline",     label: "FAQ" },
      { page: "youtube",  icon: "play_circle",      label: "YouTube" },
    ];
    const secondaryNav = [
      { page: "ebooks",    icon: "menu_book", label: "Mes eBooks" },
      { page: "favorites", icon: "bookmark",  label: "Mes favoris" },
    ];
    const isActive = (page: string) => {
      if (page === "regions") return this.currentPage === "regions" || this.currentPage === "region-detail";
      return this.currentPage === page;
    };
    return `
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-logo-icon">🍽️</div>
          <div>
            <div class="sidebar-brand-name">NLAMB-SARRE</div>
            <div class="sidebar-brand-sub">Cuisine africaine authentique</div>
          </div>
        </div>
        <button class="sidebar-close" id="sidebar-close-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          ${mainNav.map(item => `
            <li class="sidebar-nav-item ${isActive(item.page) ? "sidebar-active" : ""}">
              <button class="sidebar-nav-btn" data-page="${item.page}">
                <span class="material-symbols-outlined sidebar-icon">${item.icon}</span>
                <span class="sidebar-label">${item.label}</span>
                ${item.arrow ? `<span class="material-symbols-outlined sidebar-arrow">chevron_right</span>` : ""}
              </button>
            </li>
          `).join("")}
        </ul>
        <div class="sidebar-separator"></div>
        <ul>
          ${secondaryNav.map(item => `
            <li class="sidebar-nav-item ${isActive(item.page) ? "sidebar-active" : ""}">
              <button class="sidebar-nav-btn" data-page="${item.page}">
                <span class="material-symbols-outlined sidebar-icon">${item.icon}</span>
                <span class="sidebar-label">${item.label}</span>
              </button>
            </li>
          `).join("")}
        </ul>
      </nav>
    `;
  }

  // ── Home ────────────────────────────────────────────────────────────────
  private renderHome() {
    // Version simplifiée avec HTML direct (compatible avec les objets simples)
    const recipes = this.recipes.slice(0, 8);
    
    return `
      <div class="catefood-home">
        <!-- Hero Section -->
        <section class="hero-catefood">
          <div class="hero-overlay"></div>
          <div class="hero-content-wrapper">
            <div class="hero-badge">
              <span class="material-symbols-outlined">restaurant</span>
              Cuisine Traditionnelle Camerounaise
            </div>
            <h1 class="hero-main-title">
              PLATS EXQUIS POUR<br>
              <span class="hero-highlight">OCCASIONS SPÉCIALES</span>
            </h1>
            <p class="hero-subtitle">
              Découvrez l'authenticité des saveurs camerounaises transmises de génération en génération
            </p>
            <button class="hero-cta-btn" onclick="document.querySelector('.featured-section')?.scrollIntoView({behavior:'smooth'})">
              <span class="material-symbols-outlined">explore</span>
              Explorer les Recettes
            </button>
          </div>
        </section>

        <!-- Video Showcase Carousel -->
        <section class="video-showcase-section">
          <div class="video-showcase-container">
            <div class="video-showcase-header">
              <span class="section-label">En Vidéo</span>
              <h2 class="section-title">DÉCOUVREZ NOS RECETTES</h2>
              <p class="section-description">
                Apprenez à cuisiner avec nos tutoriels vidéo pas à pas
              </p>
            </div>
            
            <div class="video-carousel-wrapper">
              <div class="video-carousel">
                <div class="video-slide active">
                  <video class="promo-video" autoplay muted loop playsinline>
                    <source src="/videos/ouest/ndjapche.mp4" type="video/mp4">
                  </video>
                  <div class="video-overlay-content">
                    <span class="video-region-badge">Région Ouest</span>
                    <h3 class="video-title">Njapché</h3>
                    <p class="video-description">Découvrez la préparation traditionnelle du Njapché</p>
                    <button class="video-cta-btn" data-recipe-id="8">
                      <span class="material-symbols-outlined">play_circle</span>
                      Voir la Recette
                    </button>
                  </div>
                </div>
                
                <div class="video-slide">
                  <video class="promo-video" muted loop playsinline>
                    <source src="/videos/extreme-nord/sauce foloré avec couscous.mp4" type="video/mp4">
                  </video>
                  <div class="video-overlay-content">
                    <span class="video-region-badge">Région Extrême-Nord</span>
                    <h3 class="video-title">Sauce Oseille (Foloré)</h3>
                    <p class="video-description">Une sauce délicieuse accompagnée de couscous</p>
                    <button class="video-cta-btn" data-recipe-id="10">
                      <span class="material-symbols-outlined">play_circle</span>
                      Voir la Recette
                    </button>
                  </div>
                </div>
                
                <div class="video-slide">
                  <video class="promo-video" muted loop playsinline>
                    <source src="/videos/sauce boko.mp4" type="video/mp4">
                  </video>
                  <div class="video-overlay-content">
                    <span class="video-region-badge">Région Nord</span>
                    <h3 class="video-title">Sauce Boko</h3>
                    <p class="video-description">La spécialité du Nord à base de gombo séché</p>
                    <button class="video-cta-btn" data-recipe-id="11">
                      <span class="material-symbols-outlined">play_circle</span>
                      Voir la Recette
                    </button>
                  </div>
                </div>
              </div>
              
              <button class="carousel-nav prev" onclick="window.carouselPrev?.()">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="carousel-nav next" onclick="window.carouselNext?.()">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
              
              <div class="carousel-indicators">
                <button class="indicator active" onclick="window.carouselGoTo?.(0)"></button>
                <button class="indicator" onclick="window.carouselGoTo?.(1)"></button>
                <button class="indicator" onclick="window.carouselGoTo?.(2)"></button>
              </div>
            </div>
          </div>
        </section>

        <!-- Featured Recipes -->
        <section class="featured-section">
          <div class="section-header-center">
            <span class="section-label">Nos Spécialités</span>
            <h2 class="section-title">RECETTES POPULAIRES</h2>
            <p class="section-description">
              Découvrez nos plats les plus appréciés, préparés avec passion et authenticité
            </p>
          </div>
          
          <div class="recipes-showcase-grid">
            ${recipes.map(r => `
              <div class="recipe-showcase-card" data-recipe-id="${r.id}">
                <div class="recipe-showcase-image">
                  <img src="${r.image}" alt="${r.title}" loading="lazy" />
                  <div class="recipe-showcase-overlay">
                    <button class="favorite-btn-showcase" data-recipe-id="${r.id}">
                      <span class="material-symbols-outlined">${r.isFavorite ? 'favorite' : 'favorite_border'}</span>
                    </button>
                    <button class="view-recipe-btn">
                      <span class="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                  <div class="recipe-showcase-badge">
                    <span class="material-symbols-outlined">schedule</span>
                    ${r.time}
                  </div>
                </div>
                <div class="recipe-showcase-content">
                  <span class="recipe-region-tag">${r.region}</span>
                  <h3 class="recipe-showcase-title">${r.title}</h3>
                  <p class="recipe-showcase-description">${r.description.substring(0, 100)}...</p>
                  <div class="recipe-showcase-meta">
                    <span class="difficulty-tag ${r.difficulty.toLowerCase()}">${r.difficulty}</span>
                    <span class="rating-display">
                      <span class="material-symbols-outlined">star</span>
                      4.8
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Regions -->
        <section class="regions-showcase">
          <div class="section-header-center">
            <span class="section-label">Explorez</span>
            <h2 class="section-title">NOS RÉGIONS CULINAIRES</h2>
            <p class="section-description">
              Chaque région du Cameroun possède ses propres trésors gastronomiques
            </p>
          </div>
          
          <div class="regions-masonry">
            ${ALL_REGIONS.slice(0, 6).map((region, index) => {
              const sizes = ['large', 'medium', 'medium', 'large', 'medium', 'medium'];
              const size = sizes[index % sizes.length];
              return `
                <div class="region-showcase-card region-${size}" data-region="${region.name}">
                  <div class="region-showcase-image">
                    <img src="${region.image}" alt="${region.name}" loading="lazy" />
                  </div>
                  <div class="region-showcase-overlay">
                    <div class="region-showcase-content">
                      <span class="region-emoji">${region.emoji}</span>
                      <h3 class="region-showcase-title">${region.name}</h3>
                      <p class="region-showcase-count">${region.specialties.length} spécialités</p>
                      <button class="region-explore-btn">
                        <span class="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="section-cta">
            <button class="cta-outline-btn" data-page="regions">
              Voir Toutes les Régions
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>

        <!-- Cameroon Map Section -->
        <section class="cameroon-map-section">
          <div class="section-header-center">
            <span class="section-label">Découvrez</span>
            <h2 class="section-title">LES 11 RÉGIONS DU CAMEROUN</h2>
            <p class="section-description">
              Explorez la diversité culinaire à travers les différentes régions du pays
            </p>
          </div>
          
          <div class="map-container">
            <div class="map-image-wrapper">
              <img src="/cameroon-map.png" alt="Carte des régions du Cameroun" class="cameroon-map-image" />
              <div class="map-decorative-border"></div>
            </div>
            
            <div class="map-overlay-info">
              <div class="map-info-card">
                <span class="material-symbols-outlined">location_on</span>
                <h4>11 Régions</h4>
                <p>Chacune avec ses spécialités uniques</p>
              </div>
              <div class="map-info-card">
                <span class="material-symbols-outlined">restaurant</span>
                <h4>${this.recipes.length}+ Recettes</h4>
                <p>Authentiques et traditionnelles</p>
              </div>
              <div class="map-info-card">
                <span class="material-symbols-outlined">diversity_3</span>
                <h4>250+ Ethnies</h4>
                <p>Une richesse culturelle inégalée</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer Info -->
        <section class="footer-info-section">
          <div class="footer-info-grid">
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">restaurant_menu</span>
              </div>
              <h3>Recettes Authentiques</h3>
              <p>Toutes nos recettes sont vérifiées par des chefs camerounais expérimentés</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">play_circle</span>
              </div>
              <h3>Vidéos Tutoriels</h3>
              <p>Apprenez pas à pas avec nos vidéos de démonstration détaillées</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">group</span>
              </div>
              <h3>Communauté Active</h3>
              <p>Partagez vos créations et découvrez celles des autres passionnés</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">favorite</span>
              </div>
              <h3>Favoris Personnalisés</h3>
              <p>Sauvegardez vos recettes préférées et créez vos propres collections</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // ── Regions Page ────────────────────────────────────────────────────────
  private renderRegionsPage() {
    return `
      <div class="regions-page fade-in">
        <div class="page-hero" style="background:linear-gradient(135deg,#1a1208,#2D6A4F)">
          <span class="material-symbols-outlined page-hero-icon">map</span>
          <h1>Régions du Cameroun</h1>
          <p>Découvrez les 11 régions et leurs spécialités culinaires authentiques</p>
        </div>
        <div class="regions-grid-full">
          ${ALL_REGIONS.map((region) => {
            const count = this.recipes.filter((r) => r.region === region.name).length;
            const countLabel = count > 0 ? `${count} recette${count > 1 ? "s" : ""}` : "Bientôt disponible";
            return `
              <div class="region-card-full" data-region="${region.name}">
                <div class="rcf-image" style="background-image:url('${p(region.image)}')">
                  <div class="rcf-overlay"></div>
                  <div class="rcf-top">
                    <span class="rcf-emoji">${region.emoji}</span>
                    <span class="rcf-count-badge">${countLabel}</span>
                  </div>
                </div>
                <div class="rcf-body" style="--region-color:${region.color}">
                  <h3>${region.name}</h3>
                  <p>${region.description}</p>
                  <div class="rcf-specialties">
                    ${region.specialties.map((s) => `<span class="rcf-chip">${s}</span>`).join("")}
                  </div>
                  <button class="rcf-btn">
                    <span class="material-symbols-outlined">explore</span>
                    Explorer
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // ── Region Detail ───────────────────────────────────────────────────────
  private renderRegionDetail() {
    const name = this.currentRegion ?? "";
    const region = ALL_REGIONS.find((r) => r.name === name);
    const regionRecipes = this.recipes.filter((r) => r.region === name);
    if (!region) return this.renderRegionsPage();

    return `
      <div class="region-detail fade-in">
        <div class="rd-hero" style="background-image:url('${p(region.image)}')">
          <div class="rd-overlay"></div>
          <div class="rd-hero-content">
            <button class="btn-back" data-page="regions">
              <span class="material-symbols-outlined">arrow_back</span>
              Toutes les régions
            </button>
            <div class="rd-info">
              <div class="rd-badge">
                <span class="material-symbols-outlined">location_on</span>
                ${region.emoji} Région du Cameroun
              </div>
              <h1>${name}</h1>
              <p>${region.description}</p>
              <div class="rd-chips">
                ${region.specialties.map((s) => `<span class="rd-chip">${s}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>

        <div class="rd-stats">
          <div class="rd-stat">
            <span class="material-symbols-outlined">menu_book</span>
            <span><strong>${regionRecipes.length}</strong> recette${regionRecipes.length !== 1 ? "s" : ""}</span>
          </div>
          <div class="rd-stat">
            <span class="material-symbols-outlined">play_circle</span>
            <span><strong>${regionRecipes.filter((r) => r.video).length}</strong> vidéo${regionRecipes.filter((r) => r.video).length !== 1 ? "s" : ""}</span>
          </div>
          <div class="rd-stat">
            <span class="material-symbols-outlined">verified</span>
            <span>Recettes authentiques</span>
          </div>
        </div>

        ${regionRecipes.length === 0
          ? `<div class="empty-state" style="margin:3rem auto">
              <span class="material-symbols-outlined">restaurant_menu</span>
              <h3>Recettes bientôt disponibles</h3>
              <p>Nous préparons les recettes authentiques de la région ${name}. Revenez bientôt !</p>
              <button class="btn-empty" data-page="regions">
                <span class="material-symbols-outlined">explore</span>
                Explorer d'autres régions
              </button>
             </div>`
          : `<div class="rd-recipes-header">
               <h2><span class="material-symbols-outlined">local_fire_department</span> Spécialités — ${name}</h2>
               <p>${regionRecipes.length} recette${regionRecipes.length > 1 ? "s" : ""} authentique${regionRecipes.length > 1 ? "s" : ""}</p>
             </div>
             <div class="recipes-grid rd-recipes-grid">
               ${regionRecipes.map((r) => this.renderRecipeCard(r)).join("")}
             </div>`
        }
      </div>
    `;
  }

  // ── Favorites ───────────────────────────────────────────────────────────
  private renderFavorites() {
    const favs = this.recipes.filter((r) => r.isFavorite);
    if (favs.length === 0) {
      return `
        <div class="empty-state fade-in" style="margin:6rem auto">
          <span class="material-symbols-outlined">favorite_border</span>
          <h3>Aucun favori pour le moment</h3>
          <p>Ajoutez des recettes à vos favoris en cliquant sur le coeur.</p>
          <button class="btn-empty" data-page="home">
            <span class="material-symbols-outlined">explore</span>
            Découvrir des recettes
          </button>
        </div>
      `;
    }
    return `
      <div class="fade-in">
        <div class="page-hero" style="background:linear-gradient(135deg,#7b1e35,#c62a47)">
          <span class="material-symbols-outlined page-hero-icon">favorite</span>
          <h1>Mes Favoris</h1>
          <p>${favs.length} recette${favs.length > 1 ? "s" : ""} sauvegardée${favs.length > 1 ? "s" : ""}</p>
        </div>
        <div class="recipes-grid" style="padding:2rem">
          ${favs.map((r) => this.renderRecipeCard(r)).join("")}
        </div>
      </div>
    `;
  }

  // ── Profile (Dark Theme — same as Regions page) ────────────────────────
  private renderProfile() {
    const name = `${this.currentUser?.prenom ?? "Utilisateur"} ${this.currentUser?.nom ?? ""}`;
    const email = this.currentUser?.email ?? "email@example.com";
    const region = this.currentUser?.region ?? "Non spécifiée";
    const initials = this.currentUser?.prenom?.charAt(0).toUpperCase() ?? "U";
    const favRecipes = this.recipes.filter((r) => r.isFavorite);
    const videoRecipes = this.recipes.filter((r) => r.video);
    const totalFavs = favRecipes.length;
    const totalVideos = videoRecipes.length;
    const allRecipesForGallery = this.recipes;

    return `
      <div class="profile-page fade-in">

        <!-- ── Hero profil — même style que la page Régions ── -->
        <div class="page-hero" style="background:linear-gradient(135deg,#1a1208,#2D6A4F)">
          <div class="profile-hero-inner">
            <div class="profile-hero-avatar">${initials}</div>
            <div class="profile-hero-info">
              <h1 class="profile-hero-name">${name}</h1>
              <p class="profile-hero-email">
                <span class="material-symbols-outlined">mail</span>${email}
              </p>
              <span class="profile-hero-region">
                <span class="material-symbols-outlined">location_on</span>${region}
              </span>
            </div>
          </div>
          <!-- Barre de stats identique aux autres pages -->
          <div class="profile-hero-stats">
            <div class="phs-item">
              <span class="phs-num">${allRecipesForGallery.length}</span>
              <span class="phs-lbl">Recettes</span>
            </div>
            <div class="phs-sep"></div>
            <div class="phs-item">
              <span class="phs-num">${totalFavs}</span>
              <span class="phs-lbl">Favoris</span>
            </div>
            <div class="phs-sep"></div>
            <div class="phs-item">
              <span class="phs-num">${totalVideos}</span>
              <span class="phs-lbl">Vidéos</span>
            </div>
            <div class="phs-sep"></div>
            <div class="phs-item">
              <span class="phs-num">10</span>
              <span class="phs-lbl">Régions</span>
            </div>
          </div>
        </div>

        <!-- ── Onglets de navigation ── -->
        <div class="pl-tabs">
          <button class="pl-tab active" data-pl-tab="gallery">
            <span class="material-symbols-outlined">grid_view</span>
            Tous les plats
          </button>
          <button class="pl-tab" data-pl-tab="favorites">
            <span class="material-symbols-outlined">favorite</span>
            Favoris
            ${totalFavs > 0 ? `<span class="pl-tab-badge">${totalFavs}</span>` : ''}
          </button>
          <button class="pl-tab" data-pl-tab="videos">
            <span class="material-symbols-outlined">play_circle</span>
            Vidéos
            ${totalVideos > 0 ? `<span class="pl-tab-badge">${totalVideos}</span>` : ''}
          </button>
        </div>

        <!-- ── GALERIE PLEIN ÉCRAN — Tous les plats ── -->
        <div class="pl-panel active" id="pl-panel-gallery">
          <div class="pl-gallery-header">
            <h2 class="pl-gallery-title">
              <span class="material-symbols-outlined">restaurant_menu</span>
              Découvrez nos plats
            </h2>
            <p class="pl-gallery-sub">${allRecipesForGallery.length} recettes authentiques du Cameroun</p>
          </div>
          <div class="pl-fullscreen-grid">
            ${allRecipesForGallery.map((r, i) => `
              <div class="pl-dish-card ${i === 0 || i === 3 ? 'pl-dish-wide' : ''}" data-recipe-id="${r.id}">
                <div class="pl-dish-img-wrap">
                  <img src="${p(r.image)}" alt="${r.title}" loading="lazy" />
                  <div class="pl-dish-overlay">
                    <button class="pl-dish-fav ${r.isFavorite ? 'active' : ''} rc-fav" data-recipe-id="${r.id}">
                      <span class="material-symbols-outlined">${r.isFavorite ? 'favorite' : 'favorite_border'}</span>
                    </button>
                    ${r.video ? `<div class="pl-dish-video-badge"><span class="material-symbols-outlined">play_circle</span></div>` : ''}
                  </div>
                </div>
                <div class="pl-dish-info">
                  <span class="pl-dish-region">${r.region}</span>
                  <h3 class="pl-dish-name">${r.title}</h3>
                  <div class="pl-dish-meta">
                    <span class="pl-dish-time">
                      <span class="material-symbols-outlined">schedule</span>${r.time}
                    </span>
                    <span class="pl-dish-diff pl-diff-${r.difficulty === 'Facile' ? 'easy' : r.difficulty === 'Difficile' ? 'hard' : 'med'}">${r.difficulty}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── PANEL Favoris ── -->
        <div class="pl-panel" id="pl-panel-favorites">
          <div class="pl-gallery-header">
            <h2 class="pl-gallery-title">
              <span class="material-symbols-outlined" style="color:#e53935">favorite</span>
              Mes Favoris
            </h2>
          </div>
          ${totalFavs === 0 ? `
            <div class="pl-empty-state">
              <span class="material-symbols-outlined">favorite_border</span>
              <p>Aucun favori pour l'instant</p>
              <button class="pl-explore-cta" data-page="regions">
                <span class="material-symbols-outlined">explore</span>
                Explorer les recettes
              </button>
            </div>
          ` : `
            <div class="pl-fullscreen-grid">
              ${favRecipes.map(r => `
                <div class="pl-dish-card" data-recipe-id="${r.id}">
                  <div class="pl-dish-img-wrap">
                    <img src="${p(r.image)}" alt="${r.title}" loading="lazy" />
                    <div class="pl-dish-overlay">
                      <button class="pl-dish-fav active rc-fav" data-recipe-id="${r.id}">
                        <span class="material-symbols-outlined">favorite</span>
                      </button>
                    </div>
                  </div>
                  <div class="pl-dish-info">
                    <span class="pl-dish-region">${r.region}</span>
                    <h3 class="pl-dish-name">${r.title}</h3>
                    <div class="pl-dish-meta">
                      <span class="pl-dish-time"><span class="material-symbols-outlined">schedule</span>${r.time}</span>
                      <span class="pl-dish-diff pl-diff-${r.difficulty === 'Facile' ? 'easy' : r.difficulty === 'Difficile' ? 'hard' : 'med'}">${r.difficulty}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- ── PANEL Vidéos ── -->
        <div class="pl-panel" id="pl-panel-videos">
          <div class="pl-gallery-header">
            <h2 class="pl-gallery-title">
              <span class="material-symbols-outlined" style="color:#c8793a">play_circle</span>
              Tutoriels Vidéo
            </h2>
          </div>
          <div class="pl-video-grid">
            ${videoRecipes.map(r => `
              <div class="pl-video-card" data-recipe-id="${r.id}">
                <div class="pl-vc-thumb">
                  <img src="${p(r.image)}" alt="${r.title}" loading="lazy" />
                  <div class="pl-vc-play">
                    <span class="material-symbols-outlined">play_circle_filled</span>
                  </div>
                </div>
                <div class="pl-vc-body">
                  <span class="pl-dish-region">${r.region}</span>
                  <h4>${r.title}</h4>
                  <span class="pl-dish-time"><span class="material-symbols-outlined">schedule</span>${r.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── Déconnexion ── -->
        <div class="pl-footer-actions">
          <button class="pl-logout-btn" id="profile-logout">
            <span class="material-symbols-outlined">logout</span>
            Se déconnecter
          </button>
        </div>

      </div>
    `;
  }

  // ── Search Page ─────────────────────────────────────────────────────────
  private renderSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    const allRecipes = this.recipes;
    const filtered = query.length > 0
      ? allRecipes.filter(r =>
          r.title.toLowerCase().includes(query) ||
          r.region.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.ingredients.some(i => i.toLowerCase().includes(query))
        )
      : [];
    const filteredRegions = query.length > 0
      ? ALL_REGIONS.filter(r =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.specialties.some(s => s.toLowerCase().includes(query))
        )
      : [];

    return `
      <div class="search-page fade-in">

        <!-- Hero Search -->
        <div class="search-hero">
          <div class="search-hero-bg"></div>
          <div class="search-hero-content">
            <h1 class="search-hero-title">
              <span class="material-symbols-outlined">search</span>
              Rechercher
            </h1>
            <p class="search-hero-sub">Trouvez un plat, une région ou un ingrédient</p>
            <div class="search-input-wrap">
              <span class="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                id="search-main-input"
                class="search-main-input"
                placeholder="Ex: Ndolé, Ouest, plantain..."
                value="${this.searchQuery}"
                autocomplete="off"
              />
              ${this.searchQuery ? `<button class="search-clear-btn" id="search-clear">
                <span class="material-symbols-outlined">close</span>
              </button>` : ''}
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="search-filters">
          <button class="sf-chip sf-chip-active" data-filter="all">Tout</button>
          <button class="sf-chip" data-filter="Facile">Facile</button>
          <button class="sf-chip" data-filter="Moyen">Moyen</button>
          <button class="sf-chip" data-filter="Difficile">Difficile</button>
          ${ALL_REGIONS.slice(0,5).map(r => `<button class="sf-chip" data-filter="${r.name}">${r.emoji} ${r.name}</button>`).join('')}
        </div>

        ${query.length === 0 ? `
          <!-- État initial: suggestions -->
          <div class="search-suggestions">
            <div class="ss-block">
              <div class="ss-header">
                <span class="material-symbols-outlined">local_fire_department</span>
                Régions Populaires
              </div>
              <div class="ss-regions">
                ${ALL_REGIONS.map(r => `
                  <div class="ss-region-chip" data-region="${r.name}">
                    <span class="ss-region-emoji">${r.emoji}</span>
                    <span>${r.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="ss-block">
              <div class="ss-header">
                <span class="material-symbols-outlined">trending_up</span>
                Toutes les Recettes (${allRecipes.length})
              </div>
              <div class="ss-recipe-list">
                ${allRecipes.slice(0, 8).map(r => `
                  <div class="ss-recipe-item" data-recipe-id="${r.id}">
                    <div class="ss-recipe-img">
                      <img src="${p(r.image)}" alt="${r.title}" loading="lazy" />
                    </div>
                    <div class="ss-recipe-body">
                      <h4>${r.title}</h4>
                      <p>
                        <span class="material-symbols-outlined">location_on</span>${r.region}
                        &nbsp;·&nbsp;
                        <span class="material-symbols-outlined">schedule</span>${r.time}
                      </p>
                    </div>
                    ${r.video ? `<span class="material-symbols-outlined ss-video-icon">play_circle</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : `
          <!-- Résultats de recherche -->
          <div class="search-results">
            ${filteredRegions.length === 0 && filtered.length === 0 ? `
              <div class="search-no-result">
                <span class="material-symbols-outlined">search_off</span>
                <h3>Aucun résultat pour « ${this.searchQuery} »</h3>
                <p>Essayez avec un autre nom de plat ou de région</p>
              </div>
            ` : ''}

            ${filteredRegions.length > 0 ? `
              <div class="sr-block">
                <div class="sr-block-title">
                  <span class="material-symbols-outlined">map</span>
                  Régions (${filteredRegions.length})
                </div>
                <div class="sr-regions">
                  ${filteredRegions.map(region => {
                    const count = this.recipes.filter(r => r.region === region.name).length;
                    return `
                      <div class="sr-region-card" data-region="${region.name}">
                        <div class="sr-rc-img" style="background-image:url('${p(region.image)}')">
                          <div class="sr-rc-overlay"></div>
                          <span class="sr-rc-emoji">${region.emoji}</span>
                        </div>
                        <div class="sr-rc-body">
                          <h4>${region.name}</h4>
                          <p>${count} recette${count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${filtered.length > 0 ? `
              <div class="sr-block">
                <div class="sr-block-title">
                  <span class="material-symbols-outlined">restaurant</span>
                  Plats (${filtered.length})
                </div>
                <div class="sr-recipes-grid">
                  ${filtered.map(r => `
                    <div class="sr-recipe-card" data-recipe-id="${r.id}">
                      <div class="sr-rc-img-wrap">
                        <img src="${p(r.image)}" alt="${r.title}" loading="lazy" />
                        ${r.video ? `<div class="sr-video-badge"><span class="material-symbols-outlined">play_circle</span></div>` : ''}
                        <button class="sr-fav-btn rc-fav ${r.isFavorite ? 'active' : ''}" data-recipe-id="${r.id}">
                          <span class="material-symbols-outlined">${r.isFavorite ? 'favorite' : 'favorite_border'}</span>
                        </button>
                      </div>
                      <div class="sr-recipe-body">
                        <div class="sr-recipe-region">
                          <span class="material-symbols-outlined">location_on</span>
                          ${r.region}
                        </div>
                        <h4>${r.title}</h4>
                        <div class="sr-recipe-meta">
                          <span><span class="material-symbols-outlined">schedule</span>${r.time}</span>
                          <span class="sr-diff sr-diff-${r.difficulty === 'Facile' ? 'easy' : r.difficulty === 'Difficile' ? 'hard' : 'med'}">${r.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>
    `;
  }

  // ── Recipe Card ─────────────────────────────────────────────────────────
  private renderRecipeCard(recipe: Recipe) {
    const diffClass = recipe.difficulty === "Facile" ? "diff-easy" : recipe.difficulty === "Difficile" ? "diff-hard" : "diff-medium";
    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="rc-image" style="background-image:url('${p(recipe.image)}')">
          ${recipe.video ? `<div class="rc-video-badge"><span class="material-symbols-outlined">play_circle</span></div>` : ""}
          <button class="rc-fav ${recipe.isFavorite ? "active" : ""}" data-recipe-id="${recipe.id}">
            <span class="material-symbols-outlined">${recipe.isFavorite ? "favorite" : "favorite_border"}</span>
          </button>
        </div>
        <div class="rc-body">
          <div class="rc-region">
            <span class="material-symbols-outlined">location_on</span>
            ${recipe.region}
          </div>
          <h3 class="rc-title">${recipe.title}</h3>
          <div class="rc-meta">
            <span class="rc-time">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.time}
            </span>
            <span class="rc-diff ${diffClass}">${recipe.difficulty}</span>
          </div>
        </div>
      </article>
    `;
  }

  // ── Region Card Small ───────────────────────────────────────────────────
  private renderRegionCardSmall(region: Region) {
    const count = this.recipes.filter((r) => r.region === region.name).length;
    return `
      <div class="region-card-sm" data-region="${region.name}" style="--region-color:${region.color}">
        <div class="rcs-image" style="background-image:url('${p(region.image)}')">
          <div class="rcs-overlay"></div>
        </div>
        <div class="rcs-body">
          <span class="rcs-emoji">${region.emoji}</span>
          <div>
            <h3>${region.name}</h3>
            <p>${count} recette${count !== 1 ? "s" : ""}</p>
          </div>
          <span class="material-symbols-outlined rcs-arrow">arrow_forward</span>
        </div>
      </div>
    `;
  }

  // ── Bottom Nav ──────────────────────────────────────────────────────────
  private renderBottomNav() {
    const items = this.isLoggedIn ? [
      { page: "regions", icon: "explore", label: "Régions" },
      { page: "search", icon: "search", label: "Recherche" },
      { page: "favorites", icon: "favorite", label: "Favoris" },
      { page: "profile", icon: "person", label: "Profil" },
    ] : [
      { page: "home", icon: "home", label: "Accueil" },
      { page: "regions", icon: "explore", label: "Régions" },
      { page: "search", icon: "search", label: "Recherche" },
      { page: "favorites", icon: "favorite", label: "Favoris" },
    ];
    
    return `
      <nav class="bottom-nav">
        ${items.map((item) => `
          <button class="nav-btn ${this.currentPage === item.page ? "active" : ""}" data-page="${item.page}">
            <span class="material-symbols-outlined">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join("")}
        ${this.isLoggedIn ? `
        <button class="nav-fab" id="nav-fab">
          <span class="material-symbols-outlined">add</span>
        </button>
        ` : ''}
      </nav>
    `;
  }

  // ── Recipe Modal ────────────────────────────────────────────────────────
  private showRecipeModal(id: number) {
    const recipe = this.recipes.find((r) => r.id === id);
    if (!recipe) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay recipe-modal-overlay";
    modal.innerHTML = `
      <div class="modal-box recipe-modal-box">
        <button class="modal-close-btn" id="modal-close">
          <span class="material-symbols-outlined">close</span>
        </button>

        <div class="rm-hero" id="rm-hero" style="background-image:url('${p(recipe.image)}')">
          <div class="rm-hero-overlay"></div>
          <button class="rm-fav-btn ${recipe.isFavorite ? "active" : ""}" data-recipe-id="${recipe.id}">
            <span class="material-symbols-outlined">${recipe.isFavorite ? "favorite" : "favorite_border"}</span>
          </button>
          <div class="rm-region-pill">
            <span class="material-symbols-outlined">location_on</span>
            ${recipe.region}
          </div>
        </div>

        ${recipe.extraImages && recipe.extraImages.length > 1 ? `
        <div class="rm-gallery">
          ${recipe.extraImages.map((img, i) => `
            <div class="rm-thumb ${i === 0 ? "active" : ""}"
                 style="background-image:url('${p(img)}')"
                 data-img="${p(img)}"></div>
          `).join("")}
        </div>
        ` : ""}

        <div class="rm-body">
          <h2 class="rm-title">${recipe.title}</h2>

          <div class="rm-meta-cards">
            <div class="rm-mc">
              <span class="material-symbols-outlined">schedule</span>
              <div><div class="rm-mc-label">Temps</div><div class="rm-mc-value">${recipe.time}</div></div>
            </div>
            <div class="rm-mc">
              <span class="material-symbols-outlined">signal_cellular_alt</span>
              <div><div class="rm-mc-label">Difficulté</div><div class="rm-mc-value">${recipe.difficulty}</div></div>
            </div>
            <div class="rm-mc">
              <span class="material-symbols-outlined">restaurant</span>
              <div><div class="rm-mc-label">Portions</div><div class="rm-mc-value">4 pers.</div></div>
            </div>
          </div>

          <div class="rm-section">
            <h3 class="rm-section-title">
              <span class="material-symbols-outlined">description</span>
              Description
            </h3>
            <p class="rm-desc">${recipe.description}</p>
          </div>

          ${recipe.video ? `
          <div class="rm-section">
            <h3 class="rm-section-title">
              <span class="material-symbols-outlined">play_circle</span>
              Vidéo de démonstration
            </h3>
            <div class="rm-video-wrapper">
              <video class="rm-video" controls preload="metadata" playsinline>
                <source src="${p(recipe.video)}" type="video/mp4">
                <p>Votre navigateur ne supporte pas la lecture vidéo HTML5.</p>
              </video>
            </div>
          </div>
          ` : ""}

          <div class="rm-section">
            <h3 class="rm-section-title">
              <span class="material-symbols-outlined">shopping_basket</span>
              Ingrédients (${recipe.ingredients.length})
            </h3>
            <ul class="rm-ingredients">
              ${recipe.ingredients.map((ing) => `
                <li><span class="ing-check">✓</span>${ing}</li>
              `).join("")}
            </ul>
          </div>

          <div class="rm-section">
            <h3 class="rm-section-title">
              <span class="material-symbols-outlined">menu_book</span>
              Étapes de préparation
            </h3>
            <ol class="rm-steps">
              ${recipe.steps.map((step, i) => `
                <li>
                  <span class="step-num">${i + 1}</span>
                  <p>${step}</p>
                </li>
              `).join("")}
            </ol>
          </div>

          <div class="rm-actions">
            <button class="rm-action-btn primary" id="rm-share">
              <span class="material-symbols-outlined">share</span>
              Partager
            </button>
            <button class="rm-action-btn secondary" id="rm-fav-save" data-recipe-id="${recipe.id}">
              <span class="material-symbols-outlined">${recipe.isFavorite ? "bookmark_added" : "bookmark_add"}</span>
              ${recipe.isFavorite ? "Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    setTimeout(() => modal.classList.add("visible"), 10);

    const closeModal = () => {
      modal.classList.remove("visible");
      document.body.style.overflow = "";
      setTimeout(() => { if (document.body.contains(modal)) document.body.removeChild(modal); }, 300);
    };

    modal.querySelector("#modal-close")!.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    modal.querySelectorAll(".rm-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const imgUrl = (thumb as HTMLElement).dataset.img;
        const hero = modal.querySelector("#rm-hero") as HTMLElement;
        if (hero && imgUrl) hero.style.backgroundImage = `url('${imgUrl}')`;
        modal.querySelectorAll(".rm-thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    modal.querySelector(".rm-fav-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const rid = parseInt((e.currentTarget as HTMLElement).dataset.recipeId ?? "0");
      this.toggleFavorite(rid);
      closeModal();
    });

    modal.querySelector("#rm-fav-save")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite(recipe.id);
    });

    modal.querySelector("#rm-share")?.addEventListener("click", () => {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: recipe.title, text: `Recette : ${recipe.title}`, url });
      } else {
        navigator.clipboard.writeText(url).catch(() => {});
        this.notify("Lien copié !", "success");
      }
    });
  }

  // ── Auth Modal ──────────────────────────────────────────────────────────
  private showAuthModal(mode: "login" | "register" = "login") {
    const modal = document.createElement("div");
    modal.className = "modal-overlay auth-modal-overlay";
    modal.innerHTML = `
      <div class="modal-box auth-modal-box">
        <button class="modal-close-btn" id="auth-close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="auth-logo">🍽️</div>
        <h2 class="auth-title">${mode === "login" ? "Se connecter" : "Créer un compte"}</h2>
        <div class="auth-tabs">
          <button class="auth-tab ${mode === "login" ? "active" : ""}" data-mode="login">Connexion</button>
          <button class="auth-tab ${mode === "register" ? "active" : ""}" data-mode="register">Inscription</button>
        </div>
        <div class="auth-form-wrap" id="auth-form-wrap">
          ${mode === "login" ? this.renderLoginForm() : this.renderRegisterForm()}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    setTimeout(() => modal.classList.add("visible"), 10);

    const closeModal = () => {
      modal.classList.remove("visible");
      document.body.style.overflow = "";
      setTimeout(() => { if (document.body.contains(modal)) document.body.removeChild(modal); }, 300);
    };

    modal.querySelector("#auth-close")!.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    modal.querySelectorAll(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const m = (tab as HTMLElement).dataset.mode as "login" | "register";
        modal.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const wrap = modal.querySelector("#auth-form-wrap")!;
        wrap.innerHTML = m === "login" ? this.renderLoginForm() : this.renderRegisterForm();
      });
    });

    modal.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const fd = new FormData(form);
      if (form.id === "login-form") this.login(fd, closeModal);
      else this.register(fd, closeModal);
    });
  }

  private renderLoginForm() {
    return `
      <form id="login-form" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required placeholder="votre@email.com">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="auth-submit">Se connecter</button>
        <div class="auth-error" id="auth-error"></div>
      </form>
    `;
  }

  private renderRegisterForm() {
    return `
      <form id="register-form" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" name="prenom" required placeholder="Prénom">
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input type="text" name="nom" required placeholder="Nom">
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required placeholder="votre@email.com">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" required placeholder="••••••••">
        </div>
        <div class="form-group">
          <label>Région d'origine</label>
          <select name="region" required>
            <option value="">Sélectionnez votre région</option>
            ${ALL_REGIONS.map((r) => `<option value="${r.name}">${r.name}</option>`).join("")}
          </select>
        </div>
        <button type="submit" class="auth-submit">S'inscrire</button>
        <div class="auth-error" id="auth-error"></div>
      </form>
    `;
  }

  // ── Add Recipe Modal ────────────────────────────────────────────────────
  private showAddRecipeModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay add-modal-overlay";
    modal.innerHTML = `
      <div class="modal-box add-modal-box">
        <button class="modal-close-btn" id="add-close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h2 class="add-modal-title">
          <span class="material-symbols-outlined">add_circle</span>
          Ajouter une recette
        </h2>
        <form id="add-recipe-form" class="add-form">
          <div class="form-group">
            <label>Nom de la recette *</label>
            <input type="text" name="title" required placeholder="Ex: Ndolé traditionnel">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Région *</label>
              <select name="region" required>
                <option value="">Choisir...</option>
                ${ALL_REGIONS.map((r) => `<option value="${r.name}">${r.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Difficulté *</label>
              <select name="difficulty" required>
                <option value="">Choisir...</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Temps de préparation *</label>
            <input type="text" name="time" required placeholder="Ex: 45 min">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" placeholder="Décrivez votre recette..."></textarea>
          </div>
          <div class="form-group">
            <label>Ingrédients (un par ligne)</label>
            <textarea name="ingredients" rows="4" placeholder="500g de ndolé&#10;2 oignons&#10;..."></textarea>
          </div>
          <div class="form-group">
            <label>Étapes (une par ligne)</label>
            <textarea name="steps" rows="5" placeholder="1. Laver les feuilles...&#10;2. Faire revenir..."></textarea>
          </div>
          <div class="add-form-actions">
            <button type="button" class="btn-cancel" id="add-cancel">Annuler</button>
            <button type="submit" class="btn-publish">
              <span class="material-symbols-outlined">check_circle</span>
              Publier
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    setTimeout(() => modal.classList.add("visible"), 10);

    const closeModal = () => {
      modal.classList.remove("visible");
      document.body.style.overflow = "";
      setTimeout(() => { if (document.body.contains(modal)) document.body.removeChild(modal); }, 300);
    };

    modal.querySelector("#add-close")!.addEventListener("click", closeModal);
    modal.querySelector("#add-cancel")!.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    modal.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const fd = new FormData(form);
      const newRecipe: Recipe = {
        id: Date.now(),
        title: fd.get("title") as string,
        region: fd.get("region") as string,
        time: fd.get("time") as string,
        difficulty: (fd.get("difficulty") as string) as "Facile" | "Moyen" | "Difficile",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
        isFavorite: false,
        description: (fd.get("description") as string) || "Recette partagée par la communauté.",
        ingredients: ((fd.get("ingredients") as string) || "").split("\n").filter(Boolean),
        steps: ((fd.get("steps") as string) || "").split("\n").filter(Boolean),
      };
      this.recipes.unshift(newRecipe);
      closeModal();
      this.notify("Recette ajoutée avec succès !", "success");
      this.render();
      this.bindEvents();
    });
  }

  // ── Event Binding ───────────────────────────────────────────────────────
  private boundClick: ((e: MouseEvent) => void) | null = null;

  private bindEvents() {
    if (this.boundClick) {
      document.removeEventListener("click", this.boundClick);
    }
    this.boundClick = (e: MouseEvent) => this.handleClick(e);
    document.addEventListener("click", this.boundClick);

    // Initialiser les event listeners de HomePage si on est sur la page d'accueil
    if (this.currentPage === 'home') {
      HomePage.setupEventListeners();
      // Initialiser le carousel vidéo
      setTimeout(() => {
        if (typeof (window as any).initVideoCarousel === 'function') {
          (window as any).initVideoCarousel();
        }
      }, 100);
    }

    if (!this.isLoggedIn) {
      this.startTestimonialRotation();
    }

    const searchInput = document.querySelector<HTMLInputElement>("#header-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        const content = document.getElementById("page-content");
        if (content) content.innerHTML = this.renderHome();
        const newInput = document.querySelector<HTMLInputElement>("#header-search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
        }
      });
    }
    const searchMainInput = document.querySelector<HTMLInputElement>("#search-main-input");
    if (searchMainInput) {
      searchMainInput.addEventListener("input", (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        const content = document.getElementById("page-content");
        if (content) content.innerHTML = this.renderSearch();
        const newInput = document.querySelector<HTMLInputElement>("#search-main-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
        }
        // Re-bind pour les nouveaux éléments renderés
        this.bindSearchEvents();
      });
    }
    this.bindSearchEvents();

    // ── Desktop search bar binding ──────────────────────────────────────────
    const dhSearchInput = document.querySelector<HTMLInputElement>("#dh-search-input");
    if (dhSearchInput) {
      dhSearchInput.addEventListener("input", (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
      });
      dhSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.currentPage = "search";
          this.render();
          this.bindEvents();
        }
      });
    }

    // ── Sidebar toggle (menu button) ────────────────────────────────────────
    const menuBtn = document.querySelector("#dh-menu-btn");
    if (menuBtn) {
      menuBtn.addEventListener("click", () => this.toggleSidebar());
    }

    // ── Sidebar close button ────────────────────────────────────────────────
    const sidebarCloseBtn = document.querySelector("#sidebar-close-btn");
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener("click", () => this.closeSidebar());
    }

    // ── Sidebar overlay click ───────────────────────────────────────────────
    const overlay = document.querySelector("#sidebar-overlay");
    if (overlay) {
      overlay.addEventListener("click", () => this.closeSidebar());
    }
  }

  // ── Sidebar helpers ──────────────────────────────────────────────────────
  private toggleSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar) return;
    const collapsed = sidebar.classList.toggle("sidebar-collapsed");
    if (overlay) overlay.classList.toggle("visible", !collapsed);
  }

  private closeSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.add("sidebar-collapsed");
    if (overlay) overlay.classList.remove("visible");
  }

  private bindSearchEvents() {
    // Clear button
    document.querySelector("#search-clear")?.addEventListener("click", () => {
      this.searchQuery = "";
      this.render();
      this.bindEvents();
      const inp = document.querySelector<HTMLInputElement>("#search-main-input");
      if (inp) inp.focus();
    });

    // Quick filter chips
    document.querySelectorAll(".sf-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const filter = (chip as HTMLElement).dataset.filter ?? "";
        if (filter === "all") {
          this.searchQuery = "";
        } else {
          this.searchQuery = filter;
        }
        const content = document.getElementById("page-content");
        if (content) content.innerHTML = this.renderSearch();
        const newInput = document.querySelector<HTMLInputElement>("#search-main-input");
        if (newInput) newInput.value = this.searchQuery;
        this.bindSearchEvents();
      });
    });
  }

  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    // Auth buttons in header (login/register)
    const authBtn = target.closest(".btn-auth-header") as HTMLElement;
    if (authBtn) {
      const action = authBtn.dataset.action as "login" | "register";
      if (action) {
        this.showAuthModal(action);
        return;
      }
    }

    // Welcome: auth actions
    if (!this.isLoggedIn) {
      const actionBtn = target.closest("[data-action]") as HTMLElement;
      if (actionBtn) {
        const action = actionBtn.dataset.action as "login" | "register";
        this.showAuthModal(action);
      }
      return;
    }

    // Logout (profile page button OR old header button)
    if (target.closest(".btn-logout") || target.closest("#profile-logout") || target.closest(".pl-logout-btn")) {
      this.logout();
      return;
    }

    // FAB
    if (target.closest("#nav-fab") || target.closest(".nav-fab")) {
      this.showAddRecipeModal();
      return;
    }

    // Navigation (data-page buttons) — skip internal cards
    const navBtn = target.closest("[data-page]") as HTMLElement;
    if (navBtn && !target.closest(".recipe-card") && !target.closest(".rd-recipes-grid")) {
      const page = navBtn.dataset.page!;
      // Pages inconnues → Coming Soon (déjà géré dans renderPage)
      if (page !== "region-detail") this.currentRegion = null;
      this.currentPage = page;
      this.render();
      this.bindEvents();
      return;
    }

    // Region card full
    const rcFull = target.closest(".region-card-full") as HTMLElement;
    if (rcFull) {
      this.currentRegion = rcFull.dataset.region!;
      this.currentPage = "region-detail";
      this.render();
      this.bindEvents();
      return;
    }

    // Region card small
    const rcSm = target.closest(".region-card-sm") as HTMLElement;
    if (rcSm) {
      this.currentRegion = rcSm.dataset.region!;
      this.currentPage = "region-detail";
      this.render();
      this.bindEvents();
      return;
    }

    // Back button
    const backBtn = target.closest(".btn-back") as HTMLElement;
    if (backBtn) {
      this.currentPage = backBtn.dataset.page ?? "regions";
      this.currentRegion = null;
      this.render();
      this.bindEvents();
      return;
    }

    // Empty/see-all buttons
    const emptyBtn = target.closest(".btn-empty") as HTMLElement;
    if (emptyBtn && emptyBtn.dataset.page) {
      this.currentPage = emptyBtn.dataset.page;
      this.render();
      this.bindEvents();
      return;
    }

    // Favorite toggle
    const favBtn = target.closest(".rc-fav, .favorite-btn-showcase") as HTMLElement;
    if (favBtn) {
      e.stopPropagation();
      this.toggleFavorite(parseInt(favBtn.dataset.recipeId ?? "0"));
      return;
    }

    // Recipe card → open modal (support both .recipe-card and .recipe-showcase-card)
    const recipeCard = target.closest(".recipe-card, .recipe-showcase-card") as HTMLElement;
    if (recipeCard && !target.closest(".rc-fav") && !target.closest(".favorite-btn-showcase")) {
      this.showRecipeModal(parseInt(recipeCard.dataset.recipeId ?? "0"));
      return;
    }
    
    // View recipe button in showcase
    const viewBtn = target.closest(".view-recipe-btn, .video-cta-btn") as HTMLElement;
    if (viewBtn) {
      const card = viewBtn.closest("[data-recipe-id]") as HTMLElement;
      if (card) {
        this.showRecipeModal(parseInt(card.dataset.recipeId ?? "0"));
        return;
      }
    }
    
    // Region showcase cards (from home page)
    const regionShowcase = target.closest(".region-showcase-card") as HTMLElement;
    if (regionShowcase) {
      this.currentRegion = regionShowcase.dataset.region!;
      this.currentPage = "region-detail";
      this.render();
      this.bindEvents();
      return;
    }

    // Search page: region suggestion chip → navigate to region detail
    const ssRegionChip = target.closest(".ss-region-chip") as HTMLElement;
    if (ssRegionChip) {
      this.currentRegion = ssRegionChip.dataset.region!;
      this.currentPage = "region-detail";
      this.render();
      this.bindEvents();
      return;
    }

    // Search page: suggestion recipe item → open modal
    const ssRecipeItem = target.closest(".ss-recipe-item") as HTMLElement;
    if (ssRecipeItem) {
      this.showRecipeModal(parseInt(ssRecipeItem.dataset.recipeId ?? "0"));
      return;
    }

    // Search page: result region card → navigate
    const srRegionCard = target.closest(".sr-region-card") as HTMLElement;
    if (srRegionCard) {
      this.currentRegion = srRegionCard.dataset.region!;
      this.currentPage = "region-detail";
      this.render();
      this.bindEvents();
      return;
    }

    // Search page: result recipe card → open modal
    const srRecipeCard = target.closest(".sr-recipe-card") as HTMLElement;
    if (srRecipeCard && !target.closest(".rc-fav") && !target.closest(".sr-fav-btn")) {
      this.showRecipeModal(parseInt(srRecipeCard.dataset.recipeId ?? "0"));
      return;
    }

    // Profile page: favorite recipe card → open modal
    const ppRecipeCard = target.closest(".pp-recipe-card") as HTMLElement;
    if (ppRecipeCard) {
      this.showRecipeModal(parseInt(ppRecipeCard.dataset.recipeId ?? "0"));
      return;
    }

    // Profile page: video item / play button → open modal
    const ppVideoItem = target.closest(".pp-video-item, .pp-video-play-btn") as HTMLElement;
    if (ppVideoItem) {
      const rid = ppVideoItem.dataset.recipeId ?? ppVideoItem.closest("[data-recipe-id]")?.getAttribute("data-recipe-id") ?? "0";
      this.showRecipeModal(parseInt(rid));
      return;
    }

    // Profile page: explore button → navigate to regions
    const ppExploreBtn = target.closest(".pp-explore-btn") as HTMLElement;
    if (ppExploreBtn && ppExploreBtn.dataset.page) {
      this.currentPage = ppExploreBtn.dataset.page;
      this.render();
      this.bindEvents();
      return;
    }
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  private login(fd: FormData, closeModal: () => void) {
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    if (!email || !password) {
      const err = document.querySelector<HTMLElement>("#auth-error");
      if (err) { err.textContent = "Veuillez remplir tous les champs."; err.style.display = "block"; }
      return;
    }
    this.currentUser = { id: 1, email, prenom: email.split("@")[0], nom: "", region: "Centre" };
    this.isLoggedIn = true;
    this.saveSession();
    closeModal();
    this.notify(`Bienvenue ${this.currentUser.prenom} ! 🎉`, "success");
    this.render();
    this.bindEvents();
  }

  private register(fd: FormData, closeModal: () => void) {
    const prenom = fd.get("prenom") as string;
    const nom = fd.get("nom") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const region = fd.get("region") as string;
    if (!prenom || !nom || !email || !password || !region) {
      const err = document.querySelector<HTMLElement>("#auth-error");
      if (err) { err.textContent = "Veuillez remplir tous les champs."; err.style.display = "block"; }
      return;
    }
    this.currentUser = { id: Date.now(), email, prenom, nom, region };
    this.isLoggedIn = true;
    this.saveSession();
    closeModal();
    this.notify(`Bienvenue ${prenom} ! 🎉`, "success");
    this.render();
    this.bindEvents();
  }

  private logout() {
    if (this.boundClick) document.removeEventListener("click", this.boundClick);
    this.currentUser = null;
    this.isLoggedIn = false;
    localStorage.removeItem("cuisine-user");
    this.notify("Déconnexion réussie.", "info");
    this.render();
    this.bindEvents();
  }

  private loadSession() {
    const saved = localStorage.getItem("cuisine-user");
    if (saved) { this.currentUser = JSON.parse(saved); this.isLoggedIn = true; }
  }

  private saveSession() {
    localStorage.setItem("cuisine-user", JSON.stringify(this.currentUser));
  }

  // ── Utilities ───────────────────────────────────────────────────────────
  private toggleFavorite(id: number) {
    const recipe = this.recipes.find((r) => r.id === id);
    if (!recipe) return;
    recipe.isFavorite = !recipe.isFavorite;
    this.notify(
      recipe.isFavorite ? "❤️ Ajouté aux favoris !" : "Retiré des favoris",
      recipe.isFavorite ? "success" : "info"
    );
    document.querySelectorAll<HTMLElement>(`[data-recipe-id="${id}"].rc-fav`).forEach((el) => {
      el.classList.toggle("active", recipe.isFavorite);
      const icon = el.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = recipe.isFavorite ? "favorite" : "favorite_border";
    });
  }

  private notify(message: string, type: "success" | "error" | "info" = "info") {
    const n = document.createElement("div");
    n.className = `toast toast-${type}`;
    n.innerHTML = `
      <span class="material-symbols-outlined">
        ${type === "success" ? "check_circle" : type === "error" ? "error" : "info"}
      </span>
      <span>${message}</span>
    `;
    document.body.appendChild(n);
    setTimeout(() => n.classList.add("show"), 10);
    setTimeout(() => {
      n.classList.remove("show");
      setTimeout(() => { if (document.body.contains(n)) document.body.removeChild(n); }, 400);
    }, 3000);
  }

  private startTestimonialRotation() {
    const items = document.querySelectorAll(".testimonial");
    if (items.length <= 1) return;
    let i = 0;
    setInterval(() => {
      items[i].classList.remove("active");
      i = (i + 1) % items.length;
      items[i].classList.add("active");
    }, 4000);
  }
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────
function boot() { new CuisineApp(); }
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
