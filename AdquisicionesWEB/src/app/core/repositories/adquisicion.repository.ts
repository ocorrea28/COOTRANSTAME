import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Adquisicion } from '../models/adquisicion.model';
import { AdquisicionDTO } from '../dtos/adquisicion.dto';
import { environment } from '../../../environments/environment';
import { UnidadAdministrativa } from '../models/unidad-administrativa.model';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class AdquisicionRepository {
  private apiUrl = `${environment.apiUrl}/api/Adquisiciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Adquisicion[]> {
    return this.http.get<Adquisicion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Adquisicion> {
    return this.http.get<Adquisicion>(`${this.apiUrl}/${id}`);
  }

  create(adquisicion: Adquisicion): Observable<Adquisicion> {
    // Convert to DTO for the Simple endpoint
    const adquisicionDTO: AdquisicionDTO = {
      presupuesto: adquisicion.presupuesto,
      unidadID: adquisicion.unidadID,
      tipoBienServicio: adquisicion.tipoBienServicio,
      cantidad: adquisicion.cantidad,
      valorUnitario: adquisicion.valorUnitario,
      valorTotal: adquisicion.valorTotal,
      fechaAdquisicion: adquisicion.fechaAdquisicion,
      proveedorID: adquisicion.proveedorID,
      documentacion: adquisicion.documentacion,
      estado: adquisicion.estado
    };
    
    return this.http.post<Adquisicion>(`${this.apiUrl}/Simple`, adquisicionDTO);
  }

  update(id: number, adquisicion: Adquisicion): Observable<void> {
    // Usando el nuevo endpoint Simple para actualizaciones
    // Este endpoint maneja la complejidad de las relaciones en el backend
    const adquisicionDTO = {
      presupuesto: adquisicion.presupuesto,
      unidadID: adquisicion.unidadID,
      tipoBienServicio: adquisicion.tipoBienServicio,
      cantidad: adquisicion.cantidad,
      valorUnitario: adquisicion.valorUnitario,
      valorTotal: adquisicion.valorTotal,
      fechaAdquisicion: adquisicion.fechaAdquisicion,
      proveedorID: adquisicion.proveedorID,
      documentacion: adquisicion.documentacion || '',
      estado: adquisicion.estado || 'Activo'
    };
    
    console.log('Enviando DTO para actualización:', adquisicionDTO);
    return this.http.put<void>(`${this.apiUrl}/${id}/Simple`, adquisicionDTO);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filter(query: string): Observable<Adquisicion[]> {
    return this.http.get<Adquisicion[]>(`${this.apiUrl}/Filter?filter=${query}`);
  }
}