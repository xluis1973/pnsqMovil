import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitantePageRoutingModule } from './visitante-routing.module';

import { VisitantePage } from './visitante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitantePageRoutingModule
  ],
  declarations: [VisitantePage]
})
export class VisitantePageModule {}
