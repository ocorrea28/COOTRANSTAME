import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-container" [ngClass]="{'modal-sm': size === 'sm', 'modal-lg': size === 'lg'}">
        <div class="modal-header" [ngClass]="{'warning-header': variant === 'warning', 'danger-header': variant === 'danger'}">
          <h3>{{ title }}</h3>
          <button class="close-button" (click)="onClose.emit()" title="Cerrar">×</button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[footer]"></ng-content>
          <div *ngIf="!hasCustomFooter">
            <app-button variant="outline" (onClick)="onClose.emit()">Cancelar</app-button>
            <app-button 
              *ngIf="showConfirmButton" 
              [variant]="confirmButtonVariant" 
              (onClick)="onConfirm.emit()"
              [disabled]="confirmDisabled">
              {{ confirmButtonText }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(40, 57, 89, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    
    .modal-container {
      background-color: #F2F2F2;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(40, 57, 89, 0.2);
      animation: slideIn 0.3s ease;
    }
    
    .modal-sm {
      max-width: 400px;
    }
    
    .modal-lg {
      max-width: 800px;
    }
    
    .modal-header {
      padding: 15px 20px;
      background-color: #283959;
      color: #F2F2F2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .warning-header {
      background-color: #5A7CBF;
    }
    
    .danger-header {
      background-color: #e74c3c;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .close-button {
      background: none;
      border: none;
      color: #F2F2F2;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
      transition: opacity 0.2s ease;
    }
    
    .close-button:hover {
      opacity: 0.8;
    }
    
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      max-height: calc(90vh - 130px);
      background-color: white;
    }
    
    .modal-footer {
      padding: 15px 20px;
      background-color: #F2F2F2;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid rgba(40, 57, 89, 0.1);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'warning' | 'danger' = 'default';
  @Input() showFooter = true;
  @Input() hasCustomFooter = false;
  @Input() showConfirmButton = true;
  @Input() confirmButtonText = 'Aceptar';
  @Input() confirmButtonVariant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() confirmDisabled = false;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
}
