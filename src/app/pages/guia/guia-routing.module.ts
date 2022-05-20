import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiaPage } from './guia.page';

const routes: Routes = [
  {
    path: '',
    component: GuiaPage,
    children: [
      {
        path: 'ubicacion',
        children: [
          {
            path: '',
            
            loadChildren: () => import('./ubicacion/ubicacion.module').then( m => m.UbicacionPageModule)
          }
        ]
      },{
        path: 'grupo',
        children: [
          {
            path: '',
            
            loadChildren: () => import('./grupo/grupo.module').then( m => m.GrupoPageModule)
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
        redirectTo: '/guia/ubicacion',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'grupo',
    loadChildren: () => import('./grupo/grupo.module').then( m => m.GrupoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiaPageRoutingModule {}
