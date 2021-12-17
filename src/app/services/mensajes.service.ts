import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, getDocs, collection,setDoc,doc, query, where, getDoc, addDoc } from 'firebase/firestore/lite';
import { Mensaje } from '../interfaces/interfaces';
import { AutorizaService } from './autoriza.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

const auth = getAuth();


const db = getFirestore(app);


@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor( private http:HttpClient) { }


  async  enviarMensaje(mensaje:Mensaje) {

    console.log('Guardando');
  
    // De esta forma guarda un documento cuyo id es random
    const col=collection(db,"mensaje");
    
    await addDoc(col,mensaje).catch((error)=>{
  
      console.log('Error al guardar Usuario ',error.message);
  
    });

    console.log("Por leer destinos");
    
   (await this.obtenerDestinatarios()).forEach(destino=>{

                 console.log("destinos ",destino);
                 this.enviarNotificacionAWeb(mensaje,destino);
   });

    
    
}

enviarNotificacionAWeb(mensaje:Mensaje,destino:string){

  const data ={
    notification:{
      title: mensaje.remitente,
      body:  mensaje.mensaje,
      sound: 'default',
      click_action: 'https://pnsq-1cd2f.web.app/', 
      icon: 'fcm_push_icon'
    },
    to: destino,
    priority: 'high'
  }
   const headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization':'key=AAAAaLWopaA:APA91bHC-ubI9ojxhcL-t-sudGv9EmX9bz7-RyGQ0J47_pVtjQO4ATRrNpoO3UYUwqOMbPjc5ZDupMfH5gqIFK_BBL6nMD48q_nqUvjwonRAyre0gy9i_b2jk9eakDF4_Uc2_4Wz23vd'
  
  });
  
  //const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //headers.set('Authorization','Bearer AAAAaLWopaA:APA91bHC-ubI9ojxhcL-t-sudGv9EmX9bz7-RyGQ0J47_pVtjQO4ATRrNpoO3UYUwqOMbPjc5ZDupMfH5gqIFK_BBL6nMD48q_nqUvjwonRAyre0gy9i_b2jk9eakDF4_Uc2_4Wz23vd');
  
  this.http.post("https://fcm.googleapis.com/fcm/send",data,{headers:headers,responseType:"text"})
  .subscribe(resp=>{
            console.log("Respuesta de envio ",resp);
  });
  


}
async obtenerDestinatarios():Promise<string[]>{
  let destinos:string[]=[];
  const grupoWeb = collection(db, 'grupoWeb');

  const q = query(grupoWeb);
  const grupoWebSnapshot = await getDocs(q);
  
  const deviceList = grupoWebSnapshot.docs.map(doc => doc.data());
  
  deviceList.forEach((device)=>{

    
   
    destinos.push(device.notification_key);
    
    
    
  
  });
  
  return destinos;
 }

}
