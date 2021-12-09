import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../../../services/alertas.service';
import { NavController } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/interfaces/interfaces';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(private alertCrl:AlertasService,private navCtrl:NavController,
   private mensajesService:MensajesService ) { }

  ngOnInit() {
   
  }

  auxilio(){} 
  policia(){}
  incendio(){
    
    const mensaje:Mensaje={
      identificador:'',
      mensaje: 'Incendio',
      remitente: 'va el id del usuario logueado',
      fechaEnvio: new Date(), 
      ultimaUbicacion: 'id de la ultima ubicación de este usuario'


    };
    this.mensajesService.enviarMensaje(mensaje);

    this.alertCrl.presentAlert("Mensaje Enviado");
    this.navCtrl.navigateRoot('/visitante',{animated:true});
   

  }
}
