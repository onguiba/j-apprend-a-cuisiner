export class Subscription {
  private idAbonnement: number;
  private idUtilisateur: number;
  private plan: 'free' | 'premium' | 'pro';
  private dateDebut: Date;
  private dateFin?: Date;
  private renouvellementAuto: boolean;
  private methodePaiement?: string;
  private montant: number;
  private devise: string;
  private statut: 'active' | 'cancelled' | 'expired' | 'pending';
  private dateCreation: Date;
  private dateModification: Date;

  constructor(
    idAbonnement: number,
    idUtilisateur: number,
    plan: 'free' | 'premium' | 'pro',
    dateDebut: Date,
    montant: number = 0,
    statut: 'active' | 'cancelled' | 'expired' | 'pending' = 'active',
    dateFin?: Date,
    renouvellementAuto: boolean = true,
    methodePaiement?: string,
    devise: string = 'XAF',
    dateCreation: Date = new Date(),
    dateModification: Date = new Date()
  ) {
    this.idAbonnement = idAbonnement;
    this.idUtilisateur = idUtilisateur;
    this.plan = plan;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.renouvellementAuto = renouvellementAuto;
    this.methodePaiement = methodePaiement;
    this.montant = montant;
    this.devise = devise;
    this.statut = statut;
    this.dateCreation = dateCreation;
    this.dateModification = dateModification;
  }

  // Getters
  public getIdAbonnement(): number {
    return this.idAbonnement;
  }

  public getIdUtilisateur(): number {
    return this.idUtilisateur;
  }

  public getPlan(): 'free' | 'premium' | 'pro' {
    return this.plan;
  }

  public getDateDebut(): Date {
    return this.dateDebut;
  }

  public getDateFin(): Date | undefined {
    return this.dateFin;
  }

  public getRenouvellementAuto(): boolean {
    return this.renouvellementAuto;
  }

  public getMethodePaiement(): string | undefined {
    return this.methodePaiement;
  }

  public getMontant(): number {
    return this.montant;
  }

  public getDevise(): string {
    return this.devise;
  }

  public getStatut(): 'active' | 'cancelled' | 'expired' | 'pending' {
    return this.statut;
  }

  public getDateCreation(): Date {
    return this.dateCreation;
  }

  public getDateModification(): Date {
    return this.dateModification;
  }

  // Setters
  public setPlan(plan: 'free' | 'premium' | 'pro'): void {
    this.plan = plan;
  }

  public setStatut(statut: 'active' | 'cancelled' | 'expired' | 'pending'): void {
    this.statut = statut;
  }

  public setRenouvellementAuto(renouvellement: boolean): void {
    this.renouvellementAuto = renouvellement;
  }

  // Méthodes utilitaires
  public isActive(): boolean {
    return this.statut === 'active' && (!this.dateFin || this.dateFin > new Date());
  }

  public isExpired(): boolean {
    return this.dateFin ? this.dateFin < new Date() : false;
  }

  public getDaysRemaining(): number {
    if (!this.dateFin) return -1;
    const now = new Date();
    const diff = this.dateFin.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  public getPlanLabel(): string {
    const labels = {
      free: 'Gratuit',
      premium: 'Premium (1 mois)',
      pro: 'Pro (1 an)'
    };
    return labels[this.plan];
  }

  public getPlanPrice(): number {
    const prices = {
      free: 0,
      premium: 4990,
      pro: 19990
    };
    return prices[this.plan];
  }

  public getFormattedPrice(): string {
    const price = this.getPlanPrice();
    return `${(price / 100).toFixed(2)} ${this.devise}`;
  }
}
