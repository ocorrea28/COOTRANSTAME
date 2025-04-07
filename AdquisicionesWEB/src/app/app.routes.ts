import { Routes } from '@angular/router';
import { AdquisicionListComponent } from './features/adquisiciones/adquisicion-list/adquisicion-list.component';
import { UnidadAdministrativaListComponent } from './features/unidades-administrativas/unidad-administrativa-list/unidad-administrativa-list.component';
import { ProveedorListComponent } from './features/proveedores/proveedor-list/proveedor-list.component';
import { HistorialAdquisicionListComponent } from './features/historial-adquisiciones/historial-adquisicion-list/historial-adquisicion-list.component';
import { DocumentoAdquisicionListComponent } from './features/documentos-adquisicion/documento-adquisicion-list/documento-adquisicion-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'adquisiciones', pathMatch: 'full' },
  { path: 'adquisiciones', component: AdquisicionListComponent },
  { path: 'unidades', component: UnidadAdministrativaListComponent },
  { path: 'proveedores', component: ProveedorListComponent },
  { path: 'historial', component: HistorialAdquisicionListComponent },
  { path: 'historial/:adquisicionId', component: HistorialAdquisicionListComponent },
  { path: 'documentos', component: DocumentoAdquisicionListComponent },
  { path: 'documentos/:adquisicionId', component: DocumentoAdquisicionListComponent }
];