import { EventEmitter, Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, getDocs, collection,setDoc,doc, query, where, orderBy } from 'firebase/firestore/lite';
import { Publicacion } from '../interfaces/interfaces';
import { INotificationPayload } from 'cordova-plugin-fcm-with-dependecy-updated/typings/INotificationPayload';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class PublicarService {

  publicaciones:Publicacion[]=[];
  publishListener= new EventEmitter<INotificationPayload>();



  constructor(private fcm:FCM) { }

  notificacionesPush(){


   this.fcm.getToken().then(token => {
      console.log("Token ", token);
    });
    
    this.fcm.onNotification().subscribe((data)=>{

      console.log(data);
      
    if (data.wasTapped) {

      console.log('Received in background');
      this.publishListener.emit(data);

    } else {

      console.log('Received in foreground');
      this.publishListener.emit(data);

    }
    });
    this.fcm.subscribeToTopic("topicExample").then((data)=>{

      console.log('Topico Recibido.');
    });
    
   }

   async obtenerPublicaciones():Promise<Publicacion[]>{
    this.publicaciones=[];
    const publicacionCol = collection(db, 'publicacion');

    const q = query(publicacionCol,orderBy("fechaCreacion","desc"));
    const publicacionSnapshot = await getDocs(q);
    
    const publicacionList = publicacionSnapshot.docs.map(doc => doc.data());
    
    publicacionList.forEach((publi)=>{

      let publ:Publicacion=publi as Publicacion;
     
      this.publicaciones.push(publ);
      
      
      
    
    });
    console.log("publicaciones ",this.publicaciones);
    return this.publicaciones;
   }

   async obtenerUltimaPublicacion():Promise<Publicacion>{
    let publicacion:Publicacion=null;
    const publicacionCol = collection(db, 'publicacion');

    const q = query(publicacionCol,orderBy("fechaCreacion","desc"));
    const publicacionSnapshot = await getDocs(q);
    
    const publicacionList = publicacionSnapshot.docs.map(doc => doc.data());
    if(publicacionList){
      publicacion=publicacionList[0] as Publicacion;
     
    }
    
    
      console.log("publicaciones ",publicacion);
      
    
    
    
    return publicacion;
   }
}
