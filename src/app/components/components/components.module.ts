import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderVisitaComponent } from '../header-visita/header-visita.component';



@NgModule({
  declarations: [HeaderVisitaComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[HeaderVisitaComponent]
})
export class ComponentsModule { }
