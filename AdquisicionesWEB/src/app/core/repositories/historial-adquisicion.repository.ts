import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialAdquisicion } from '../models/historial-adquisicion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialAdquisicionRepository {
  private apiUrl = `${environment.apiUrl}/api/HistorialAdquisiciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistorialAdquisicion[]> {
    return this.http.get<HistorialAdquisicion[]>(this.apiUrl);
  }

  getById(id: number): Observable<HistorialAdquisicion> {
    return this.http.get<HistorialAdquisicion>(`${this.apiUrl}/${id}`);
  }

  getByAdquisicionId(adquisicionId: number): Observable<HistorialAdquisicion[]> {
    return this.http.get<HistorialAdquisicion[]>(`${this.apiUrl}/ByAdquisicion/${adquisicionId}`);
  }

  create(historialAdquisicion: HistorialAdquisicion): Observable<HistorialAdquisicion> {
    return this.http.post<HistorialAdquisicion>(this.apiUrl, historialAdquisicion);
  }

  update(id: number, historialAdquisicion: HistorialAdquisicion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, historialAdquisicion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
