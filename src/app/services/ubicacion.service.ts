import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection, getDocs, setDoc,doc } from 'firebase/firestore';
import { Ubicacion } from '../interfaces/interfaces';
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
private ubicacion:Ubicacion;
  constructor() { }


async  guardarDatos(localizacion:Ubicacion) {

  console.log('Guardando');

  const ubicacionCol=doc(db, "ubicacion", localizacion.usuario );
  await setDoc(ubicacionCol, localizacion).catch((error)=>{

    console.log('Error al guardar ',error.message);

  });
} 
} 