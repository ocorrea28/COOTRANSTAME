import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../../core/models/proveedor.model';
import { ProveedorRepository } from '../../../core/repositories/proveedor.repository';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { PageLayoutComponent } from '../../../shared/components/ui/page-layout/page-layout.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ModalComponent, PageLayoutComponent, TableComponent],
  template: `
    <app-page-layout title="Proveedores">
      <div actions>
        <app-button variant="highlight" (onClick)="showAddModal = true">Agregar Proveedor</app-button>
      </div>
      
      <app-table 
        [items]="proveedores" 
        [columns]="['nombreProveedor', 'informacionContacto']"
        [columnDisplayNames]="{
          'nombreProveedor': 'NOMBRE DEL PROVEEDOR',
          'informacionContacto': 'INFORMACIÓN DE CONTACTO'
        }"
        [enablePagination]="true"
        [pageSize]="10"
        [initialSortColumn]="'nombreProveedor'"
        [emptyMessage]="'No hay proveedores disponibles'"
        (onView)="viewProveedor($event)"
        (onEdit)="editProveedor($event)"
        (onDelete)="deleteProveedor($event)">
        
        <!-- Template personalizado para las filas -->
        <ng-template #rowsTemplate let-items="items">
          <tr *ngFor="let proveedor of items">
            <td class="text-center">{{ proveedor.nombreProveedor }}</td>
            <td class="text-center">{{ proveedor.informacionContacto || 'No disponible' }}</td>
            <td class="actions-column">
              <div class="actions-container">
                <div class="button-wrapper">
                  <app-button variant="secondary" size="sm" (onClick)="viewProveedor(proveedor)" title="Ver detalles">
                    <i class="fas fa-eye"></i> Ver
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="highlight" size="sm" (onClick)="editProveedor(proveedor)" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="danger" size="sm" (onClick)="deleteProveedor(proveedor)" title="Eliminar">
                    <i class="fas fa-trash"></i> Eliminar
                  </app-button>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </app-table>

      <!-- Modal para Agregar/Editar -->
      <app-modal 
        [isOpen]="showAddModal"
        [title]="editMode ? 'Editar Proveedor' : 'Agregar Proveedor'"
        [showFooter]="true"
        [confirmButtonText]="'Guardar'"
        (onClose)="cancelModal()"
        (onConfirm)="saveProveedor()">
        <div class="form-container">
          <div class="form-group">
            <label for="nombreProveedor">Nombre del Proveedor</label>
            <input type="text" id="nombreProveedor" [(ngModel)]="currentProveedor.nombreProveedor" required />
          </div>
          
          <div class="form-group">
            <label for="informacionContacto">Información de Contacto</label>
            <textarea id="informacionContacto" [(ngModel)]="currentProveedor.informacionContacto"></textarea>
          </div>
        </div>
      </app-modal>
      
      <!-- Modal de Confirmación para Eliminar -->
      <app-modal 
        [isOpen]="showDeleteModal"
        title="Confirmar Eliminación"
        [showFooter]="true"
        [confirmButtonText]="'Eliminar'"
        [confirmButtonVariant]="'danger'"
        [variant]="'danger'"
        (onClose)="showDeleteModal = false"
        (onConfirm)="confirmDelete()">
        <p>¿Está seguro que desea eliminar este proveedor?</p>
        <p><strong>{{ proveedorToDelete?.nombreProveedor }}</strong></p>
      </app-modal>
      
      <!-- Modal para Ver Detalles -->
      <app-modal 
        [isOpen]="showViewModal"
        title="Detalles del Proveedor"
        [showFooter]="true"
        [confirmButtonText]="'Cerrar'"
        [confirmButtonVariant]="'secondary'"
        (onClose)="showViewModal = false"
        (onConfirm)="showViewModal = false">
        <div class="proveedor-details">
          <div class="detail-item">
            <strong>Nombre:</strong>
            <p>{{ proveedorToView?.nombreProveedor }}</p>
          </div>
          <div class="detail-item">
            <strong>Información de Contacto:</strong>
            <p>{{ proveedorToView?.informacionContacto || 'No disponible' }}</p>
          </div>
        </div>
      </app-modal>
    </app-page-layout>
  `,
  styles: [`
    /* Estilos para la tabla */
    :host ::ng-deep .table-container {
      margin-top: 20px;
      padding: 0;
      box-shadow: none;
      border: none;
      background-color: transparent;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Centrar el texto en las celdas */
    :host ::ng-deep .text-center {
      text-align: center;
    }
    
    /* Quitar bordes y estilos innecesarios */
    :host ::ng-deep table {
      border-collapse: separate;
      border-spacing: 0 8px;
    }
    
    :host ::ng-deep th {
      background-color: transparent;
      color: #283959;
      border-bottom: 2px solid #5A7CBF;
      padding-bottom: 12px;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
    
    :host ::ng-deep td {
      border: none;
      background-color: white;
      color: #283959;
      font-weight: 500;
      padding: 16px 18px;
      border-radius: 4px;
    }
    
    :host ::ng-deep tr:nth-child(even) td {
      background-color: rgba(90, 124, 191, 0.12);
      color: #283959;
    }
    
    :host ::ng-deep tr:hover td {
      background-color: rgba(4, 217, 178, 0.08);
    }
    
    :host ::ng-deep .pagination {
      background-color: transparent;
      border-top: none;
      box-shadow: none;
    }
    
    /* Estilos para el modal de detalles */
    .proveedor-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .detail-item {
      padding: 10px 0;
      border-bottom: 1px solid rgba(40, 57, 89, 0.1);
    }
    
    .detail-item strong {
      display: block;
      color: #5A7CBF;
      margin-bottom: 5px;
      font-size: 0.9rem;
    }
    
    .detail-item p {
      margin: 0;
      font-size: 1rem;
      color: #283959;
    }
    
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 10px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #283959;
      font-size: 0.9rem;
    }
    
    .form-group input,
    .form-group textarea {
      padding: 8px 12px;
      border: 1px solid rgba(40, 57, 89, 0.2);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #5A7CBF;
      box-shadow: 0 0 0 3px rgba(90, 124, 191, 0.1);
    }
    
    @media (max-width: 768px) {
      .proveedores-grid {
        grid-template-columns: 1fr;
      }
    }
    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-body {
      padding: 20px;
    }
    .modal-footer {
      padding: 15px 20px;
      background-color: #f8f9fa;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: var(--color-text);
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }
    .cancel-button {
      padding: 8px 16px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .save-button {
      padding: 8px 16px;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-button {
      padding: 8px 16px;
      background-color: var(--color-danger);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ProveedorListComponent implements OnInit {
  proveedores: Proveedor[] = [];
  showAddModal = false;
  showDeleteModal = false;
  showViewModal = false;
  editMode = false;
  
  currentProveedor: Proveedor = this.initializeNewProveedor();
  proveedorToDelete?: Proveedor;
  proveedorToView?: Proveedor;

  constructor(private proveedorRepository: ProveedorRepository) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  private loadProveedores(): void {
    this.proveedorRepository.getAll().subscribe({
      next: (data) => this.proveedores = data,
      error: (error) => console.error('Error cargando proveedores:', error)
    });
  }
  
  editProveedor(proveedor: Proveedor): void {
    this.editMode = true;
    this.currentProveedor = { ...proveedor };
    this.showAddModal = true;
  }
  
  viewProveedor(proveedor: Proveedor): void {
    this.proveedorToView = proveedor;
    this.showViewModal = true;
  }
  
  deleteProveedor(proveedor: Proveedor): void {
    this.proveedorToDelete = proveedor;
    this.showDeleteModal = true;
  }
  
  confirmDelete(): void {
    if (this.proveedorToDelete && this.proveedorToDelete.id) {
      this.proveedorRepository.delete(this.proveedorToDelete.id).subscribe({
        next: () => {
          this.loadProveedores();
          this.showDeleteModal = false;
          this.proveedorToDelete = undefined;
        },
        error: (error) => console.error('Error eliminando proveedor:', error)
      });
    }
  }
  
  saveProveedor(): void {
    if (this.editMode && this.currentProveedor.id) {
      // Update existing proveedor
      this.proveedorRepository.update(this.currentProveedor.id, this.currentProveedor).subscribe({
        next: () => {
          this.loadProveedores();
          this.cancelModal();
        },
        error: (error) => console.error('Error actualizando proveedor:', error)
      });
    } else {
      // Create new proveedor
      this.proveedorRepository.create(this.currentProveedor).subscribe({
        next: () => {
          this.loadProveedores();
          this.cancelModal();
        },
        error: (error) => console.error('Error creando proveedor:', error)
      });
    }
  }
  
  cancelModal(): void {
    this.showAddModal = false;
    this.editMode = false;
    this.currentProveedor = this.initializeNewProveedor();
  }
  
  private initializeNewProveedor(): Proveedor {
    return {
      nombreProveedor: '',
      informacionContacto: ''
    };
  }
}
