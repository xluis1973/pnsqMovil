import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

@Injectable({
  providedIn: 'root'
})
export class PublicarService {

  constructor(private fcm:FCM) { }

  notificacionesPush(){


   this.fcm.getToken().then(token => {
      console.log("Token ", token);
    });
    
    this.fcm.onNotification().subscribe((data)=>{

      console.log(data);
      
    if (data.wasTapped) {

      console.log('Received in background');

    } else {

      console.log('Received in foreground');

    }
    });
    this.fcm.subscribeToTopic("topicExample").then((data)=>{

      console.log('Topico Recibido.');
    });
    
   }
}
