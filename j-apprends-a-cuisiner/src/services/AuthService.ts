import { User } from '../models/User';
import { Administrator } from '../models/Administrator';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  regionOrigine: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private users: User[] = [];

  private constructor() {
    this.initializeUsers();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeUsers(): void {
    // Créer quelques utilisateurs de test
    this.users = [
      new User(1, 'Kouam', 'Marie', 'marie.kouam@email.com', 'password123', 'Ouest'),
      new User(2, 'Mballa', 'Jean', 'jean.mballa@email.com', 'password123', 'Centre'),
      new Administrator(3, 'Admin', 'Super', 'admin@cuisine-cameroun.com', 'admin123', 'Centre', 'super_admin')
    ];
  }

  // Cas d'usage: S'inscrire
  public async sInscrire(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = this.users.find(user => user.getEmail() === userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Un compte avec cet email existe déjà'
        };
      }

      // Créer le nouvel utilisateur
      const newUser = new User(
        this.users.length + 1,
        userData.nom,
        userData.prenom,
        userData.email,
        userData.motDePasse,
        userData.regionOrigine
      );

      // Appeler la méthode sInscrire du modèle
      const inscriptionSuccess = newUser.sInscrire();
      
      if (inscriptionSuccess) {
        this.users.push(newUser);
        this.currentUser = newUser;
        
        return {
          success: true,
          message: 'Inscription réussie !',
          user: newUser
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'inscription'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur technique lors de l\'inscription'
      };
    }
  }

  // Cas d'usage: Se connecter
  public async seConnecter(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const user = this.users.find(u => 
        u.getEmail() === credentials.email
      );

      if (!user) {
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        };
      }

      // Dans un vrai système, on vérifierait le hash du mot de passe
      // Ici on simule la vérification
      const loginSuccess = user.seConnecter();
      
      if (loginSuccess) {
        this.currentUser = user;
        return {
          success: true,
          message: 'Connexion réussie !',
          user: user
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de la connexion'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur technique lors de la connexion'
      };
    }
  }

  // Cas d'usage: Se déconnecter
  public seDeconnecter(): void {
    if (this.currentUser) {
      this.currentUser.seDeconnecter();
      this.currentUser = null;
    }
  }

  // Getters
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  public isAdmin(): boolean {
    return this.currentUser instanceof Administrator;
  }

  public getAllUsers(): User[] {
    return this.users;
  }

  // Méthodes utilitaires
  public getUserById(id: number): User | undefined {
    return this.users.find(user => user.getIdUtilisateur() === id);
  }

  public updateUserProfile(userData: Partial<RegisterData>): boolean {
    if (!this.currentUser) return false;

    try {
      // Mise à jour des données utilisateur
      // Dans un vrai système, ceci ferait appel à une API
      console.log('Mise à jour du profil utilisateur:', userData);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  }

  // Simulation de la persistance (localStorage)
  public saveToStorage(): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify({
        id: this.currentUser?.getIdUtilisateur(),
        email: this.currentUser?.getEmail()
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  public loadFromStorage(): void {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const user = this.getUserById(userData.id);
        if (user) {
          this.currentUser = user;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  }
}