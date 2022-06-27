import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../../../services/alertas.service';
import { NavController } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/interfaces/interfaces';


import { AutorizaService } from 'src/app/services/autoriza.service';
import { Usuario } from '../../../interfaces/interfaces';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(private alertCrl:AlertasService,private navCtrl:NavController,
   private mensajesService:MensajesService , 
   private autorizaService:AutorizaService) { }
   private usuarioNombre:Usuario;

  ngOnInit() {
   
    this.usuarioNombre=this.autorizaService.obtenerNombreUsuarioLogueado();
    console.log("Nombre de usuario ",this.usuarioNombre);
    

  }

  auxilio(){
    const mensaje:Mensaje={
      identificador:this.usuarioNombre.identificador,
      mensaje: 'Médico',
      remitente: this.usuarioNombre.apellido+", "+this.usuarioNombre.nombre||'user',
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
     
    };
    this.preparandoMensaje(mensaje);
  } 
  policia(){
    const mensaje:Mensaje={
      identificador:this.usuarioNombre.identificador,
      mensaje: 'Policía',
      remitente: this.usuarioNombre.apellido+", "+this.usuarioNombre.nombre||'user',
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
    };
    this.preparandoMensaje(mensaje);
  }
  incendio(){
    
    const mensaje:Mensaje={
      identificador:this.usuarioNombre.identificador,
      mensaje: 'Incendio',
      remitente: this.usuarioNombre.apellido+", "+this.usuarioNombre.nombre||'user',
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'
    };

    this.preparandoMensaje(mensaje);
   

  }

  preparandoMensaje(mensaje:Mensaje){

    this.mensajesService.enviarMensaje(mensaje);

    this.alertCrl.presentAlert("Mensaje Enviado");
    this.navCtrl.navigateRoot('/guia',{animated:true});
   


  }
}
