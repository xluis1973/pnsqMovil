import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {

  constructor(private gp:GooglePlus, private AFAuth:AngularFireAuth,private toastCtrl:ToastController) { }


  loginConGoogle(){
    this.presentToast('antes');
   return this.gp.login({}).then(resp=>{
  
       this.presentToast(resp.accessToken);
       console.log("respuesta",resp);
       //return this.AFAuth.signInWithEmailAndPassword("lmercado@ulp.edu.ar","Gonza1973");
       return this.AFAuth.signInWithCustomToken(resp.accessToken);
       
    }).catch(err=>this.presentToast(err));
  }
  async presentToast(mensaje:string) {
    const toast = await this.toastCtrl.create({
      message: 'Saliendo '+mensaje,
      duration: 2000
    });
    toast.present();
  }
}
