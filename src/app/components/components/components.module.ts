import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderVisitaComponent } from '../header-visita/header-visita.component';
import { HeaderGuiaComponent } from '../header-guia/header-guia.component';



@NgModule({
  declarations: [HeaderVisitaComponent,HeaderGuiaComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[HeaderVisitaComponent,HeaderGuiaComponent]
})
export class ComponentsModule { }
