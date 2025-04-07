import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadAdministrativa } from '../../../core/models/unidad-administrativa.model';
import { UnidadAdministrativaRepository } from '../../../core/repositories/unidad-administrativa.repository';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { PageLayoutComponent } from '../../../shared/components/ui/page-layout/page-layout.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';

@Component({
  selector: 'app-unidad-administrativa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ModalComponent, PageLayoutComponent, TableComponent],
  template: `
    <app-page-layout title="Unidades Administrativas">
      <div actions>
        <app-button variant="highlight" (onClick)="showAddModal = true">Agregar Unidad</app-button>
      </div>
      
      <app-table 
        [items]="unidadesAdministrativas" 
        [columns]="['nombreUnidad']"
        [columnDisplayNames]="{
          'nombreUnidad': 'NOMBRE DE LA UNIDAD'
        }"
        [enablePagination]="true"
        [pageSize]="10"
        [initialSortColumn]="'nombreUnidad'"
        [emptyMessage]="'No hay unidades administrativas disponibles'"
        (onView)="viewUnidad($event)"
        (onEdit)="editUnidad($event)"
        (onDelete)="deleteUnidad($event)">
        
        <!-- Template personalizado para las filas -->
        <ng-template #rowsTemplate let-items="items">
          <tr *ngFor="let unidad of items">
            <td class="text-center">{{ unidad.nombreUnidad }}</td>
            <td class="actions-column">
              <div class="actions-container">
                <div class="button-wrapper">
                  <app-button variant="secondary" size="sm" (onClick)="viewUnidad(unidad)" title="Ver detalles">
                    <i class="fas fa-eye"></i> Ver
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="highlight" size="sm" (onClick)="editUnidad(unidad)" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="danger" size="sm" (onClick)="deleteUnidad(unidad)" title="Eliminar">
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
        [title]="editMode ? 'Editar Unidad Administrativa' : 'Agregar Unidad Administrativa'"
        [showFooter]="true"
        [confirmButtonText]="'Guardar'"
        (onClose)="cancelModal()"
        (onConfirm)="saveUnidad()">
        <div class="form-container">
          <div class="form-group">
            <label for="nombreUnidad">Nombre de la Unidad</label>
            <input type="text" id="nombreUnidad" [(ngModel)]="currentUnidad.nombreUnidad" required />
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
        <p>¿Está seguro que desea eliminar esta unidad administrativa?</p>
        <p><strong>{{ unidadToDelete?.nombreUnidad }}</strong></p>
      </app-modal>
      
      <!-- Modal para Ver Detalles -->
      <app-modal 
        [isOpen]="showViewModal"
        title="Detalles de la Unidad Administrativa"
        [showFooter]="true"
        [confirmButtonText]="'Cerrar'"
        [confirmButtonVariant]="'secondary'"
        (onClose)="showViewModal = false"
        (onConfirm)="showViewModal = false">
        <div class="unidad-details">
          <div class="detail-item">
            <strong>Nombre:</strong>
            <p>{{ unidadToView?.nombreUnidad }}</p>
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
    .unidad-details {
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
    }
    
    .form-group label {
      font-weight: 500;
      color: #283959;
      font-size: 0.9rem;
    }
    
    .form-group input {
      padding: 8px 12px;
      border: 1px solid rgba(40, 57, 89, 0.2);
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #5A7CBF;
      box-shadow: 0 0 0 3px rgba(90, 124, 191, 0.1);
    }
    
    @media (max-width: 768px) {
      .unidades-grid {
        grid-template-columns: 1fr;
      }
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
    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
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
export class UnidadAdministrativaListComponent implements OnInit {
  unidadesAdministrativas: UnidadAdministrativa[] = [];
  showAddModal = false;
  showDeleteModal = false;
  showViewModal = false;
  editMode = false;
  
  currentUnidad: UnidadAdministrativa = this.initializeNewUnidad();
  unidadToDelete?: UnidadAdministrativa;
  unidadToView?: UnidadAdministrativa;

  constructor(private unidadRepository: UnidadAdministrativaRepository) {}

  ngOnInit(): void {
    this.loadUnidades();
  }

  private loadUnidades(): void {
    this.unidadRepository.getAll().subscribe({
      next: (data) => this.unidadesAdministrativas = data,
      error: (error) => console.error('Error cargando unidades administrativas:', error)
    });
  }
  
  editUnidad(unidad: UnidadAdministrativa): void {
    this.editMode = true;
    this.currentUnidad = { ...unidad };
    this.showAddModal = true;
  }
  
  viewUnidad(unidad: UnidadAdministrativa): void {
    this.unidadToView = unidad;
    this.showViewModal = true;
  }
  
  deleteUnidad(unidad: UnidadAdministrativa): void {
    this.unidadToDelete = unidad;
    this.showDeleteModal = true;
  }
  
  confirmDelete(): void {
    if (this.unidadToDelete && this.unidadToDelete.id) {
      this.unidadRepository.delete(this.unidadToDelete.id).subscribe({
        next: () => {
          this.loadUnidades();
          this.showDeleteModal = false;
          this.unidadToDelete = undefined;
        },
        error: (error) => console.error('Error eliminando unidad administrativa:', error)
      });
    }
  }
  
  saveUnidad(): void {
    if (this.editMode && this.currentUnidad.id) {
      // Update existing unidad
      this.unidadRepository.update(this.currentUnidad.id, this.currentUnidad).subscribe({
        next: () => {
          this.loadUnidades();
          this.cancelModal();
        },
        error: (error) => console.error('Error actualizando unidad administrativa:', error)
      });
    } else {
      // Create new unidad
      this.unidadRepository.create(this.currentUnidad).subscribe({
        next: () => {
          this.loadUnidades();
          this.cancelModal();
        },
        error: (error) => console.error('Error creando unidad administrativa:', error)
      });
    }
  }
  
  cancelModal(): void {
    this.showAddModal = false;
    this.editMode = false;
    this.currentUnidad = this.initializeNewUnidad();
  }
  
  private initializeNewUnidad(): UnidadAdministrativa {
    return {
      nombreUnidad: ''
    };
  }
}
