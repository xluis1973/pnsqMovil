import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajesPageRoutingModule } from './mensajes-routing.module';

import { MensajesPage } from './mensajes.page';
import { ComponentsModule } from '../../../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MensajesPageRoutingModule
  ],
  declarations: [MensajesPage]
})
export class MensajesPageModule {}
