import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header>
        <h1>Sistema de Adquisiciones</h1>
        <nav class="main-nav">
          <ul>
            <li><a routerLink="/adquisiciones" routerLinkActive="active">Adquisiciones</a></li>
            <li><a routerLink="/unidades" routerLinkActive="active">Unidades Administrativas</a></li>
            <li><a routerLink="/proveedores" routerLinkActive="active">Proveedores</a></li>
            <li><a routerLink="/historial" routerLinkActive="active">Historial</a></li>
            <li><a routerLink="/documentos" routerLinkActive="active">Documentos</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <router-outlet />
      </main>
      <footer>
        <p>&copy; 2025 Sistema de Adquisiciones</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: var(--color-background);
      display: flex;
      flex-direction: column;
    }
    header {
      background-color: var(--color-primary);
      color: var(--color-background);
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: var(--color-primary-dark);
      text-align: center;
      margin: 0 0 20px 0;
    }
    .main-nav {
      display: flex;
      justify-content: center;
    }
    .main-nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .main-nav li a {
      display: block;
      padding: 10px 20px;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .main-nav li a:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .main-nav li a.active {
      background-color: rgba(255, 255, 255, 0.3);
      font-weight: 500;
    }
    main {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      flex: 1;
    }
    footer {
      background-color: var(--color-primary-dark, #1a1a2e);
      color: white;
      text-align: center;
      padding: 15px;
      margin-top: auto;
    }
  `]
})
export class AppComponent {
  title = 'Sistema de Adquisiciones';
}