import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">🚚</div>
            <div class="brand">
              <h1 class="brand-name">COOTRANSTAME</h1>
              <p class="brand-subtitle">Sistema de Rutas</p>
            </div>
          </div>
          <nav class="nav">
            <a 
              routerLink="/rutas" 
              routerLinkActive="nav-active"
              class="nav-link"
            >
              <span class="nav-icon">🛣️</span>
              Gestión de Rutas
            </a>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-info">
            <div class="footer-icon">🚛</div>
            <div>
              <p class="footer-title">COOTRANSTAME</p>
              <p class="footer-desc">Cooperativa de Transportadores del Meta</p>
            </div>
          </div>
          <div class="footer-tech">
            <p>© 2025 COOTRANSTAME</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      display: flex;
      flex-direction: column;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header {
      background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.3;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
      position: relative;
      z-index: 2;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .brand-name {
      color: white;
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .brand-subtitle {
      color: rgba(251, 191, 36, 0.9);
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .nav-icon {
      font-size: 1.2rem;
    }

    .nav-link:hover {
      background: rgba(251, 191, 36, 0.2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
    }

    .nav-active {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #1e40af;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
    }

    .main {
      flex: 1;
    }

    .footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      border-top: 3px solid #fbbf24;
      padding: 32px 0;
      position: relative;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M20 20.5V18H14v-2h6V9.5a.5.5 0 1 1 1 0V16h6v2h-6v2.5a.5.5 0 1 1-1 0z'/%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.3;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .footer-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footer-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
    }

    .footer-title {
      color: #fbbf24;
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }

    .footer-desc {
      color: #d1d5db;
      font-size: 0.875rem;
      margin: 0;
    }

    .footer-tech {
      color: #9ca3af;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .footer-tech p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 20px;
        height: 70px;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        height: auto;
      }

      .logo-section {
        gap: 12px;
      }

      .logo-icon {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }

      .brand-name {
        font-size: 1.5rem;
      }

      .footer-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .footer-info {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class AppComponent {
  title = 'COOTRANSTAME - Sistema de Rutas';
}