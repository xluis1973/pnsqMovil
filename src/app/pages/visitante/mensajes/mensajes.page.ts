import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../../../services/alertas.service';
import { NavController } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/interfaces/interfaces';


import { AutorizaService } from 'src/app/services/autoriza.service';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(private alertCrl:AlertasService,private navCtrl:NavController,
   private mensajesService:MensajesService , 
   private autorizaService:AutorizaService) { }
   private usuarioNombre:string;

  ngOnInit() {
   
    this.usuarioNombre=this.autorizaService.obtenerNombreUsuarioLogueado().displayName;
    console.log("Nombre de usuario ",this.usuarioNombre);
    

  }

  auxilio(){
    const mensaje:Mensaje={
      identificador:'',
      mensaje: 'Médico',
      remitente: this.usuarioNombre,
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
     
    };
    this.preparandoMensaje(mensaje);
  } 
  policia(){
    const mensaje:Mensaje={
      identificador:'',
      mensaje: 'Policía',
      remitente: this.usuarioNombre,
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
    };
    this.preparandoMensaje(mensaje);
  }
  incendio(){
    
    const mensaje:Mensaje={
      identificador:'',
      mensaje: 'Incendio',
      remitente: this.usuarioNombre,
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
    };

    this.preparandoMensaje(mensaje);
   

  }

  preparandoMensaje(mensaje:Mensaje){

    this.mensajesService.enviarMensaje(mensaje);

    this.alertCrl.presentAlert("Mensaje Enviado");
    this.navCtrl.navigateRoot('/visitante',{animated:true});
   


  }
}
