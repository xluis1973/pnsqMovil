import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection, query,getDocs, setDoc,doc,where, onSnapshot } from 'firebase/firestore';
import { Ubicacion } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { GrupoPage } from '../pages/guia/grupo/grupo.page';
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  private listaUbicaciones:Ubicacion[]=[];
  constructor() { }

  private observaUbicaciones= new Observable<Ubicacion[]>(observe=>{

    const ubicacionCol=collection(db,'ubicacion');
    const q=query(ubicacionCol,where("usuario","in",GrupoPage.visitantesActivos));
    const ubicacionSnapshot= onSnapshot(q,algo=>{

      algo.docChanges().forEach(ubi=>{

        if(ubi.type==='added'){
          console.log("Lectura ",ubi);
          
            this.listaUbicaciones.push(ubi.doc.data() as Ubicacion);
            observe.next(this.listaUbicaciones);
        }
        if(ubi.type==='modified'){

          const indice=this.buscarElemento(ubi.doc.data().usuario);
          if(indice!=-1){
            console.log("Lectura ",ubi);
            this.listaUbicaciones[indice]=ubi.doc.data() as Ubicacion;
            observe.next(this.listaUbicaciones);
          }
        }

      });
    });




  });

  buscarElemento(buscar:string):number{

    let indice:number=-1;
    indice=this.listaUbicaciones.findIndex((elemento,indicie)=>{

      if(elemento.usuario===buscar){
        return true;
      }
    });
    return indice;
  }
  leerUbicaciones(){
    return this.observaUbicaciones;
  }
}
