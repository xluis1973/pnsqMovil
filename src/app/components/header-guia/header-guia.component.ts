import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AutorizaService } from '../../services/autoriza.service';

@Component({
  selector: 'app-header-guia',
  templateUrl: './header-guia.component.html',
  styleUrls: ['./header-guia.component.scss'],
})
export class HeaderGuiaComponent implements OnInit {

  @Input() titulo:string ='';
  @Input() escucha?:Subscription;
  constructor(private authServ:AutorizaService,private  navCrl:NavController) { }

  ngOnInit() {}

  async cerrarSesion(){
    console.log("Por cerrar ");
    await this.authServ.cerrarSesionGuia().then(resp=>{

        console.log("Cerrando ",this.escucha);
        if(this.escucha){
          //this.escucha.unsubscribe();

        }
        
        this.navCrl.navigateRoot('/',{animated:true});

    });

  }
}
