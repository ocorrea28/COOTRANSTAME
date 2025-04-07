import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [ngClass]="{'card-hover': hover}">
      <div class="card-header" *ngIf="title || headerSlot">
        <h3 *ngIf="title">{{ title }}</h3>
        <ng-content select="[header]" *ngIf="headerSlot"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="footerSlot">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      padding: 15px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 8px rgba(40, 57, 89, 0.1);
      margin-bottom: 15px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 57, 89, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    .card-header h3 {
      margin: 0;
      color: var(--color-primary);
      font-weight: 500;
    }

    .card-body {
      margin-bottom: 10px;
    }

    .card-footer {
      padding-top: 10px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
  @Input() hover: boolean = true;
  @Input() headerSlot: boolean = false;
  @Input() footerSlot: boolean = false;
}
