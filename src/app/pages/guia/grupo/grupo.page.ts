import { Component, OnInit } from '@angular/core';
import { GruposService } from '../../../services/grupos.service';
import { Usuario, Grupo } from '../../../interfaces/interfaces';
import { AutorizaService } from '../../../services/autoriza.service';


@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss'],
})
export class GrupoPage {

  
  constructor(private grupoSrv:GruposService, private autSrv:AutorizaService ) { }

  listaUsuarios:Usuario[]=[];
  grupo:Grupo={
    identificador:this.autSrv.obtenerNombreUsuarioLogueado().identificador,
    fechaCreacion:new Date(),
    recorrido:"farallones",
    guiaResponsable:this.autSrv.obtenerNombreUsuarioLogueado().identificador,
    visitantes:[],
    activo:true}


    crearGrupoV:boolean=false;
    desarmarGrupoV:boolean=false;
    grupoGuardado:boolean=false;
    

  async ionViewWillEnter() {
    this.grupo=await this.grupoSrv.grupoActivo(this.grupo);
    //Paso el id del guía responsable.
    //await this.grupoSrv.activosDeEsteGrupo("2222");
    if(this.grupo.visitantes.length>0){
      this.desarmarGrupoV=true;
      this.crearGrupoV=false;
      this.grupoGuardado=true;
      this.marcarUsuariosDeEsteGrupo();
    }
    this.listaUsuarios.splice(0, this.listaUsuarios.length);
    this.listaUsuarios= await this.grupoSrv.obtenerVisitantes(this.autSrv.obtenerNombreUsuarioLogueado().identificador,this.desarmarGrupoV);
    this.listaUsuarios.forEach(elem=>{if(elem.ciudad!='success'){elem.ciudad='primary';}});
   
  }
  marcarUsuariosDeEsteGrupo() {
    this.listaUsuarios.forEach(elem=>{elem.ciudad='success';});
  }

  cambiaColor(indice:number){

    if(!this.grupoGuardado){

      console.log("indice ",indice);
      console.log(this.listaUsuarios);
      if(this.listaUsuarios[indice].ciudad=='primary'){
        this.listaUsuarios[indice].ciudad='success'
      }else {this.listaUsuarios[indice].ciudad='primary'}
  
      this.grupo.visitantes=[];
      this.listaUsuarios.forEach(user=>{
        if(user.ciudad=='success'){
          this.grupo.visitantes.push(user.identificador);
        }
      });
      console.log("Grupo Armado",this.grupo);
      if(this.grupo.visitantes.length>0){
        this.crearGrupoV=true;
      }
     

    }
  
  }

  crearGrupo(){
    this.desarmarGrupoV=true;
    this.crearGrupoV=false;
    this.grupoGuardado=true;
    this.grupoSrv.crearGrupo(this.grupo).then((resp)=>{
      console.log("Grupo Guardado",resp);
    }
    ).catch((err)=>{console.log(err)}  );
}
  desarmarGrupo(){
    this.desarmarGrupoV=false;
    this.crearGrupoV=true;
    this.grupoGuardado=false;
    this.grupo.visitantes=[];
    this.grupoSrv.desarmarGrupo(this.grupo).then((resp)=>{
      console.log("Grupo Desarmado",resp);
    });

  }
  triggerEvent(evento){
    console.log("Hizo clic "+evento.target.value);
    this.grupo.recorrido=evento.target.value;
  }
}
