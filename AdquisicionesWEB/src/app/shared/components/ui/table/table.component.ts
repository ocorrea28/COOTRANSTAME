import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="table-container" [class.no-actions-container]="!showActions">
      <table>
        <thead>
          <tr>
            <ng-container *ngIf="headerTemplate">
              <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </ng-container>
            <ng-container *ngIf="!headerTemplate">
              <th *ngFor="let column of columns" (click)="sort(column)" class="sortable-header">
                {{ getDisplayName(column) }}
                <span *ngIf="sortColumn === column" class="sort-icon">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <!-- La columna de acciones solo se muestra cuando showActions es true -->
              <th *ngIf="showActions" class="actions-header">{{ actionsColumnTitle }}</th>
            </ng-container>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="rowsTemplate">
            <ng-container *ngTemplateOutlet="rowsTemplate; context: {items: displayedItems}"></ng-container>
          </ng-container>
          <ng-container *ngIf="!rowsTemplate && displayedItems.length > 0">
            <tr *ngFor="let item of displayedItems">
              <td *ngFor="let column of columns">{{ getItemProperty(item, column) }}</td>
              <td *ngIf="showActions" class="actions-column" [class.hidden-actions]="!showActions">
                <div class="actions-container">
                  <div class="button-wrapper">
                    <app-button variant="secondary" size="sm" (onClick)="onView.emit(item)" title="Ver detalles">
                      <i class="fas fa-eye"></i> Ver
                    </app-button>
                  </div>
                  <div class="button-wrapper">
                    <app-button variant="highlight" size="sm" (onClick)="onEdit.emit(item)" title="Editar">
                      <i class="fas fa-edit"></i> Editar
                    </app-button>
                  </div>
                  <div class="button-wrapper">
                    <app-button variant="danger" size="sm" (onClick)="onDelete.emit(item)" title="Eliminar">
                      <i class="fas fa-trash"></i> Eliminar
                    </app-button>
                  </div>
                </div>
              </td>
            </tr>
          </ng-container>
          <ng-container *ngIf="!rowsTemplate && (items.length === 0 || displayedItems.length === 0)">
            <tr>
              <td [attr.colspan]="showActions ? columns.length + 1 : columns.length" class="empty-message empty-state">
                {{ emptyMessage }}
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>
    </div>
    
    <!-- Paginación -->
    <div *ngIf="enablePagination && items.length > 0" class="pagination">
      <div class="pagination-info">
        Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, items.length) }} de {{ items.length }} registros
      </div>
      <div class="pagination-controls">
        <button 
          class="pagination-button" 
          [class.disabled]="currentPage === 1" 
          (click)="changePage(1)" 
          [disabled]="currentPage === 1">
          «
        </button>
        <button 
          class="pagination-button" 
          [class.disabled]="currentPage === 1" 
          (click)="changePage(currentPage - 1)" 
          [disabled]="currentPage === 1">
          ‹
        </button>
        
        <ng-container *ngFor="let page of getPageNumbers()">
          <button 
            class="pagination-button" 
            [class.active]="page === currentPage" 
            (click)="changePage(page)">
            {{ page }}
          </button>
        </ng-container>
        
        <button 
          class="pagination-button" 
          [class.disabled]="currentPage === totalPages" 
          (click)="changePage(currentPage + 1)" 
          [disabled]="currentPage === totalPages">
          ›
        </button>
        <button 
          class="pagination-button" 
          [class.disabled]="currentPage === totalPages" 
          (click)="changePage(totalPages)" 
          [disabled]="currentPage === totalPages">
          »
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .table-container {
      width: 100%;
      box-shadow: 0 4px 12px rgba(40, 57, 89, 0.15);
      background-color: white;
      margin-bottom: 20px;
      /* Esto permite que los componentes que usan esta tabla puedan sobrescribir estos estilos */
      --table-border-radius: 12px;
      --table-header-bg: #283959;
      --table-header-color: white;
      --table-border-color: #04D9B2;
      /* Controlar ancho máximo para todas las tablas */
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      table-layout: fixed; /* Asegura que las columnas mantengan tamaños consistentes */
    }
    
    thead {
      background-color: var(--table-header-bg, #283959); /* Primary */
      color: var(--table-header-color, white);
      border-bottom: 3px solid var(--table-border-color, #04D9B2); /* Highlight color as border */
    }
    
    th {
      color: var(--table-header-color, white);
      padding: 16px 18px;
      text-align: center;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 0.9rem;
    }
    
    td {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(40, 57, 89, 0.1);
      color: #283959; /* Primary color para texto */
      transition: all 0.2s ease;
      text-align: center; /* Centrar texto por defecto */
      word-break: break-word; /* Manejar palabras largas */
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    tbody tr:hover td {
      background-color: rgba(90, 124, 191, 0.08); /* Background with a hint of secondary */
      box-shadow: inset 0 0 0 1px rgba(90, 124, 191, 0.1);
    }
    
    .actions-column {
      white-space: normal;
      width: 120px;
      text-align: center;
      padding: 10px 0;
      background-color: rgba(242, 242, 242, 0.3);
      vertical-align: middle;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    
    /* Estilos específicos para cuando showActions es false */
    :host.no-actions ::ng-deep table {
      /* Podemos ajustar el espaciado cuando no hay acciones */
      table-layout: fixed;
    }
    
    :host.no-actions ::ng-deep td {
      /* Permitir que el texto se ajuste mejor sin la columna de acciones */
      word-wrap: break-word;
    }
    
    /* Solo muestra la columna de acciones cuando showActions es true */
    .hidden-actions {
      display: none;
    }
    
    .actions-column app-button {
      margin: 0 auto !important;
      transform: scale(1);
      transition: transform 0.2s ease;
      width: 100% !important;
      display: block !important;
      text-align: center !important;
    }
    
    .actions-column app-button button {
      margin: 0 auto !important;
      text-align: center !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    
    .actions-column app-button:hover {
      transform: scale(1.05);
    }
    
    /* Estilo para filas alternadas */
    tr:nth-child(even) td {
      background-color: rgba(242, 242, 242, 0.5);
    }
    
    .actions-header {
      text-align: center !important;
      min-width: 120px;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    
    .actions-container {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      max-width: 110px !important;
      margin: 0 auto !important;
      gap: 10px !important;
    }
    
    .button-wrapper {
      display: flex !important;
      justify-content: center !important;
      width: 100% !important;
      max-width: 110px !important;
      margin: 2px auto !important;
    }
    
    tr:nth-child(even):hover td {
      background-color: rgba(90, 124, 191, 0.08);
      box-shadow: inset 0 0 0 1px rgba(90, 124, 191, 0.1);
    }
    
    .empty-message {
      text-align: center;
      padding: 40px 20px;
      color: #5A7CBF; /* Secondary */
      font-style: italic;
      font-weight: 500;
      background-color: rgba(242, 242, 242, 0.3);
      border-radius: 8px;
      margin: 20px 0;
    }
    
    /* Estilos para ordenación */
    .sortable-header {
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: background-color 0.2s;
    }
    
    .sortable-header:hover {
      background-color: rgba(40, 57, 89, 0.9);
    }
    
    .sort-icon {
      margin-left: 6px;
      font-size: 0.7rem;
      vertical-align: middle;
    }
    
    /* Estilos para paginación */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background-color: #F2F2F2;
      border-radius: 0 0 12px 12px;
      margin-top: -20px;
      border-top: 2px solid rgba(4, 217, 178, 0.3); /* Highlight color as border */
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }
    
    .pagination-info {
      font-size: 0.9rem;
      color: #283959;
    }
    
    .pagination-controls {
      display: flex;
      gap: 5px;
    }
    
    .pagination-button {
      background-color: white;
      border: 1px solid rgba(40, 57, 89, 0.2);
      color: #283959;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .pagination-button:hover:not(.disabled) {
      background-color: #5A7CBF;
      color: white;
    }
    
    .pagination-button.active {
      background-color: #04D9B2;
      color: white;
      border-color: #04D9B2;
    }
    
    .pagination-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class TableComponent implements OnChanges {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}
  @Input() items: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnDisplayNames: {[key: string]: string} = {};
  @Input() set showActions(value: boolean) {
    this._showActions = value;
    // Aplicar clase al host para permitir estilos específicos cuando no hay acciones
    if (value === false) {
      this.renderer.addClass(this.elementRef.nativeElement, 'no-actions');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'no-actions');
    }
  }
  
  get showActions(): boolean {
    return this._showActions;
  }
  
  private _showActions = true; // Valor predeterminado
  @Input() emptyMessage = 'No hay datos disponibles';
  @Input() enablePagination = true;
  @Input() pageSize = 10;
  @Input() initialSortColumn = '';
  @Input() initialSortDirection: 'asc' | 'desc' = 'asc';
  @Input() actionsColumnTitle = 'ACCIONES';
  
  @ContentChild('headerTemplate') headerTemplate: TemplateRef<any> | undefined;
  @ContentChild('rowsTemplate') rowsTemplate: TemplateRef<any> | undefined;
  
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() onPageChange = new EventEmitter<number>();
  
  // Propiedades para ordenación
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Propiedades para paginación
  displayedItems: any[] = [];
  currentPage = 1;
  totalPages = 1;
  Math = Math; // Para usar Math en el template
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      // Inicializar la ordenación si no está establecida y hay una columna inicial
      if (this.initialSortColumn && !this.sortColumn) {
        this.sortColumn = this.initialSortColumn;
        this.sortDirection = this.initialSortDirection;
        this.sortItems();
      } else {
        // Si ya hay una columna de ordenación, mantener el orden con los nuevos items
        if (this.sortColumn) {
          this.sortItems();
        } else {
          this.displayedItems = [...this.items];
        }
      }
      
      // Calcular el total de páginas
      this.totalPages = Math.max(1, Math.ceil(this.items.length / this.pageSize));
      
      // Asegurar que la página actual es válida
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
      
      // Actualizar los elementos mostrados
      this.updateDisplayedItems();
    }
  }
  
  getItemProperty(item: any, property: string): any {
    // Handle nested properties with dot notation (e.g., "adquisicion.tipoBienServicio")
    if (property.includes('.')) {
      const props = property.split('.');
      let value = item;
      
      for (const prop of props) {
        if (value && value[prop] !== undefined) {
          value = value[prop];
        } else {
          return '';
        }
      }
      
      return value;
    }
    
    return item[property] || '';
  }
  
  getDisplayName(column: string): string {
    return this.columnDisplayNames[column] || this.formatColumnName(column);
  }
  
  formatColumnName(column: string): string {
    // Convierte camelCase o snake_case a texto legible
    return column
      .replace(/([A-Z])/g, ' $1') // Inserta espacio antes de mayúsculas
      .replace(/_/g, ' ') // Reemplaza underscores con espacios
      .replace(/^./, str => str.toUpperCase()); // Primera letra en mayúscula
  }
  
  sort(column: string) {
    // Si se hace clic en la misma columna, cambia la dirección
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una columna diferente, establece como ascendente por defecto
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.onSort.emit({column: this.sortColumn, direction: this.sortDirection});
    this.sortItems();
    this.updateDisplayedItems();
  }
  
  sortItems() {
    if (!this.sortColumn) return;
    
    const sortedItems = [...this.items].sort((a, b) => {
      const valA = this.getItemProperty(a, this.sortColumn);
      const valB = this.getItemProperty(b, this.sortColumn);
      
      if (valA === valB) return 0;
      
      const comparison = valA < valB ? -1 : 1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.items = sortedItems;
    this.updateDisplayedItems();
  }
  
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    this.onPageChange.emit(page);
    this.updateDisplayedItems();
  }
  
  updateDisplayedItems() {
    if (!this.enablePagination) {
      this.displayedItems = [...this.items];
      return;
    }
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedItems = this.items.slice(start, end);
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la actual
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
      
      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
