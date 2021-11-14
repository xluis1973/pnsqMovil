import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitantePage } from './visitante.page';



const routes: Routes = [
  {
    path: '',
    component: VisitantePage,
    children: [
      {
        path: 'ubicacion',
        children: [
          {
            path: '',
            
            loadChildren: () => import('./ubicacion/ubicacion.module').then( m => m.UbicacionPageModule)
          }
        ]
      },
      {
        path: 'mensajes',
        children: [
          {
            path: '',
            
            loadChildren: () => import('./mensajes/mensajes.module').then( m => m.MensajesPageModule)
          }
        ]
      },{
        path: 'publicaciones',
        children: [
          {
            path: '',
            
            loadChildren: () => import('./publicaciones/publicaciones.module').then( m => m.PublicacionesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/visitante/ubicacion',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitantePageRoutingModule {}
