import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../../../services/alertas.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(private alertCrl:AlertasService,private navCtrl:NavController) { }

  ngOnInit() {
  }

  incendio(){

    this.alertCrl.presentAlert("Mensaje Enviado");
    this.navCtrl.navigateRoot('/visitante',{animated:true});
  }
}
