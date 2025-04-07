import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type" 
      [class]="getButtonClass()"
      [disabled]="disabled"
      (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      text-align: center;
      margin: 0 auto;
      width: 100%;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background-color: #283959;
      color: #F2F2F2;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #1a2940; /* versión más oscura */
      box-shadow: 0 2px 4px rgba(40, 57, 89, 0.2);
    }
    
    .btn-secondary {
      background-color: #5A7CBF;
      color: #F2F2F2;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: #4c69a2; /* versión más oscura */
      box-shadow: 0 2px 4px rgba(90, 124, 191, 0.2);
    }
    
    .btn-accent {
      background-color: #8DF2F2;
      color: #283959;
    }
    
    .btn-accent:hover:not(:disabled) {
      background-color: #79e0e0; /* versión más oscura */
      box-shadow: 0 2px 4px rgba(141, 242, 242, 0.2);
    }
    
    .btn-highlight {
      background-color: #04D9B2;
      color: #F2F2F2;
    }
    
    .btn-highlight:hover:not(:disabled) {
      background-color: #03b295; /* versión más oscura */
      box-shadow: 0 2px 4px rgba(4, 217, 178, 0.2);
    }
    
    .btn-danger {
      background-color: #e74c3c;
      color: #F2F2F2;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #c0392b; /* versión más oscura */
      box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
    }
    
    .btn-outline {
      background-color: transparent;
      color: #283959;
      border: 1px solid #283959;
    }
    
    .btn-outline:hover:not(:disabled) {
      background-color: rgba(40, 57, 89, 0.05);
    }
    
    .btn-sm {
      padding: 5px 10px;
      font-size: 0.85rem;
      min-width: 80px;
      max-width: 100px;
      display: flex;
    }
    
    .btn-md {
      padding: 8px 16px;
      font-size: 1rem;
      min-width: 80px;
    }
    
    .btn-lg {
      padding: 10px 20px;
      font-size: 1.1rem;
      min-width: 100px;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'accent' | 'highlight' | 'danger' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();

  getButtonClass(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}
