import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="app-logo-container">
       
      </div>
      <div class="page-header">
        <h2 class="page-title">{{ title }}</h2>
        <div class="page-actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
      <div class="page-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .app-logo-container {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;
    }
    
    .app-logo {
      max-height: 60px;
      max-width: 250px;
      object-fit: contain;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(40, 57, 89, 0.1);
    }
    
    .page-title {
      margin: 0;
      color: #283959;
      font-weight: 600;
      font-size: 1.5rem;
    }
    
    .page-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .page-content {
      flex: 1;
      width: 100%;
    }
    
    /* Modificaciones para layout de ancho completo */
    :host.full-width-layout .page-container {
      padding: 10px;
      max-width: 100%;
    }
    
    :host.full-width-layout .page-content {
      max-width: 100%;
    }
  `]
})
export class PageLayoutComponent {
  @Input() title: string = '';
}
