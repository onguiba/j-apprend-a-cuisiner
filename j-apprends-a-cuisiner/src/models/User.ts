export class User {
  private idUtilisateur: number;
  private nom: string;
  private prenom: string;
  private email: string;
  private motDePasse: string;
  private regionOrigine: string;
  private dateInscription: Date;

  constructor(
    idUtilisateur: number,
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string,
    regionOrigine: string,
    dateInscription: Date = new Date()
  ) {
    this.idUtilisateur = idUtilisateur;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.motDePasse = motDePasse;
    this.regionOrigine = regionOrigine;
    this.dateInscription = dateInscription;
  }

  // Getters
  public getIdUtilisateur(): number {
    return this.idUtilisateur;
  }

  public getNom(): string {
    return this.nom;
  }

  public getPrenom(): string {
    return this.prenom;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRegionOrigine(): string {
    return this.regionOrigine;
  }

  public getDateInscription(): Date {
    return this.dateInscription;
  }

  public getNomComplet(): string {
    return `${this.prenom} ${this.nom}`;
  }

  // Méthodes
  public sInscrire(): boolean {
    // Logique d'inscription
    console.log(`Inscription de ${this.getNomComplet()}`);
    return true;
  }

  public seConnecter(): boolean {
    // Logique de connexion
    console.log(`Connexion de ${this.getNomComplet()}`);
    return true;
  }

  public seDeconnecter(): void {
    // Logique de déconnexion
    console.log(`Déconnexion de ${this.getNomComplet()}`);
  }

  public consulterRecettes(): void {
    // Logique pour consulter les recettes
    console.log(`${this.getNomComplet()} consulte les recettes`);
  }

  public rechercherRecette(region: string): void {
    // Logique de recherche par région
    console.log(`Recherche de recettes pour la région: ${region}`);
  }

  public voirDetailsRecette(idRecette: number): void {
    // Logique pour voir les détails d'une recette
    console.log(`Consultation des détails de la recette ${idRecette}`);
  }
}