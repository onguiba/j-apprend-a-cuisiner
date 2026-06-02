export class ApiService {
  private static instance: ApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la requête');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // ========== RECETTES ==========

  public async getAllRecipes(params?: {
    region?: string;
    search?: string;
    difficulty?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.region) queryParams.append('region', params.region);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);

    const query = queryParams.toString();
    return this.request(`/recipes${query ? `?${query}` : ''}`);
  }

  public async getRecipeById(id: number): Promise<any> {
    return this.request(`/recipes/${id}`);
  }

  public async getRecipesByRegion(regionId: number): Promise<any> {
    return this.request(`/recipes/region/${regionId}`);
  }

  public async createRecipe(recipe: any): Promise<any> {
    return this.request('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
  }

  public async updateRecipe(id: number, recipe: any): Promise<any> {
    return this.request(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipe),
    });
  }

  public async deleteRecipe(id: number): Promise<any> {
    return this.request(`/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== RÉGIONS ==========

  public async getAllRegions(): Promise<any> {
    return this.request('/regions');
  }

  public async getRegionById(id: number): Promise<any> {
    return this.request(`/regions/${id}`);
  }

  public async createRegion(region: any): Promise<any> {
    return this.request('/regions', {
      method: 'POST',
      body: JSON.stringify(region),
    });
  }

  public async updateRegion(id: number, region: any): Promise<any> {
    return this.request(`/regions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(region),
    });
  }

  public async deleteRegion(id: number): Promise<any> {
    return this.request(`/regions/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== RECHERCHE ==========

  public async searchRecipes(query: string): Promise<any> {
    return this.request(`/recipes?search=${encodeURIComponent(query)}`);
  }

  // ========== STATISTIQUES ==========

  public async getStatistics(): Promise<any> {
    try {
      const [recipes, regions] = await Promise.all([
        this.getAllRecipes(),
        this.getAllRegions(),
      ]);

      return {
        totalRecipes: recipes.count || 0,
        totalRegions: regions.count || 0,
        recipesByRegion: regions.data?.reduce((acc: any, region: any) => {
          acc[region.nom] = region.nombre_recettes || 0;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error('Erreur getStatistics:', error);
      throw error;
    }
  }

  // ========== AUTHENTIFICATION ==========

  public async register(userData: {
    nom: string;
    email: string;
    password: string;
  }): Promise<any> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  public async login(credentials: {
    email: string;
    password: string;
  }): Promise<any> {
    const response: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Sauvegarder le token et l'utilisateur
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  public async getProfile(): Promise<any> {
    return this.requestWithAuth('/auth/profile');
  }

  public async updateProfile(data: any): Promise<any> {
    return this.requestWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> {
    return this.requestWithAuth('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Récupération de mot de passe
  public static async forgotPassword(email: string): Promise<any> {
    const instance = ApiService.getInstance();
    return instance.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  public static async resetPassword(token: string, newPassword: string): Promise<any> {
    const instance = ApiService.getInstance();
    return instance.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  public static async verifyResetToken(token: string): Promise<boolean> {
    const instance = ApiService.getInstance();
    try {
      const response: any = await instance.request(`/auth/verify-reset-token/${token}`);
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // ========== ADMINISTRATION ==========

  public async getAdminDashboard(): Promise<any> {
    return this.requestWithAuth('/admin/dashboard');
  }

  public async getAdminUsers(): Promise<any> {
    return this.requestWithAuth('/admin/users');
  }

  public async getAdminUserById(id: number): Promise<any> {
    return this.requestWithAuth(`/admin/users/${id}`);
  }

  public async createAdminUser(userData: any): Promise<any> {
    return this.requestWithAuth('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  public async updateAdminUser(id: number, userData: any): Promise<any> {
    return this.requestWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  public async deleteAdminUser(id: number): Promise<any> {
    return this.requestWithAuth(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  public async promoteToAdmin(id: number): Promise<any> {
    return this.requestWithAuth(`/admin/users/${id}/promote`, {
      method: 'PUT',
    });
  }

  public async demoteToUser(id: number): Promise<any> {
    return this.requestWithAuth(`/admin/users/${id}/demote`, {
      method: 'PUT',
    });
  }

  public async getAdminComments(): Promise<any> {
    return this.requestWithAuth('/admin/comments');
  }

  public async deleteAdminComment(id: number): Promise<any> {
    return this.requestWithAuth(`/admin/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthode privée pour les requêtes authentifiées
  private async requestWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Non authentifié');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    return this.request(endpoint, config);
  }
}
