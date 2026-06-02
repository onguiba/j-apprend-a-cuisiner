export type Route = 'home' | 'regions' | 'favorites' | 'profile';

export class Router {
  private currentRoute: Route = 'home';
  private routes: Map<Route, () => string> = new Map();
  private onRouteChange: (route: Route) => void;

  constructor(onRouteChange: (route: Route) => void) {
    this.onRouteChange = onRouteChange;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Les routes seront définies par l'application principale
  }

  public registerRoute(route: Route, renderFunction: () => string): void {
    this.routes.set(route, renderFunction);
  }

  public navigate(route: Route): void {
    if (this.routes.has(route)) {
      this.currentRoute = route;
      this.onRouteChange(route);
    }
  }

  public getCurrentRoute(): Route {
    return this.currentRoute;
  }

  public render(): string {
    const renderFunction = this.routes.get(this.currentRoute);
    return renderFunction ? renderFunction() : '';
  }
}