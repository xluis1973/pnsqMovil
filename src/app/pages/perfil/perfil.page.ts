import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Usuario, Visitante } from 'src/app/interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { PublicarService } from 'src/app/services/publicar.service';
import { Guia } from '../../interfaces/interfaces';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, AfterViewInit {

  botonDesactivado=true;
  usuario:Usuario={
    identificador:"",
    apellido: "",
    nombre:"",
    domicilio:"",
    ciudad: "",
    telefono:"",
    activo:true
  }
  visitante:Visitante={
    identificador:"",
    pais:"Argentina",
    provincia:"San Luis",
    usuario:""


  };
  guia:Guia={
    identificador:"",
    usuario:"",
    cuil:"",
    nroHabiliatacion:-1,
    fHabilitacion:null,
    vtoHabilitacion:null,
    email:"",
    password:""
  }
  constructor(private navCtrl:NavController, private activatedRoute:ActivatedRoute, 
    private autorizaService:AutorizaService, private publicarSrv:PublicarService) { }
  ngAfterViewInit(): void {
    //this.autorizaService.obtenerUsuario(this.usuario, this.visitante);
    this.publicarSrv.notificacionesPush();
  }

  async ngOnInit() 
{
  
  this.activatedRoute.queryParams.subscribe(
    param=>{
      this.usuario.identificador=param.identificador;
      this.usuario.apellido=param.apellido;
      this.usuario.nombre=param.nombre;
      this.visitante.identificador=this.usuario.identificador;
      this.visitante.usuario=this.usuario.identificador;
     
    }
  );

if(this.usuario.apellido=="guia"){

  await this.autorizaService.obtenerUsuario(this.usuario, null,this.guia);

} else {

  await this.autorizaService.obtenerUsuario(this.usuario, this.visitante,null);

}

  

  this.botonDesactivado=false;
 
 

  }
  
confirmar(formulario){

  

  this.autorizaService.guardarDatos(this.usuario,this.visitante);
  this.navCtrl.navigateRoot("/visitante",{animated:true});

}
}
