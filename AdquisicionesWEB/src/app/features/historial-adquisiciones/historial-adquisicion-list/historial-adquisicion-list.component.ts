import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialAdquisicion } from '../../../core/models/historial-adquisicion.model';
import { HistorialAdquisicionRepository } from '../../../core/repositories/historial-adquisicion.repository';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/components/ui/page-layout/page-layout.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';

@Component({
  selector: 'app-historial-adquisicion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PageLayoutComponent],
  template: `
    <app-page-layout title="Historial de Adquisiciones">
      <div actions *ngIf="adquisicionId">
        <div class="badge">
          Filtrado por Adquisición ID: {{ adquisicionId }}
        </div>
      </div>
      
      <app-table 
        [items]="historialItems" 
        [columns]="['fechaModificacion', 'camposModificados', 'adquisicion.tipoBienServicio']" 
        [columnDisplayNames]="{
          'fechaModificacion': 'FECHA DE MODIFICACIÓN',
          'camposModificados': 'CAMPOS MODIFICADOS',
          'adquisicion.tipoBienServicio': 'ADQUISICIÓN'
        }"
        [showActions]="false"
        [enablePagination]="true"
        [pageSize]="10"
        [initialSortColumn]="'fechaModificacion'"
        [emptyMessage]="'No hay registros de historial disponibles'">
        
        <!-- Template personalizado para las filas -->
        <ng-template #rowsTemplate let-items="items">
          <tr *ngFor="let item of items">
            <td style="text-align: center">{{ item.fechaModificacion | date:'dd/MM/yyyy HH:mm:ss' }}</td>
            <td style="text-align: center" class="campos-modificados">{{ item.camposModificados }}</td>
            <td style="text-align: center">{{ item.adquisicion?.tipoBienServicio || 'N/A' }}</td>
          </tr>
        </ng-template>
      </app-table>
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
    
    /* Estilos para asegurar consistencia con la tabla de documentos */
    
    /* Estilos para la tabla */
    :host ::ng-deep .table-container {
      margin-top: 20px;
      padding: 0;
      box-shadow: none;
      border: none;
      background-color: transparent;
      max-width: 1200px; /* Mismo ancho máximo que en documentos */
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Estilo para el encabezado de la tabla */
    :host ::ng-deep thead {
      background-color: #283959;
      color: white;
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
      text-align: center;
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
    
    /* Estilo para los campos modificados */
    .campos-modificados {
      font-family: monospace;
      overflow-wrap: break-word;
      max-width: 400px;
      white-space: normal;
      word-break: break-word;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .campos-modificados {
        max-width: 250px;
      }
    }
  `]
})
export class HistorialAdquisicionListComponent implements OnInit {
  historialItems: HistorialAdquisicion[] = [];
  adquisicionId?: number;

  constructor(
    private historialRepository: HistorialAdquisicionRepository,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if we're viewing history for a specific adquisicion
    this.route.params.subscribe(params => {
      if (params['adquisicionId']) {
        this.adquisicionId = +params['adquisicionId'];
        this.loadHistorialByAdquisicion(this.adquisicionId);
      } else {
        this.loadAllHistorial();
      }
    });
  }

  private loadAllHistorial(): void {
    this.historialRepository.getAll().subscribe({
      next: (data) => this.historialItems = data,
      error: (error) => console.error('Error cargando historial:', error)
    });
  }

  private loadHistorialByAdquisicion(adquisicionId: number): void {
    this.historialRepository.getByAdquisicionId(adquisicionId).subscribe({
      next: (data) => this.historialItems = data,
      error: (error) => console.error(`Error cargando historial para adquisición ${adquisicionId}:`, error)
    });
  }
}
