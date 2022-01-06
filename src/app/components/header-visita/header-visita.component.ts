import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AutorizaService } from '../../services/autoriza.service';

@Component({
  selector: 'app-header-visita',
  templateUrl: './header-visita.component.html',
  styleUrls: ['./header-visita.component.scss'],
})
export class HeaderVisitaComponent implements OnInit {

  @Input() titulo:string ='';
  constructor(private authServ:AutorizaService,private  navCrl:NavController) { }

  ngOnInit() {}

  async cerrarSesion(){
    console.log("Por cerrar ");
    await this.authServ.cerrarSesion().then(resp=>{

        console.log("Cerrando ",resp);
        this.navCrl.navigateRoot('/',{animated:true});

    });

  }
}
