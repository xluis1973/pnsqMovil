import { Component, OnInit } from '@angular/core';
import { GruposService } from '../../../services/grupos.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss'],
})
export class GrupoPage implements OnInit {

  constructor(private grupoSrv:GruposService) { }

  ngOnInit() {
    this.grupoSrv.obtenerVisitantes().then(resp=>{
      console.log("visitantes Activos Fin de Lectura");
    });
  }

}
