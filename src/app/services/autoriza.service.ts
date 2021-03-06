import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, getDocs, collection,setDoc,doc, query, where } from 'firebase/firestore';


import { Usuario, Visitante, Guia } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { getAuth, GoogleAuthProvider, SignInMethod, signInWithCredential, signOut } from 'firebase/auth';
import { UbicacionService } from './ubicacion.service';
import { UbicacionPage } from '../pages/visitante/ubicacion/ubicacion.page';
import { UbicacionPage as UbicacionPageGuia} from '../pages/guia/ubicacion/ubicacion.page';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {
private usuario:Usuario;
private _storage:Storage |null=null;
  constructor(private gp:GooglePlus, private AFAuth:AngularFireAuth,
    private toastCtrl:ToastController,private storage:Storage, private ubiSrv:UbicacionService) {
      this.init();
     }


     async init(){
       const storage=await this.storage.create();
       this._storage=storage;
     }


   loginConGoogle():Promise<any>{
    this.presentToast('antes');
    
    return new Promise(resolve=>{this.gp.login({
      //449724327328-073k2i13c7c8c429140c67srranm0d1e.apps.googleusercontent.com
    'webClientId': "449724327328-qp977ho2tah8j634s7g2q2obppfgp6oi.apps.googleusercontent.com" ,
    'offline': true
       }).then(async (resp)=>{
                this.usuario=resp;
                this.guardarToken(resp.accessToken);
                const googleCredential = GoogleAuthProvider.credential(resp.idToken);
                signInWithCredential(auth,googleCredential).then(user => {
                            console.log("Firebase success: " + JSON.stringify(user));
            
                        },(err) => {
                                        console.log("Error in doGoogleLogin " + err);
          
                        });
        resolve(resp);

  },err=>{
       console.log("Error ",err);
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

  async  guardarDatos(usuario:Usuario,visitante?:Visitante) {

    //console.log('Guardando');
  
    const usuarioCol=doc(db, "usuario", usuario.identificador );
   
    await setDoc(usuarioCol, usuario).catch((error)=>{
  
      console.log('Error al guardar Usuario ',error.message);
  
    });
if(visitante){
  visitante.ultimoIngreso=new Date();

  const visitanteCol=doc(db, "visitante", visitante.identificador );
  await setDoc(visitanteCol, visitante).catch((error)=>{
  
    //console.log('Error al guardar Visitante ',error.message);

  });

}
  
 
    
}

async obtenerUsuario(usuario:Usuario,visitante?:Visitante,guia?:Guia){
  //Obteniendo Usario
  console.log("Obteniendo datos del usuario");
  
  
  const usuarioCol = collection(db, 'usuario');

  const q = query(usuarioCol, where("identificador", "==", usuario.identificador));
  const usuarioSnapshot = await getDocs(q);
  
  const usuarioList = usuarioSnapshot.docs.map(doc => doc.data());
  
  usuarioList.forEach((user)=>{
    usuario.identificador=user.identificador;
    usuario.activo=true;
    usuario.apellido=user.apellido;
    usuario.ciudad=user.ciudad;
    usuario.domicilio=user.domicilio;
    usuario.nombre=user.nombre;
    usuario.telefono=user.telefono;
    //console.log("usuario ",user);
    this.usuario=usuario;
  
  });

  if(visitante){

    //Obteniendo visitante
  console.log("Obtener visitante");
  
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


  } else {

     //Obteniendo visitante
  console.log("Obtener Gu??a de Turismo");
  
  const guiaCol = collection(db, 'guia');

  const qGuia = query(guiaCol, where("identificador", "==", usuario.identificador));
  const guiaSnapshot = await getDocs(qGuia);
  
  
  const guiaList = guiaSnapshot.docs.map(doc => doc.data());
  guiaList.forEach((user)=>{
    guia.identificador=user.identificador;
    guia.usuario=user.usuario,
    guia.cuil=user.cuil,
    guia.nroHabiliatacion=user.nroHabiliatacion,
    guia.fHabilitacion=user.fHabilitacion,
    guia.vtoHabilitacion=user.vtoHabilitacion,
    guia.email=user.email,
    guia.password=user.password
    //console.log("visitante ",user);
  
  
  });


  }
  

  
}

obtenerNombreUsuarioLogueado():Usuario{
  console.log("Usuario Logueado");
  return this.usuario;
}

 cerrarSesion(){
  this.usuario.activo=false;
  UbicacionPage.ultimaLectura.identificador="..";
     this.guardarDatos(this.usuario);
     this.ubiSrv.guardarDatos(UbicacionPage.ultimaLectura);
  return this.gp.logout();
}

cerrarSesionGuia(){
 UbicacionPageGuia.salio=true;
  this.usuario.activo=false;
  UbicacionPageGuia.ultimaLectura.identificador="..";
   this.guardarDatos(this.usuario);
   console.log("Cambiando identificador ",UbicacionPageGuia.ultimaLectura);
  this.ubiSrv.guardarDatos(UbicacionPageGuia.ultimaLectura);
  return  signOut(auth);
}

}


