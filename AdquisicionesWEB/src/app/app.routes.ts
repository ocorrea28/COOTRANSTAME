import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/rutas',
    pathMatch: 'full'
  },
  {
    path: 'rutas',
    loadComponent: () => import('./features/rutas/components/ruta-list.component').then(c => c.RutaListComponent)
  },
  {
    path: '**',
    redirectTo: '/rutas'
  }
];