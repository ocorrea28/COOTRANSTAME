export interface Ruta {
  id: number;
  origen: string;
  destino: string;
  duracion: number;
  tipo: string;
  fechaCreacion: Date;
}

export interface RutaCreateRequest {
  origen: string;
  destino: string;
  duracion: number;
  tipo: string;
}

export interface RutaUpdateRequest {
  id: number;
  origen: string;
  destino: string;
  duracion: number;
  tipo: string;
} 