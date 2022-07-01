import { Component, OnInit } from '@angular/core';
import { GruposService } from '../../../services/grupos.service';
import { Usuario, Grupo } from '../../../interfaces/interfaces';
import { AutorizaService } from '../../../services/autoriza.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss'],
})
export class GrupoPage {

  
  constructor(private grupoSrv:GruposService, private autSrv:AutorizaService,
    private alertController: AlertController ) { }

  listaUsuarios:Usuario[]=[];
  fecha:String;
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
    

   ionViewWillEnter() {
        this.lecturaInicial();
        
   
  }

  async lecturaInicial(){
    this.grupo={
      identificador:this.autSrv.obtenerNombreUsuarioLogueado().identificador,
      fechaCreacion:new Date(),
      recorrido:"farallones",
      guiaResponsable:this.autSrv.obtenerNombreUsuarioLogueado().identificador,
      visitantes:[],
      activo:true}
      
    this.grupo=await this.grupoSrv.grupoActivo(this.grupo);
    this.fecha=this.grupo.fechaCreacion.getDate()+"/"+this.grupo.fechaCreacion.getUTCMonth()+"/"+this.grupo.fechaCreacion.getFullYear();
  
   
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
  desarmarGrupoTerminaRecorrido(){
    this.desarmarGrupoV=false;
    this.crearGrupoV=false;
    this.grupoGuardado=false;
    
    this.grupoSrv.desarmarGrupo(this.grupo).then((resp)=>{
      console.log("Terminó el recorrido",resp);
      this.lecturaInicial();
    });

  }
  triggerEvent(evento){
    console.log("Hizo clic "+evento.target.value);
    this.grupo.recorrido=evento.target.value;
  }

  async desarmarGrupo(){
 
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Elija una opción',
        subHeader: 'Subtitle',
        message: 'Usted puede.',
        buttons: [ {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Deshacer Grupo',
          role: 'deshacer',
          handler: (blah) => {
            console.log('Deshace grupo: blah');
            this.desarmarGrupoV=false;
            this.crearGrupoV=false;
            this.grupoGuardado=false;
            this.grupo.visitantes=[];
            this.grupoSrv.desarmarGrupoEliminar(this.grupo).then(resp=>{

              console.log("Grupo Elimindo");
              this.lecturaInicial();

            });
            
            
          }
        }
        ,
        {
          text: 'Terminar Recorrido',
          role: 'terminar',
          handler: (blah) => {
            this.desarmarGrupoTerminaRecorrido();
            console.log('Terminó Recorrido');
          }
        }

      
      
      ]
      });
  
      await alert.present();
    

  }
}
