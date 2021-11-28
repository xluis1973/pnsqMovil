import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {

  constructor(private gp:GooglePlus, private AFAuth:AngularFireAuth,private toastCtrl:ToastController) { }


  loginConGoogle(){
    this.presentToast('antes');
   return this.gp.login({
    'webClientId': "449724327328-qp977ho2tah8j634s7g2q2obppfgp6oi.apps.googleusercontent.com" ,
    'offline': true
  });
}
  async presentToast(mensaje:string) {
    const toast = await this.toastCtrl.create({
      message: 'Saliendo '+mensaje,
      duration: 2000
    });
    toast.present();
    
  }

  
}
