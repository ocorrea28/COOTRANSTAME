export interface Adquisicion {
  id?: number;
  presupuesto: number;
  unidadID: number;
  unidadAdministrativa?: any; // UnidadAdministrativa
  tipoBienServicio: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
  fechaAdquisicion: Date;
  proveedorID: number;
  proveedor?: any; // Proveedor
  documentacion?: string;
  estado: string;
  fechaCreacion: Date;
  fechaDesactivacion?: Date;
  historial?: any[]; // HistorialAdquisicion[]
  documentos?: any[]; // DocumentoAdquisicion[]
}