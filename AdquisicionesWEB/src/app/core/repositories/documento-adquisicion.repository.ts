import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoAdquisicion } from '../models/documento-adquisicion.model';
import { DocumentoAdquisicionDTO } from '../dtos/documento-adquisicion.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoAdquisicionRepository {
  private apiUrl = `${environment.apiUrl}/api/DocumentosAdquisicion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocumentoAdquisicion[]> {
    return this.http.get<DocumentoAdquisicion[]>(this.apiUrl);
  }

  getById(id: number): Observable<DocumentoAdquisicion> {
    return this.http.get<DocumentoAdquisicion>(`${this.apiUrl}/${id}`);
  }

  getByAdquisicionId(adquisicionId: number): Observable<DocumentoAdquisicion[]> {
    return this.http.get<DocumentoAdquisicion[]>(`${this.apiUrl}/ByAdquisicion/${adquisicionId}`);
  }

  create(documentoAdquisicion: DocumentoAdquisicion): Observable<DocumentoAdquisicion> {
    // Convert to DTO for the Simple endpoint
    const documentoDTO: DocumentoAdquisicionDTO = {
      adquisicionID: documentoAdquisicion.adquisicionID,
      tipoDocumento: documentoAdquisicion.tipoDocumento,
      numeroDocumento: documentoAdquisicion.numeroDocumento,
      fechaDocumento: documentoAdquisicion.fechaDocumento,
      archivo: documentoAdquisicion.archivo
    };
    
    return this.http.post<DocumentoAdquisicion>(`${this.apiUrl}/Simple`, documentoDTO);
  }

  update(id: number, documentoAdquisicion: DocumentoAdquisicion): Observable<void> {
    // Convertir a DTO para evitar referencias circulares
    const documentoDTO: DocumentoAdquisicionDTO = {
      id: documentoAdquisicion.id,
      adquisicionID: documentoAdquisicion.adquisicionID,
      tipoDocumento: documentoAdquisicion.tipoDocumento,
      numeroDocumento: documentoAdquisicion.numeroDocumento,
      fechaDocumento: documentoAdquisicion.fechaDocumento,
      archivo: documentoAdquisicion.archivo
    };
    
    // Intentar usar el endpoint Simple para actualización
    return this.http.put<void>(`${this.apiUrl}/${id}/Simple`, documentoDTO);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza un documento de adquisición usando el endpoint Simple
   * @param id ID del documento a actualizar
   * @param documentoAdquisicion Documento de adquisición a actualizar
   * @returns Observable de tipo void
   */
  updateDocumentoSimple(id: number, documentoAdquisicion: DocumentoAdquisicion): Observable<void> {
    // Convertir a DTO para evitar referencias circulares
    const documentoDTO: DocumentoAdquisicionDTO = {
      id: documentoAdquisicion.id,
      adquisicionID: documentoAdquisicion.adquisicionID,
      tipoDocumento: documentoAdquisicion.tipoDocumento,
      numeroDocumento: documentoAdquisicion.numeroDocumento,
      fechaDocumento: documentoAdquisicion.fechaDocumento,
      archivo: documentoAdquisicion.archivo
    };
    
    // Usar el endpoint dinámico con el ID proporcionado
    return this.http.put<void>(`${this.apiUrl}/${id}/Simple`, documentoDTO);
  }
}
