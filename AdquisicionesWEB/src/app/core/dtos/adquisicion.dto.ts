export interface AdquisicionDTO {
  id?: number;
  presupuesto: number;
  unidadID: number;
  tipoBienServicio: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
  fechaAdquisicion: Date;
  proveedorID: number;
  documentacion?: string;
  estado: string;
  fechaCreacion?: Date;
  fechaDesactivacion?: Date;
}
