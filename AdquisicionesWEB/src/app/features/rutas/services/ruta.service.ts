import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta, RutaCreateRequest, RutaUpdateRequest } from '../models/ruta.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private apiUrl = `${environment.apiUrl}/api/rutas`;

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl);
  }

  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.apiUrl}/${id}`);
  }

  getRutasCarga(duracionMinima?: number): Observable<Ruta[]> {
    let url = `${this.apiUrl}/carga`;
    if (duracionMinima) {
      url += `?duracionMinima=${duracionMinima}`;
    }
    return this.http.get<Ruta[]>(url);
  }

  createRuta(ruta: RutaCreateRequest): Observable<Ruta> {
    return this.http.post<Ruta>(this.apiUrl, ruta);
  }

  updateRuta(id: number, ruta: RutaUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ruta);
  }

  deleteRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 