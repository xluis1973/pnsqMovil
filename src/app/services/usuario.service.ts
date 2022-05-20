import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection, getDocs, setDoc,doc, query, where } from 'firebase/firestore';

import { Guia, Usuario } from '../interfaces/interfaces';


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  guia:Guia;
  constructor() { }

 async login(email:string,password:string):Promise<string>{

          
  return new Promise(resolve=>{

    signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            
            console.log(user);
            console.log(this.usuario);
            resolve(user.uid);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            resolve(null);
          });


  });
 }

 obtenerNombreUsuarioLogueado():string{
  console.log(auth.currentUser);
  return auth.currentUser.displayName
}

async obtenerUsuario(idUser:string){
  //Obteniendo Usario
  console.log("Obteniendo datos del usuario");
  
  
  const usuarioCol = collection(db, 'usuario');

  const q = query(usuarioCol, where("identificador", "==", idUser));
  const usuarioSnapshot = await getDocs(q);
  
  const usuarioList = usuarioSnapshot.docs.map(doc => doc.data());
  
  usuarioList.forEach((user)=>{
     
    this.usuario.identificador=user.identificador;
    this.usuario.activo=user.activo;
    this.usuario.apellido=user.apellido;
    this.usuario.ciudad=user.ciudad;
    this.usuario.domicilio=user.domicilio;
    this.usuario.nombre=user.nombre;
    this.usuario.telefono=user.telefono;
    //console.log("usuario ",user);
    
  
  });

}


}