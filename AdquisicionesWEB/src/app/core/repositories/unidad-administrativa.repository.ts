import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadAdministrativa } from '../models/unidad-administrativa.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadAdministrativaRepository {
  private apiUrl = `${environment.apiUrl}/api/UnidadesAdministrativas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UnidadAdministrativa[]> {
    return this.http.get<UnidadAdministrativa[]>(this.apiUrl);
  }

  getById(id: number): Observable<UnidadAdministrativa> {
    return this.http.get<UnidadAdministrativa>(`${this.apiUrl}/${id}`);
  }

  create(unidadAdministrativa: UnidadAdministrativa): Observable<UnidadAdministrativa> {
    return this.http.post<UnidadAdministrativa>(this.apiUrl, unidadAdministrativa);
  }

  update(id: number, unidadAdministrativa: UnidadAdministrativa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, unidadAdministrativa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
