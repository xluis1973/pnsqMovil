import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { getAuth  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, getDocs, collection,setDoc,doc, query, where } from 'firebase/firestore/lite';


import {  Usuario, Visitante } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {

private _storage:Storage |null=null;
  constructor(private gp:GooglePlus, private AFAuth:AngularFireAuth,
    private toastCtrl:ToastController,private storage:Storage) {
      this.init();
     }


     async init(){
       const storage=await this.storage.create();
       this._storage=storage;
     }


  loginConGoogle():Promise<any>{
    this.presentToast('antes');
    return new Promise(resolve=>{this.gp.login({
    'webClientId': "449724327328-qp977ho2tah8j634s7g2q2obppfgp6oi.apps.googleusercontent.com" ,
    'offline': true
       }).then(resp=>{
         

        this.guardarToken(resp.accessToken);
        resolve(resp);

  });

});

  }

  async guardarToken(token:string){

    await this._storage?.set('token',token);
    console.log("Token guardado ",token);
  }

  async obtenerToken():Promise<string>{
    const token:string=await this._storage.get('token')||null;
    return new Promise(resolve=>{
      resolve(token);
    });
  }
  async presentToast(mensaje:string) {
    const toast = await this.toastCtrl.create({
      message: 'Saliendo '+mensaje,
      duration: 2000
    });
    toast.present();
    
  }

  async  guardarDatos(usuario:Usuario,visitante:Visitante) {

    //console.log('Guardando');
  
    const usuarioCol=doc(db, "usuario", usuario.identificador );
    const visitanteCol=doc(db, "visitante", visitante.identificador );
    await setDoc(usuarioCol, usuario).catch((error)=>{
  
      console.log('Error al guardar Usuario ',error.message);
  
    });

    await setDoc(visitanteCol, visitante).catch((error)=>{
  
      //console.log('Error al guardar Visitante ',error.message);
  
    });
 
    
}

async obtenerUsuario(usuario:Usuario,visitante:Visitante){
  //Obteniendo Usario
  
  const usuarioCol = collection(db, 'usuario');

  const q = query(usuarioCol, where("identificador", "==", usuario.identificador));
  const usuarioSnapshot = await getDocs(q);
  
  const usuarioList = usuarioSnapshot.docs.map(doc => doc.data());
  
  usuarioList.forEach((user)=>{
    usuario.identificador=user.identificador;
    usuario.activo=user.activo;
    usuario.apellido=user.apellido;
    usuario.ciudad=user.ciudad;
    usuario.domicilio=user.domicilio;
    usuario.nombre=user.nombre;
    usuario.telefono=user.telefono;
    //console.log("usuario ",user);
    
  
  });

  //Obteniendo visitante
  const visitanteCol = collection(db, 'visitante');

  const qVisitante = query(visitanteCol, where("identificador", "==", usuario.identificador));
  const visitanteSnapshot = await getDocs(qVisitante);
  
  
  const visitanteList = visitanteSnapshot.docs.map(doc => doc.data());
  visitanteList.forEach((user)=>{
    visitante.identificador=user.identificador;
    visitante.pais=user.pais;
    visitante.provincia=user.provincia;
    visitante.usuario=user.usuario;
    //console.log("visitante ",user);
  
  
  });

  
}

}


