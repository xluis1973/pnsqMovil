import { Component, OnInit } from '@angular/core';
import { GruposService } from '../../../services/grupos.service';
import { Usuario } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss'],
})
export class GrupoPage {

  
  constructor(private grupoSrv:GruposService) { }

  listaUsuarios:Usuario[]=[];
  async ionViewWillEnter() {
    this.listaUsuarios.splice(0, this.listaUsuarios.length);
    this.listaUsuarios= await this.grupoSrv.obtenerVisitantes();
    this.listaUsuarios.forEach(elem=>elem.ciudad='primary');
  }

  cambiaColor(indice:number){

    console.log("indice ",indice);
    console.log(this.listaUsuarios);
    if(this.listaUsuarios[indice].ciudad=='primary'){
      this.listaUsuarios[indice].ciudad='success'
    }else {this.listaUsuarios[indice].ciudad='primary'}

  }
}
