export interface DocumentoAdquisicionDTO {
  id?: number;
  adquisicionID: number;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaDocumento: Date;
  archivo?: string;
}
