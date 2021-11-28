import { Component, OnInit } from '@angular/core';
import { Usuario, Visitante } from 'src/app/interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario:Usuario={
    identificador:"",
    apellido: "Sartoris",
    nombre:"Gabriela",
    domicilio:"Mod. 11 mz. 22 c.18",
    ciudad: "La Punta",
    telefono:"154851526",
    activo:true
  }
  visitante:Visitante={
    identificador:"",
    pais:"Argentina",
    provincia:"San Luis",
    usuario:""


  };
  constructor(private navCtrl:NavController, private activatedRoute:ActivatedRoute) { }

  ngOnInit() 
{
  this.activatedRoute.queryParams.subscribe(
    param=>{
      this.usuario.identificador=param.identificador;
      this.usuario.apellido=param.apellido;
      this.usuario.nombre=param.nombre;
     
    }
  );


  }
confirmar(formulario){
  this.navCtrl.navigateRoot("/visitante",{animated:true});

}
}
