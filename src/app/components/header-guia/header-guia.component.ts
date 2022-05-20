import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AutorizaService } from '../../services/autoriza.service';

@Component({
  selector: 'app-header-guia',
  templateUrl: './header-guia.component.html',
  styleUrls: ['./header-guia.component.scss'],
})
export class HeaderGuiaComponent implements OnInit {

  @Input() titulo:string ='';
  constructor(private authServ:AutorizaService,private  navCrl:NavController) { }

  ngOnInit() {}

  async cerrarSesion(){
    console.log("Por cerrar ");
    await this.authServ.cerrarSesionGuia().then(resp=>{

        console.log("Cerrando ",resp);
        this.navCrl.navigateRoot('/',{animated:true});

    });

  }
}
