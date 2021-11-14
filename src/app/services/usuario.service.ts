import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection, getDocs, setDoc,doc } from 'firebase/firestore/lite';
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

 async login(email:string,password:string):Promise<boolean>{

          
  return new Promise(resolve=>{

    signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            resolve(true);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            resolve(false);
          });


  });
 }
}
