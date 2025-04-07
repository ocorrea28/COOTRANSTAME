export interface DocumentoAdquisicion {
  id?: number;
  adquisicionID: number;
  adquisicion?: any; // Adquisicion
  tipoDocumento: string;
  numeroDocumento: string;
  fechaDocumento: Date;
  archivo?: string;
}
