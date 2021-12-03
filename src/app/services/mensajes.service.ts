import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, getDocs, collection,setDoc,doc, query, where, getDoc, addDoc } from 'firebase/firestore/lite';
import { Mensaje } from '../interfaces/interfaces';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }


  async  enviarMensaje(mensaje:Mensaje) {

    console.log('Guardando');
  
    // De esta forma guarda un documento cuyo id es random
    const col=collection(db,"mensaje");
    
    await addDoc(col,mensaje).catch((error)=>{
  
      console.log('Error al guardar Usuario ',error.message);
  
    });

    
  
    
}
}
