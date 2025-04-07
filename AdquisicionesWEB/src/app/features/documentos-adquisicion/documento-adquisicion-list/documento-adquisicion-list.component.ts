import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentoAdquisicion } from '../../../core/models/documento-adquisicion.model';
import { Adquisicion } from '../../../core/models/adquisicion.model';
import { DocumentoAdquisicionRepository } from '../../../core/repositories/documento-adquisicion.repository';
import { AdquisicionRepository } from '../../../core/repositories/adquisicion.repository';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { PageLayoutComponent } from '../../../shared/components/ui/page-layout/page-layout.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';

@Component({
  selector: 'app-documento-adquisicion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ModalComponent, PageLayoutComponent, TableComponent],
  template: `
    <app-page-layout title="Documentos de Adquisiciones">
      <div actions>
        <div *ngIf="adquisicionId" class="badge">
          Filtrado por Adquisición ID: {{ adquisicionId }}
        </div>
        <app-button variant="highlight" (onClick)="showAddModal = true">Agregar Documento</app-button>
      </div>
      
      <app-table 
        [items]="documentos" 
        [columns]="['tipoDocumento', 'numeroDocumento', 'fechaDocumento', 'adquisicion.tipoBienServicio']"
        [columnDisplayNames]="{
          'tipoDocumento': 'Tipo de Documento',
          'numeroDocumento': 'Número',
          'fechaDocumento': 'Fecha',
          'adquisicion.tipoBienServicio': 'Adquisición'
        }"
        [enablePagination]="true"
        [pageSize]="10"
        [initialSortColumn]="'tipoDocumento'"
        [emptyMessage]="'No hay documentos disponibles'"
        (onView)="viewDocumento($event)"
        (onEdit)="editDocumento($event)"
        (onDelete)="deleteDocumento($event)">
        
        <!-- Template personalizado para las filas -->
        <ng-template #rowsTemplate let-items="items">
          <tr *ngFor="let documento of items">
            <td class="text-center">{{ documento.tipoDocumento }}</td>
            <td class="text-center">{{ documento.numeroDocumento }}</td>
            <td class="text-center">{{ documento.fechaDocumento | date }}</td>
            <td class="text-center">{{ documento.adquisicion?.tipoBienServicio || 'N/A' }}</td>
            <td class="actions-column">
              <div class="actions-container">
                <div class="button-wrapper">
                  <app-button variant="secondary" size="sm" (onClick)="viewDocumento(documento)" title="Ver detalles">
                    <i class="fas fa-eye"></i> Ver
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="highlight" size="sm" (onClick)="editDocumento(documento)" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="danger" size="sm" (onClick)="deleteDocumento(documento)" title="Eliminar">
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
        [title]="editMode ? 'Editar Documento' : 'Agregar Documento'"
        [showFooter]="true"
        [confirmButtonText]="'Guardar'"
        (onClose)="cancelModal()"
        (onConfirm)="saveDocumento()">
        <div class="form-container">
          <div class="form-group">
            <label for="tipoDocumento">Tipo de Documento</label>
            <select id="tipoDocumento" [(ngModel)]="currentDocumento.tipoDocumento" required>
              <option value="Factura">Factura</option>
              <option value="Contrato">Contrato</option>
              <option value="Orden de Compra">Orden de Compra</option>
              <option value="Recibo">Recibo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="numeroDocumento">Número de Documento</label>
            <input type="text" id="numeroDocumento" [(ngModel)]="currentDocumento.numeroDocumento" required />
          </div>
          
          <div class="form-group">
            <label for="fechaDocumento">Fecha del Documento</label>
            <input type="date" id="fechaDocumento" 
              [ngModel]="currentDocumento.fechaDocumento | date:'yyyy-MM-dd'" 
              (ngModelChange)="currentDocumento.fechaDocumento = $event" required />
          </div>
          
          @if (!adquisicionId) {
            <div class="form-group">
              <label for="adquisicionID">Adquisición</label>
              <select id="adquisicionID" [(ngModel)]="currentDocumento.adquisicionID" required>
                <option [ngValue]="">Seleccione una adquisición</option>
                @for (adquisicion of adquisiciones; track adquisicion.id) {
                  <option [ngValue]="adquisicion.id">
                    {{ adquisicion.tipoBienServicio }} - {{ adquisicion.proveedor?.nombreProveedor || 'Sin proveedor' }}
                  </option>
                }
              </select>
            </div>
          }
          
          <div class="form-group">
            <label for="archivo">Archivo (URL o Referencia)</label>
            <input type="text" id="archivo" [(ngModel)]="currentDocumento.archivo" />
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
        <p>¿Está seguro que desea eliminar este documento?</p>
        <p><strong>{{ documentoToDelete?.tipoDocumento }} - {{ documentoToDelete?.numeroDocumento }}</strong></p>
      </app-modal>
    </app-page-layout>
  `,
  styles: [`
    .badge {
      background-color: #5A7CBF;
      color: #F2F2F2;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-right: 10px;
    }
    
    /* Estilos para la tabla */
    :host ::ng-deep .table-container {
      margin-top: 20px;
      padding: 0;
      box-shadow: none;
      border: none;
      background-color: transparent;
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
    
    /* Estilos para los enlaces de archivo */
    .archivo-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s;
      padding: 6px 12px;
      border-radius: 4px;
      background-color: #04D9B2;
      box-shadow: 0 2px 4px rgba(4, 217, 178, 0.2);
    }
    
    .archivo-link:hover {
      background-color: #03b295;
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(4, 217, 178, 0.3);
    }
    
    .archivo-link i {
      margin-right: 6px;
    }
    
    /* Ajustes para los botones de acción */
    :host ::ng-deep .actions-column {
      background-color: transparent;
    }
    
    
    :host ::ng-deep .actions-column app-button ::ng-deep button {
      box-shadow: none;
      border: 1px solid rgba(40, 57, 89, 0.1);
      font-weight: 600;
    }
    
    :host ::ng-deep .actions-column app-button:hover ::ng-deep button {
      transform: translateY(-2px);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    }
    
    .archivo-link {
      color: #04D9B2;
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      margin-top: 5px;
      transition: color 0.2s;
    }
    
    .archivo-link:hover {
      color: #03b295;
      text-decoration: underline;
    }
    
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px 15px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 5px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #283959;
      font-size: 0.9rem;
    }
    
    .form-group input,
    .form-group select {
      padding: 8px 12px;
      border: 1px solid rgba(40, 57, 89, 0.2);
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #5A7CBF;
      box-shadow: 0 0 0 3px rgba(90, 124, 191, 0.1);
    }
    
    @media (max-width: 768px) {
      .documentos-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentoAdquisicionListComponent implements OnInit {
  documentos: DocumentoAdquisicion[] = [];
  adquisiciones: Adquisicion[] = [];
  adquisicionId?: number;
  showAddModal = false;
  showDeleteModal = false;
  editMode = false;

  currentDocumento: DocumentoAdquisicion = this.initializeNewDocumento();
  documentoToDelete?: DocumentoAdquisicion;

  constructor(
    private documentoRepository: DocumentoAdquisicionRepository,
    private adquisicionRepository: AdquisicionRepository,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Load all adquisiciones for the dropdown
    this.loadAdquisiciones();

    // Check if we're viewing documents for a specific adquisicion
    this.route.params.subscribe(params => {
      if (params['adquisicionId']) {
        this.adquisicionId = +params['adquisicionId'];
        this.loadDocumentosByAdquisicion(this.adquisicionId);
      } else {
        this.loadAllDocumentos();
      }
    });
  }

  private loadAdquisiciones(): void {
    this.adquisicionRepository.getAll().subscribe({
      next: (data) => this.adquisiciones = data,
      error: (error) => console.error('Error cargando adquisiciones:', error)
    });
  }

  private loadAllDocumentos(): void {
    this.documentoRepository.getAll().subscribe({
      next: (data) => this.documentos = data,
      error: (error) => console.error('Error cargando documentos:', error)
    });
  }

  private loadDocumentosByAdquisicion(adquisicionId: number): void {
    this.documentoRepository.getByAdquisicionId(adquisicionId).subscribe({
      next: (data) => this.documentos = data,
      error: (error) => console.error(`Error cargando documentos para adquisición ${adquisicionId}:`, error)
    });
  }

  editDocumento(documento: DocumentoAdquisicion): void {
    this.editMode = true;
    this.currentDocumento = { ...documento };
    this.showAddModal = true;
  }

  deleteDocumento(documento: DocumentoAdquisicion): void {
    this.documentoToDelete = documento;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.documentoToDelete && this.documentoToDelete.id) {
      this.documentoRepository.delete(this.documentoToDelete.id).subscribe({
        next: () => {
          if (this.adquisicionId) {
            this.loadDocumentosByAdquisicion(this.adquisicionId);
          } else {
            this.loadAllDocumentos();
          }
          this.showDeleteModal = false;
          this.documentoToDelete = undefined;
        },
        error: (error) => console.error('Error eliminando documento:', error)
      });
    }
  }

  saveDocumento(): void {
    // If we're filtering by adquisicionId, make sure to set it
    if (this.adquisicionId) {
      this.currentDocumento.adquisicionID = this.adquisicionId;
    }

    if (this.editMode && this.currentDocumento.id) {
      // Update existing documento
      this.documentoRepository.update(this.currentDocumento.id, this.currentDocumento).subscribe({
        next: () => {
          if (this.adquisicionId) {
            this.loadDocumentosByAdquisicion(this.adquisicionId);
          } else {
            this.loadAllDocumentos();
          }
          this.cancelModal();
        },
        error: (error) => console.error('Error actualizando documento:', error)
      });
    } else {
      // Create new documento
      this.documentoRepository.create(this.currentDocumento).subscribe({
        next: () => {
          if (this.adquisicionId) {
            this.loadDocumentosByAdquisicion(this.adquisicionId);
          } else {
            this.loadAllDocumentos();
          }
          this.cancelModal();
        },
        error: (error) => console.error('Error creando documento:', error)
      });
    }
  }

  cancelModal(): void {
    this.showAddModal = false;
    this.editMode = false;
    this.currentDocumento = this.initializeNewDocumento();
  }

  viewArchivo(archivo: string, event: Event): void {
    event.preventDefault();
    // Could implement a modal or redirect to the file
    window.open(archivo, '_blank');
  }

  viewDocumento(documento: DocumentoAdquisicion): void {
    // Lógica para ver detalles del documento (podría mostrar un modal con detalles completos)
    console.log('Ver detalles del documento:', documento);

    // Por ahora, si tiene archivo, lo abrimos
    if (documento.archivo) {
      window.open(documento.archivo, '_blank');
    }
  }

  private initializeNewDocumento(): DocumentoAdquisicion {
    return {
      adquisicionID: this.adquisicionId || 0,
      tipoDocumento: '',
      numeroDocumento: '',
      fechaDocumento: new Date()
    };
  }
}
