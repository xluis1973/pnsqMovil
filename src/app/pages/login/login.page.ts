import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AutorizaService } from '../../services/autoriza.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private res:boolean;

 

  loginUser={
    email:'luis@mercado.com',
    password:'123456'
  };
  constructor(private  navCrl:NavController,private userServ:UsuarioService,
     private alertasService:AlertasService, private athSrv:AutorizaService,
     private route:Router) { }

  ngOnInit() {
  }

  async login(flogin:NgForm){
     if(flogin.invalid){
       return;
     }else {
       this.res= await this.userServ.login(this.loginUser.email,this.loginUser.password);
       if(this.res){

                this.navCrl.navigateRoot('/guia',{animated:true});
                

       }else {
         this.alertasService.presentAlert("Usuario y/contraseña incorrecta");
       }
      
     }
     
      
     
   
  }

  loginGoogle(){
       this.athSrv.loginConGoogle().then(resp=>{


        console.log("lectura ",resp);
        const navigationExtras:NavigationExtras={
          queryParams: {
            identificador: resp.userId,
            apellido: resp.familyName,
            nombre: resp.givenName
          }
        };
         //this.navCrl.navigateRoot('/perfil',{animated:true});
        
         this.route.navigate(['perfil'],navigationExtras);
         
         
         
         
       });
  }

}
