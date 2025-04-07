import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdquisicionRepository } from '../../../core/repositories/adquisicion.repository';
import { Adquisicion } from '../../../core/models/adquisicion.model';
import { UnidadAdministrativaRepository } from '../../../core/repositories/unidad-administrativa.repository';
import { ProveedorRepository } from '../../../core/repositories/proveedor.repository';
import { UnidadAdministrativa } from '../../../core/models/unidad-administrativa.model';
import { Proveedor } from '../../../core/models/proveedor.model';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { DocumentoAdquisicionRepository } from '../../../core/repositories/documento-adquisicion.repository';
import { DocumentoAdquisicion } from '../../../core/models/documento-adquisicion.model';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { PageLayoutComponent } from '../../../shared/components/ui/page-layout/page-layout.component';

@Component({
  selector: 'app-adquisicion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, PageLayoutComponent, TableComponent],
  template: `
    <app-page-layout title="Adquisiciones" class="full-width-layout">
      <div actions>
        <div class="top-actions-container">
          <div class="filter-container">
            <input 
              type="text" 
              [(ngModel)]="filterText" 
              (keyup.enter)="filterAdquisiciones()" 
              placeholder="Filtrar adquisiciones..." 
              class="filter-input"
            />
            <div class="filter-buttons">
              <app-button variant="secondary" size="sm" (onClick)="filterAdquisiciones()">Buscar</app-button>
              <app-button variant="secondary" size="sm" (onClick)="clearFilter()">Limpiar</app-button>
            </div>
          </div>
          <app-button variant="highlight" (onClick)="showAddModal = true">Agregar Adquisición</app-button>
        </div>
      </div>
      
      <!-- Tabla de Adquisiciones -->
      <app-table 
        class="styled-table"
        [items]="adquisiciones"
        [columns]="['tipoBienServicio', 'unidadAdministrativa.nombreUnidad', 'proveedor.nombreProveedor', 'presupuesto', 'cantidad', 'valorUnitario', 'valorTotal', 'fechaAdquisicion', 'estado']"
        [columnDisplayNames]="{
          'tipoBienServicio': 'TIPO',
          'unidadAdministrativa.nombreUnidad': 'UNIDAD ADMINISTRATIVA',
          'proveedor.nombreProveedor': 'PROVEEDOR',
          'presupuesto': 'PRESUPUESTO',
          'cantidad': 'CANTIDAD',
          'valorUnitario': 'VALOR UNITARIO',
          'valorTotal': 'VALOR TOTAL',
          'fechaAdquisicion': 'FECHA',
          'estado': 'ESTADO'
        }"
        [actionsColumnTitle]="'ACCIONES'"
        [enablePagination]="true"
        [pageSize]="10"
        [initialSortColumn]="'fechaAdquisicion'"
        [emptyMessage]="'No hay adquisiciones registradas'"
        (onView)="viewAdquisicion($event)"
        (onEdit)="editAdquisicion($event)"
        (onDelete)="deleteAdquisicion($event)"
      >


        <!-- Template personalizado para las filas -->
        <ng-template #rowsTemplate let-items="items">
          <tr *ngFor="let adquisicion of items">
            <td class="text-center">{{ adquisicion.tipoBienServicio }}</td>
            <td class="text-center">{{ adquisicion.unidadAdministrativa?.nombreUnidad || 'N/A' }}</td>
            <td class="text-center">{{ adquisicion.proveedor?.nombreProveedor || 'N/A' }}</td>
            <td class="text-center">{{ adquisicion.presupuesto | currency }}</td>
            <td class="text-center">{{ adquisicion.cantidad }}</td>
            <td class="text-center">{{ adquisicion.valorUnitario | currency }}</td>
            <td class="text-center">{{ adquisicion.valorTotal | currency }}</td>
            <td class="text-center">{{ adquisicion.fechaAdquisicion | date }}</td>
            <td class="text-center">
              <span [ngClass]="{
                'badge-success': adquisicion.estado === 'Activo',
                'badge-warning': adquisicion.estado === 'Pendiente',
                'badge-danger': adquisicion.estado === 'Cancelado'
              }" class="badge">{{ adquisicion.estado }}</span>
            </td>
            <td class="actions-column">
              <div class="actions-container">
                <div class="button-wrapper">
                  <app-button variant="secondary" size="sm" (onClick)="viewAdquisicion(adquisicion)" title="Ver detalles">
                    <i class="fas fa-eye"></i> Ver
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="highlight" size="sm" (onClick)="editAdquisicion(adquisicion)" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                  </app-button>
                </div>
                <div class="button-wrapper">
                  <app-button variant="danger" size="sm" (onClick)="deleteAdquisicion(adquisicion)" title="Eliminar">
                    <i class="fas fa-trash"></i> Eliminar
                  </app-button>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </app-table>

      <!-- Modal para Agregar -->  
      @if (showAddModal) {
        <div class="modal-overlay">
          <div class="modal-container">
            <div class="modal-header">
              <h3>{{ editMode ? 'Editar' : 'Agregar' }} Adquisición</h3>
              <button class="close-button" (click)="cancelModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="tipoBienServicio">Tipo de Bien/Servicio</label>
                <input type="text" id="tipoBienServicio" [(ngModel)]="currentAdquisicion.tipoBienServicio" required />
              </div>
              
              <div class="form-group">
                <label for="unidad">Unidad Administrativa</label>
                <select id="unidad" [(ngModel)]="currentAdquisicion.unidadID" required>
                  <option [value]="null" disabled>Seleccione una unidad</option>
                  @for (unidad of unidades; track unidad.id) {
                    <option [value]="unidad.id">{{ unidad.nombreUnidad }}</option>
                  }
                </select>
              </div>
              
              <div class="form-group">
                <label for="proveedor">Proveedor</label>
                <select id="proveedor" [(ngModel)]="currentAdquisicion.proveedorID" required>
                  <option [value]="null" disabled>Seleccione un proveedor</option>
                  @for (proveedor of proveedores; track proveedor.id) {
                    <option [value]="proveedor.id">{{ proveedor.nombreProveedor }}</option>
                  }
                </select>
              </div>
              
              <div class="form-group">
                <label for="presupuesto">Presupuesto</label>
                <input type="number" id="presupuesto" [(ngModel)]="currentAdquisicion.presupuesto" required />
              </div>
              
              <div class="form-group">
                <label for="cantidad">Cantidad</label>
                <input type="number" id="cantidad" [(ngModel)]="currentAdquisicion.cantidad" required />
              </div>
              
              <div class="form-group">
                <label for="valorUnitario">Valor Unitario</label>
                <input type="number" id="valorUnitario" [(ngModel)]="currentAdquisicion.valorUnitario" 
                  (change)="calculateTotal()" required />
              </div>
              
              <div class="form-group">
                <label for="valorTotal">Valor Total</label>
                <input type="number" id="valorTotal" [(ngModel)]="currentAdquisicion.valorTotal" readonly />
              </div>
              
              <div class="form-group">
                <label for="fechaAdquisicion">Fecha de Adquisición</label>
                <input type="date" id="fechaAdquisicion" 
                  [ngModel]="currentAdquisicion.fechaAdquisicion | date:'yyyy-MM-dd'" 
                  (ngModelChange)="currentAdquisicion.fechaAdquisicion = $event" required />
              </div>
              
              <div class="form-group">
                <label for="estado">Estado</label>
                <select id="estado" [(ngModel)]="currentAdquisicion.estado" required>
                  <option value="Activo">Activo</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="documentacion">Documentación</label>
                <textarea id="documentacion" [(ngModel)]="currentAdquisicion.documentacion"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="cancel-button" (click)="cancelModal()">Cancelar</button>
              <button class="save-button" (click)="saveAdquisicion()">Guardar</button>
            </div>
          </div>
        </div>
      }
      
      <!-- Modal de Confirmación para Eliminar --> 
      @if (showDeleteModal) {
        <div class="modal-overlay">
          <div class="modal-container delete-modal">
            <div class="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button class="close-button" (click)="showDeleteModal = false">×</button>
            </div>
            <div class="modal-body">
              <p>¿Está seguro que desea eliminar esta adquisición?</p>
              <p><strong>{{ adquisicionToDelete?.tipoBienServicio }}</strong></p>
            </div>
            <div class="modal-footer">
              <button class="cancel-button" (click)="showDeleteModal = false">Cancelar</button>
              <button class="delete-button" (click)="confirmDelete()">Eliminar</button>
            </div>
          </div>
        </div>
      }
      
      <!-- Modal para Ver Detalles -->
      @if (showViewModal && adquisicionSeleccionada) {
        <div class="modal-overlay">
          <div class="modal-container view-modal">
            <div class="modal-header">
              <h3>Detalles de la Adquisición</h3>
              <button class="close-button" (click)="closeViewModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="detail-section">
                <h4>Información General</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.tipoBienServicio }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value badge" [ngClass]="{
                      'badge-success': adquisicionSeleccionada.estado === 'Activo',
                      'badge-warning': adquisicionSeleccionada.estado === 'Pendiente',
                      'badge-danger': adquisicionSeleccionada.estado === 'Cancelado'
                    }">{{ adquisicionSeleccionada.estado }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Unidad:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.unidadAdministrativa?.nombreUnidad }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Proveedor:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.proveedor?.nombreProveedor }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Fecha Adquisición:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.fechaAdquisicion | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Fecha Creación:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Información Económica</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Presupuesto:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.presupuesto | currency }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Cantidad:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.cantidad }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Valor Unitario:</span>
                    <span class="detail-value">{{ adquisicionSeleccionada.valorUnitario | currency }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Valor Total:</span>
                    <span class="detail-value highlight">{{ adquisicionSeleccionada.valorTotal | currency }}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Documentación</h4>
                <div class="detail-text">
                  <p>{{ adquisicionSeleccionada.documentacion || 'No hay documentación adicional' }}</p>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Documentos Adjuntos</h4>
                @if (documentosAdquisicion.length > 0) {
                  <div class="documents-table-container">
                    <table class="documents-table">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Número</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (documento of documentosAdquisicion; track documento.id) {
                          <tr>
                            <td>{{ documento.tipoDocumento }}</td>
                            <td>{{ documento.numeroDocumento }}</td>
                            <td>{{ documento.fechaDocumento | date:'dd/MM/yyyy' }}</td>
                            <td>
                              <button class="doc-btn" title="Ver archivo" (click)="viewArchivo(documento.archivo, $event)">
                                <i class="fas fa-file-download"></i>
                                <span class="sr-only">Ver archivo</span>
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <p class="no-data">No hay documentos adjuntos para esta adquisición</p>
                }
              </div>
            </div>
            <div class="modal-footer">
              <button class="close-button" (click)="closeViewModal()">Cerrar</button>
            </div>
          </div>
        </div>
      }
    </app-page-layout>
  `,
  styles: [`
    /* Estilos para la tabla con los colores de marca */
    :host ::ng-deep .styled-table {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }
    
    :host ::ng-deep .styled-table .table-container {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      background-color: white;
      overflow: auto;
      width: 100%;
      max-width: 100%;
    }
    
    :host ::ng-deep .styled-table table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }
    
    :host ::ng-deep .styled-table th {
      background-color: #283959;
      color: white;
      padding: 12px 15px;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    
    :host ::ng-deep .styled-table tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    :host ::ng-deep .styled-table tr:hover {
      background-color: rgba(90, 124, 191, 0.1);
    }
    
    :host ::ng-deep .styled-table td {
      padding: 10px 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    /* Ajustes para responsividad */
    @media screen and (max-width: 1200px) {
      :host ::ng-deep .styled-table td, 
      :host ::ng-deep .styled-table th {
        padding: 8px 10px;
        font-size: 0.9rem;
      }
    }
    
    @media screen and (max-width: 768px) {
      :host ::ng-deep .styled-table td, 
      :host ::ng-deep .styled-table th {
        padding: 6px 8px;
        font-size: 0.8rem;
      }
    }
    
    :host ::ng-deep .styled-table .pagination-controls {
      padding: 15px;
      display: flex;
      justify-content: center;
      background-color: #f8f9fa;
    }
    
    /* Estilo para maximizar el ancho de la página */
    :host ::ng-deep .full-width-layout {
      width: 100%;
      max-width: 100%;
      padding: 0;
    }
    
    :host ::ng-deep .full-width-layout .content-container {
      max-width: 100%;
      padding: 0;
      width: 100%;
    }
    
    /* Mejor manejo de tablas muy anchas */
    @media screen and (max-width: 992px) {
      :host ::ng-deep .styled-table .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
    
    .top-actions-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 15px;
    }
    
    .filter-container {
      display: flex;
      gap: 10px;
      align-items: center;
      max-width: 70%;
      padding: 0 10px;
    }
    
    .filter-buttons {
      display: flex;
      gap: 5px;
    }
    
    .filter-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 250px;
      flex: 1;
    }
    
    @media screen and (max-width: 768px) {
      .top-actions-container {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      
      .filter-container {
        max-width: 100%;
        margin-bottom: 10px;
      }
    }
    
    .text-center {
      text-align: center !important;
    }
    
    /* Estilos para estado */
    .badge {
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-block;
      text-align: center;
      min-width: 80px;
    }
    
    .badge-success {
      background-color: #27ae60;
      color: white;
    }
    
    .badge-warning {
      background-color: #f39c12;
      color: white;
    }
    
    .badge-danger {
      background-color: #e74c3c;
      color: white;
    }
    
    /* Estilos para el modal de visualización */
    .view-modal {
      max-width: 800px;
      width: 90%;
    }
    
    .detail-section {
      margin-bottom: 24px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
    }
    
    .detail-section h4 {
      margin-bottom: 12px;
      color: var(--color-primary);
      font-size: 16px;
      font-weight: 600;
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 15px;
      font-weight: 500;
    }
    
    .detail-value.highlight {
      color: var(--color-primary);
      font-weight: bold;
    }
    
    .detail-text {
      background-color: #f9f9f9;
      padding: 12px;
      border-radius: 4px;
    }
    
    .documents-table-container {
      margin-top: 12px;
      overflow-x: auto;
    }
    
    .documents-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .documents-table th, .documents-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .documents-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .doc-btn {
      background-color: transparent;
      border: none;
      color: var(--color-primary);
      cursor: pointer;
    }
    
    .no-data {
      color: #888;
      font-style: italic;
      padding: 12px 0;
    }
    .add-button {
      padding: 10px 20px;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .add-button:hover {
      background-color: var(--color-primary-dark);
    }
    .adquisiciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .adquisicion-card {
      padding: 20px;
      border: none;
      border-radius: 12px;
      background-color: white;
      box-shadow: 0 2px 8px rgba(40, 57, 89, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .adquisicion-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 57, 89, 0.15);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    .card-actions {
      display: flex;
      gap: 5px;
    }
    .action-button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .action-button.edit {
      background-color: var(--color-secondary);
    }
    .action-button.delete {
      background-color: var(--color-danger);
    }
    .adquisicion-card h3 {
      color: var(--color-primary);
      margin-bottom: 1rem;
      font-size: 1.2rem;
      margin: 0;
    }
    .adquisicion-card p {
      color: var(--color-secondary);
      margin-bottom: 0.5rem;
    }
    h2 {
      color: var(--color-primary);
      font-size: 1.8rem;
      margin: 0;
      padding-bottom: 0.5rem;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-container {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    .delete-modal {
      max-width: 400px;
    }
    .modal-header {
      padding: 15px 20px;
      background-color: var(--color-primary);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 1.2rem;
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
      max-height: 70vh;
      overflow-y: auto;
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
    .form-group input, .form-group select, .form-group textarea {
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
export class AdquisicionListComponent implements OnInit {
  adquisiciones: Adquisicion[] = [];
  unidades: UnidadAdministrativa[] = [];
  proveedores: Proveedor[] = [];
  showAddModal = false;
  showDeleteModal = false;
  editMode = false;
  filterText = '';
  tableColumns = ['tipoBienServicio', 'unidadAdministrativa.nombreUnidad', 'proveedor.nombreProveedor', 'presupuesto', 'cantidad', 'valorUnitario', 'valorTotal', 'fechaAdquisicion', 'estado'];

  currentAdquisicion: Adquisicion = this.initializeNewAdquisicion();
  adquisicionToDelete?: Adquisicion;

  constructor(
    private adquisicionRepository: AdquisicionRepository,
    private unidadRepository: UnidadAdministrativaRepository,
    private proveedorRepository: ProveedorRepository,
    private documentoRepository: DocumentoAdquisicionRepository
  ) { }

  ngOnInit(): void {
    this.loadAdquisiciones();
    this.loadUnidades();
    this.loadProveedores();
  }

  private loadAdquisiciones(): void {
    this.adquisicionRepository.getAll().subscribe({
      next: (data) => this.adquisiciones = data,
      error: (error) => console.error('Error cargando adquisiciones:', error)
    });
  }

  private loadUnidades(): void {
    this.unidadRepository.getAll().subscribe({
      next: (data) => this.unidades = data,
      error: (error) => console.error('Error cargando unidades administrativas:', error)
    });
  }

  private loadProveedores(): void {
    this.proveedorRepository.getAll().subscribe({
      next: (data) => this.proveedores = data,
      error: (error) => console.error('Error cargando proveedores:', error)
    });
  }

  editAdquisicion(adquisicion: Adquisicion): void {
    this.editMode = true;
    this.currentAdquisicion = { ...adquisicion };
    this.showAddModal = true;
  }

  deleteAdquisicion(adquisicion: Adquisicion): void {
    this.adquisicionToDelete = adquisicion;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.adquisicionToDelete && this.adquisicionToDelete.id) {
      this.adquisicionRepository.delete(this.adquisicionToDelete.id).subscribe({
        next: () => {
          this.loadAdquisiciones();
          this.showDeleteModal = false;
          this.adquisicionToDelete = undefined;
        },
        error: (error) => console.error('Error eliminando adquisición:', error)
      });
    }
  }

  saveAdquisicion(): void {
    this.calculateTotal(); // Ensure total is calculated before saving

    if (this.editMode && this.currentAdquisicion.id) {
      // Update existing adquisicion
      this.adquisicionRepository.update(this.currentAdquisicion.id, this.currentAdquisicion).subscribe({
        next: () => {
          this.loadAdquisiciones();
          this.cancelModal();
        },
        error: (error) => console.error('Error actualizando adquisición:', error)
      });
    } else {
      // Create new adquisicion
      this.adquisicionRepository.create(this.currentAdquisicion).subscribe({
        next: () => {
          this.loadAdquisiciones();
          this.cancelModal();
        },
        error: (error) => console.error('Error creando adquisición:', error)
      });
    }
  }

  cancelModal(): void {
    this.showAddModal = false;
    this.editMode = false;
    this.currentAdquisicion = this.initializeNewAdquisicion();
  }

  filterAdquisiciones(): void {
    if (this.filterText.trim()) {
      this.adquisicionRepository.filter(this.filterText).subscribe({
        next: (data) => this.adquisiciones = data,
        error: (error) => console.error('Error filtrando adquisiciones:', error)
      });
    } else {
      this.loadAdquisiciones();
    }
  }

  clearFilter(): void {
    this.filterText = '';
    this.loadAdquisiciones();
  }

  // Propiedades para el modal de visualización
  showViewModal = false;
  adquisicionSeleccionada?: Adquisicion;
  documentosAdquisicion: DocumentoAdquisicion[] = [];

  viewAdquisicion(adquisicion: Adquisicion): void {
    this.adquisicionSeleccionada = adquisicion;
    this.showViewModal = true;

    // Cargar los documentos asociados a esta adquisición
    if (adquisicion.id) {
      this.documentoRepository.getByAdquisicionId(adquisicion.id).subscribe({
        next: (documentos: DocumentoAdquisicion[]) => {
          this.documentosAdquisicion = documentos;
          console.log('Documentos cargados:', documentos);
        },
        error: (error: any) => console.error('Error cargando documentos:', error)
      });
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.adquisicionSeleccionada = undefined;
    this.documentosAdquisicion = [];
  }

  calculateTotal(): void {
    this.currentAdquisicion.valorTotal =
      this.currentAdquisicion.cantidad * this.currentAdquisicion.valorUnitario;
  }

  private initializeNewAdquisicion(): Adquisicion {
    return {
      presupuesto: 0,
      unidadID: 0,
      tipoBienServicio: '',
      cantidad: 0,
      valorUnitario: 0,
      valorTotal: 0,
      fechaAdquisicion: new Date(),
      proveedorID: 0,
      estado: 'Activo',
      fechaCreacion: new Date()
    };
  }

  viewArchivo(archivo: string | undefined, event: MouseEvent): void {
    event.preventDefault();
    // Could implement a modal or redirect to the file
    if (archivo) {
      window.open(archivo, '_blank');
    }
  }
}